"use client";

import { User } from "better-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import Trans from "~/components/i18n";
import { Button } from "@repo/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { useForm } from "react-hook-form";
import ProfileAvatarUploader from "./avatar-upload";
import { createUserUpdateService } from "../_lib/user-update.service";
import { toast } from "sonner";
import { authClient } from "@repo/auth/client";

interface InputField<T> {
  name: string; // form field name
  zodSchema: z.ZodType<T>;
  label: string;
  placeholder: string;
  default: (user: User) => T;
  type: "text" | "email" | "password" | "number" | "file";
}

interface Setting {
  title: string;
  description: string;
  subDescription: string;
  inputs: InputField<any>[];
  onSubmit: (values: any, user: User) => void;
}

const settings: Setting[] = [
  {
    title: "Name",
    description: "Please enter your full name, or display name",
    subDescription: "Please use 32 characters at maximum.",
    inputs: [
      {
        name: "name",
        label: "Name",
        placeholder: "John Doe",
        default: (user) => user.name,
        type: "text",
        zodSchema: z
          .string()
          .max(32, "Name must be 32 characters or less")
          .min(1, "Name is required"),
      },
    ],
    onSubmit: (values, user) => {
      const userUpdateService = createUserUpdateService();
      userUpdateService.updateUserName(user.id, values.name);
    },
  },
  {
    title: "Profile Picture",
    description: "Update your profile picture.",
    subDescription: "Max file size 2MB. JPG or PNG only.",
    inputs: [
      {
        name: "avatar",
        label: "Profile Picture",
        placeholder: "",
        default: () => null, // we handle current pic separately
        type: "file",
        zodSchema: z.any(),
      },
    ],
    onSubmit: () => {
      // handled by the upload api
    },
  },
];
export function ProfileCard({ user }: { user: User }) {
  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          <Trans namespace="login" i18nKey="Profile.title" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {settings.map((setting) => (
          <SettingCard key={setting.title} setting={setting} user={user} />
        ))}
      </CardContent>
      <CardFooter className="border-t bg-background/80 flex flex-row justify-center">
        <Button
          variant="destructive"
          size="sm"
          onClick={async () => {
            await authClient.deleteUser();
            toast.success("Please check your email for a confirmation link.");
          }}
        >
          Delete Account (Confirmation)
        </Button>
      </CardFooter>
    </Card>
  );
}

function SettingCard({ setting, user }: { setting: Setting; user: User }) {
  const mergedSchema = z.object(
    setting.inputs.reduce(
      (acc, field) => {
        acc[field.name] = field.zodSchema;
        return acc;
      },
      {} as Record<string, z.ZodTypeAny>,
    ),
  );

  const form = useForm<z.infer<typeof mergedSchema>>({
    resolver: zodResolver(mergedSchema),
    defaultValues: setting.inputs.reduce(
      (acc, field) => {
        acc[field.name] = field.default(user);
        return acc;
      },
      {} as Record<string, any>,
    ),
  });

  const isAvatarCard = setting.inputs.some((input) => input.type === "file");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => setting.onSubmit(values, user))}
        className="flex flex-col h-full"
      >
        <Card className="flex flex-col flex-1">
          <CardHeader>
            <CardTitle className="text-lg">{setting.title}</CardTitle>
            <CardDescription>{setting.description}</CardDescription>
          </CardHeader>

          <CardContent className="flex-1">
            <div className="flex flex-col gap-4">
              {setting.inputs.map((input) => {
                if (input.type === "file") {
                  return (
                    <ProfileAvatarUploader
                      key={input.name}
                      userId={user.id}
                      initialUrl={user.image || ""}
                    />
                  );
                }

                // default fields
                return (
                  <FormField
                    key={input.name}
                    control={form.control}
                    name={input.name as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{input.label}</FormLabel>
                        <FormControl>
                          {/* @ts-expect-error the value is passed in*/}
                          <Input
                            type={input.type}
                            placeholder={input.placeholder}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}
            </div>
          </CardContent>

          {!isAvatarCard && (
            <CardFooter className="flex items-center justify-between gap-3 border-t bg-background/80">
              <p className="text-sm text-muted-foreground">
                {setting.subDescription}
              </p>
              <Button
                size="sm"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                Save
              </Button>
            </CardFooter>
          )}
        </Card>
      </form>
    </Form>
  );
}
