import { createClient, type Client, type InValue, type ResultSet } from '@libsql/client';
type Row = Record<string, unknown>;
function result<T>(value: ResultSet) {
    return { results: value.rows as unknown as T[], meta: { changes: value.rowsAffected }, success: true };
}
class Statement {
    constructor(readonly client: Client, readonly sql: string, readonly args: InValue[] = []) {}
    bind(...args: InValue[]) { return new Statement(this.client, this.sql, args); }
    async all<T = Row>() { return result<T>(await this.client.execute({ sql: this.sql, args: this.args })); }
    async first<T = Row>(): Promise<T | null> { return (await this.all<T>()).results[0] ?? null; }
    async run() { return this.all(); }
}
export function databaseAdapter(client: Client) {
    return {
        prepare: (sql: string) => new Statement(client, sql),
        // libSQL preserves the existing atomic batch behavior: all succeed or all roll back.
        batch: async <T = Row>(statements: Statement[]) => (await client.batch(
            statements.map(s => ({ sql: s.sql, args: s.args })), 'write',
        )).map(value => result<T>(value)),
    };
}
let connection: ReturnType<typeof databaseAdapter> | undefined;
export function database() {
    if (!connection) {
        const url = process.env.TURSO_DATABASE_URL;
        if (!url) throw new Error('TURSO_DATABASE_URL is not configured');
        if (process.env.VERCEL && !url.startsWith('libsql://') && !url.startsWith('https://')) {
            throw new Error('Vercel requires a persistent remote database');
        }
        connection = databaseAdapter(createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN }));
    }
    return connection;
}
