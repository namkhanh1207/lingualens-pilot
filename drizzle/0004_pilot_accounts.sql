CREATE TABLE pilot_accounts (
    id TEXT PRIMARY KEY NOT NULL,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    disabled INTEGER NOT NULL DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE pilot_sessions (
    token_hash TEXT PRIMARY KEY NOT NULL,
    account_id TEXT NOT NULL REFERENCES pilot_accounts(id) ON DELETE CASCADE,
    expires INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX pilot_sessions_account ON pilot_sessions(account_id);
--> statement-breakpoint
CREATE TABLE pilot_login_limits (
    key TEXT PRIMARY KEY NOT NULL,
    attempts INTEGER NOT NULL,
    expires INTEGER NOT NULL
);
