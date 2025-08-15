import { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("app", {
    description: "Generate a new app",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of your app?",
        validate: (input: string) => {
          if (input.includes(" ")) {
            return "app name cannot include spaces";
          }
          if (!input) {
            return "app name is required";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "port",
        message: "What port should the app run on?",
        default: "3000",
        validate: (input: string) => {
          const port = parseInt(input, 10);
          if (isNaN(port) || port < 1 || port > 65535) {
            return "port must be a number between 1 and 65535";
          }
          return true;
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase name }}/package.json",
        templateFile: "templates/app/app-package.hbs",
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase name }}/.gitignore",
        templateFile: "templates/app/app-gitignore.hbs",
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase name }}/eslint.config.js",
        templateFile: "templates/app/app-eslint-config.hbs",
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase name }}/next-env.d.ts",
        templateFile: "templates/app/app-next-env.hbs",
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase name }}/next.config.js",
        templateFile: "templates/app/app-next-config.hbs",
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase name }}/tsconfig.json",
        templateFile: "templates/app/app-tsconfig.hbs",
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase name }}/postcss.config.js",
        templateFile: "templates/app/app-postcss.hbs",
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase name }}/components/providers.tsx",
        templateFile: "templates/app/components/app-providers.hbs",
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase name }}/components/i18n/index.ts",
        templateFile: "templates/app/components/i18n/app-index.hbs",
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase name }}/components/i18n/Trans.tsx",
        templateFile: "templates/app/components/i18n/app-trans.hbs",
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase name }}/app/layout.tsx",
        templateFile: "templates/app/app/app-layout.hbs",
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase name }}/app/page.tsx",
        templateFile: "templates/app/app/app-page.hbs",
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase name }}/lib/i18n/request.ts",
        templateFile: "templates/app/lib/i18n/app-request.hbs",
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase name }}/messages/en/common.json",
        templateFile: "templates/app/messages/en/app-common.hbs",
      },
    ],
  });
  plop.setGenerator("package", {
    description: "Generate a new package",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of your package?",
        validate: (input: string) => {
          if (input.includes(" ")) {
            return "package name cannot include spaces";
          }
          if (!input) {
            return "package name is required";
          }
          return true;
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/{{ dashCase name }}/package.json",
        templateFile: "templates/package/package-package.hbs",
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/{{ dashCase name }}/eslint.config.mjs",
        templateFile: "templates/package/package-eslint.hbs",
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/{{ dashCase name }}/tsconfig.json",
        templateFile: "templates/package/package-tsconfig.hbs",
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/{{ dashCase name }}/src/index.ts",
        templateFile: "templates/package/src/package-index.hbs",
      },
    ],
  });
}
