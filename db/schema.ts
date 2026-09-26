import { sqliteTable, text, integer, index, uniqueIndex, primaryKey } from 'drizzle-orm/sqlite-core';
export const users = sqliteTable('users', {
    id: text('id').primaryKey(), name: text('name').notNull(), cefr: text('cefr').notNull().default('B1'),
    goal: text('goal').notNull().default('Reading'), research: integer('research').notNull().default(0),
    aiConsent: integer('ai_consent').notNull().default(0), created: text('created').notNull(),
});
export const records = sqliteTable('records', {
    id: text('id').notNull(), owner: text('owner').notNull(), kind: text('kind').notNull(), data: text('data').notNull(), updated: text('updated').notNull(),
}, t => [primaryKey({ columns: [t.owner, t.kind, t.id] }), index('idx_records_owner_kind').on(t.owner, t.kind)]);
export const posts = sqliteTable('posts', {
    id: text('id').primaryKey(), owner: text('owner').notNull(), name: text('name').notNull(), title: text('title').notNull(), body: text('body').notNull(), hidden: integer('hidden').notNull().default(0), created: text('created').notNull(),
});
export const comments = sqliteTable('comments', {
    id: text('id').primaryKey(), post: text('post').notNull(), owner: text('owner').notNull(), name: text('name').notNull(), body: text('body').notNull(), created: text('created').notNull(),
}, t => [index('idx_comments_post').on(t.post)]);
export const events = sqliteTable('events', {
    id: text('id').primaryKey(), owner: text('owner').notNull(), session: text('session').notNull(), type: text('type').notNull(), data: text('data').notNull(), created: text('created').notNull(),
}, t => [index('idx_events_owner').on(t.owner), index('idx_events_session').on(t.session)]);
export const usage = sqliteTable('usage', {
    owner: text('owner').notNull(), day: text('day').notNull(), count: integer('count').notNull().default(0),
}, t => [primaryKey({ columns: [t.owner, t.day] })]);

export const researchIdentities = sqliteTable('research_identities', {
    owner: text('owner').primaryKey(), participant: text('participant').notNull().unique(),
});
export const contentVersions = sqliteTable('content_versions', {
    id: text('id').primaryKey(), data: text('data').notNull(), created: text('created').notNull(),
});
export const learningHistory = sqliteTable('learning_history', {
    sequence: integer('sequence').primaryKey({ autoIncrement: true }),
    owner: text('owner').notNull(), request: text('request').notNull(), session: text('session').notNull(),
    operation: text('operation').notNull(), question: text('question').notNull(),
    input: text('input').notNull(), data: text('data').notNull(), response: text('response').notNull(), created: text('created').notNull(),
}, t => [index('history_owner_session').on(t.owner, t.session), uniqueIndex('history_owner_request').on(t.owner, t.request)]);
export const researchRevision = sqliteTable('research_revision', {
    id: integer('id').primaryKey(), revision: integer('revision').notNull().default(0),
});
