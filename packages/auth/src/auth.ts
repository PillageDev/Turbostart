import { expo } from '@better-auth/expo';
import { BetterAuthOptions, betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import {
  admin,
  bearer,
  createAuthMiddleware,
  magicLink,
} from 'better-auth/plugins';
import nodemailer from 'nodemailer';

import { db, eq, schema } from '@repo/db';
import serverEnv from '@repo/env/env.server';
import sharedEnv from '@repo/env/env.shared';

import { baseAvatarPlugin } from './plugins/base-avatar-plugin';

const transporter = nodemailer.createTransport({
  host: serverEnv.SMTP_HOST,
  port: serverEnv.SMTP_PORT,
  secure: serverEnv.SMTP_SECURE,
  auth: {
    user: serverEnv.SMTP_USER,
    pass: serverEnv.SMTP_PASSWORD,
  },
});

const authConfig = {
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schema,
  }),
  baseURL: sharedEnv.AUTH_BASE_URL,
  appName: sharedEnv.APP_NAME,
  plugins: [
    expo(),
    baseAvatarPlugin(),
    bearer(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        transporter.sendMail({
          from: 'Auth <auth@yourdomain.com>',
          to: email,
          subject: 'Your Magic Link',
          text: `Click the link to log in: ${url}`,
        });
      },
    }),
    admin(),
    nextCookies(),
  ],
  advanced: {
    cookiePrefix: 'app',
    useSecureCookies: serverEnv.NODE_ENV === 'production',
    crossSubDomainCookies:
      serverEnv.NODE_ENV === 'production'
        ? {
            enabled: true,
            domain: '.yourdomain.com',
          }
        : {
            enabled: false,
          },
  },
  trustedOrigins: ['http://localhost:3000'],
  emailVerification: {
    sendOnSignUp: false,
  },
  session: {
    freshAge: 0, // disable fresh sessions: we have email confirmation for deleting an account
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        transporter.sendMail({
          from: 'Auth <auth@yourdomain.com>',
          to: user.email,
          subject: 'Confirm Account Deletion',
          text: `Click the link to confirm account deletion: ${url}`,
        });
      },
    },
  },
  socialProviders: {
    github: {
      clientId: serverEnv.GITHUB_CLIENT_ID,
      clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
    },
  },
  hooks: {
    // Sets the user's name to the email prefix if the user was just created via magic link
    after: createAuthMiddleware(async (ctx) => {
      // check if it was the magic link verification route
      if (ctx.path.includes('/magic-link/verify')) {
        const user = ctx.context.newSession?.user || ctx.context.session?.user;

        let nameSet = '';
        let userNameSet = false;

        if (user) {
          if (!user.name) {
            const emailPrefix = user.email.split('@')[0];

            await db
              .update(schema.user)
              .set({ name: emailPrefix })
              .where(eq(schema.user.id, user.id));

            userNameSet = true;
            nameSet = emailPrefix;
          }

          if (!user.image) {
            let userName = user.name || '';
            if (userNameSet) {
              userName = nameSet;
            }

            const initials = userName
              .split(' ')
              .map((name: string) => name.charAt(0).toUpperCase())
              .join('');

            // set in DB
            await db
              .update(schema.user)
              .set({
                image: `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=256`,
              })
              .where(eq(schema.user.id, user.id));
          }
        }
      }
    }),
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth(authConfig) as ReturnType<
  typeof betterAuth<typeof authConfig>
>;

// fixes the type inference issue: https://github.com/better-auth/better-auth/issues/3067#issuecomment-2988246817
