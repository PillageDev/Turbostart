import { BetterAuthPlugin } from 'better-auth';
import { createAuthMiddleware } from 'better-auth/api';

export const baseAvatarPlugin = () =>
  ({
    id: 'base-avatar',
    hooks: {
      before: [
        {
          // generic sign ups
          matcher: (context) => context.path.startsWith('/sign-up'),
          handler: createAuthMiddleware(async (ctx) => {
            const initials = ctx.body.name
              .split(' ')
              .map((name: string) => name.charAt(0).toUpperCase())
              .join('');

            ctx.body.image = `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=256`;
          }),
        },
        // magic link handled in the auth hook due to the way the plugin is loaded
        // no need to do it for oauth, as the provider will handle the image
      ],
    },
  }) satisfies BetterAuthPlugin;
