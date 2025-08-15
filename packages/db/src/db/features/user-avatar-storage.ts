import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { user } from '../auth';

export const userAvatarStorage = pgTable('user_avatar_storage', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
