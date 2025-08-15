"use client";

import { UploadButton } from "@uploadthing/react";
import type { AvatarFileRouter } from "~/api/uploadthing/core";
import { Avatar, AvatarImage } from "@repo/ui/avatar";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfileAvatarUploader({
  userId,
  initialUrl,
}: {
  userId: string;
  initialUrl: string;
}) {
  const [avatarUrl, setAvatarUrl] = useState(initialUrl);

  return (
    <div className="relative inline-block">
      <Avatar className="w-24 h-24">
        <AvatarImage src={avatarUrl} />
      </Avatar>

      <div className="absolute bottom-0 right-0">
        <UploadButton<AvatarFileRouter, "avatar">
          endpoint="avatar"
          input={{ userId }}
          onClientUploadComplete={(res) => {
            setAvatarUrl(res[0].ufsUrl);

            toast.success("Avatar uploaded successfully!");
          }}
          onUploadError={(error) => {
            toast.error(`Upload error: ${error.message}`);
          }}
        />
      </div>
    </div>
  );
}
