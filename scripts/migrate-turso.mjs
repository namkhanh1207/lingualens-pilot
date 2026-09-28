import { createClient } from '@libsql/client';
import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
export async function migrate(client) {
    await client.execute('CREATE TABLE IF NOT EXISTS pilot_migrations (name TEXT PRIMARY KEY, checksum TEXT NOT NULL)');
    const folder = new URL('../drizzle/', import.meta.url);
    const names = (await readdir(folder)).filter(name => /^\d{4}_.+\.sql$/.test(name)).sort();
    for (const name of names) {
        const sql = await readFile(new URL(name, folder), 'utf8');
        const checksum = createHash('sha256').update(sql.replace(/\r\n/g, '\n')).digest('hex');
        const done = await client.execute({ sql: 'SELECT checksum FROM pilot_migrations WHERE name=?', args: [name] });
        if (done.rows.length) {
            if (done.rows[0].checksum !== checksum) throw new Error(`Previously applied migration changed: ${name}`);
            continue;
        }
        const statements = sql.split('--> statement-breakpoint').map(part => part.trim()).filter(Boolean);
        await client.batch([...statements, { sql: 'INSERT INTO pilot_migrations(name,checksum) VALUES (?,?)', args: [name, checksum] }], 'write');
        console.log(`Applied ${name}`);
    }
}
if (process.argv[1] && import.meta.url === (await import('node:url')).pathToFileURL(process.argv[1]).href) {
    if (!process.env.TURSO_DATABASE_URL) throw new Error('Set TURSO_DATABASE_URL in .env.local first.');
    const client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
    try { await migrate(client); console.log('Database is ready.'); }
    finally { client.close(); }
}
