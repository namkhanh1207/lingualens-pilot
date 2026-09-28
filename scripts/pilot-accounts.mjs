import { createClient } from '@libsql/client';
import { mkdir, writeFile } from 'node:fs/promises';
import { randomBytes, randomUUID } from 'node:crypto';
import { hashPassword } from '../app/lib/passwords.mjs';

if (!process.env.TURSO_DATABASE_URL) throw new Error('Set TURSO_DATABASE_URL in .env.local first.');
const client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const reset = process.argv.includes('--reset');
const username = reset ? process.argv[process.argv.indexOf('--reset') + 1] : null;
const outputDir = new URL('../.pilot-private/', import.meta.url);
await mkdir(outputDir, { recursive: true });
try {
    if (reset) {
        if (!username || !/^[a-z0-9_-]{3,32}$/.test(username)) throw new Error('Usage: npm run pilot:reset -- pilot01');
        const found = await client.execute({ sql: 'SELECT id FROM pilot_accounts WHERE username=?', args: [username] });
        if (!found.rows.length) throw new Error('Account not found.');
        const password = randomBytes(15).toString('base64url');
        const file = new URL(`reset-${username}-${Date.now()}.json`, outputDir);
        await writeFile(file, JSON.stringify({ username, password }, null, 2), { flag: 'wx', mode: 0o600 });
        await client.batch([
            { sql: 'UPDATE pilot_accounts SET password_hash=? WHERE username=?', args: [await hashPassword(password), username] },
            { sql: 'DELETE FROM pilot_sessions WHERE account_id=?', args: [found.rows[0].id] },
        ], 'write');
        console.log(`Password reset; previous sessions revoked. Private credentials saved in ${file.pathname}`);
    } else {
        const admin = process.env.ADMIN_EMAILS?.split(',')[0]?.trim().toLowerCase();
        if (!admin || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin)) throw new Error('Set ADMIN_EMAILS to the organizer email before creating accounts.');
        const accounts = [{ username: 'admin', email: admin }, ...Array.from({ length: 5 }, (_, i) => ({ username: `pilot0${i + 1}`, email: `pilot0${i + 1}@lingualens.invalid` }))];
        const created = [], statements = [];
        for (const account of accounts) {
            const existing = await client.execute({ sql: 'SELECT id FROM pilot_accounts WHERE username=?', args: [account.username] });
            if (existing.rows.length) continue; // Never reset passwords or delete data by rerunning setup.
            const password = randomBytes(15).toString('base64url');
            created.push({ ...account, password });
            statements.push({ sql: 'INSERT INTO pilot_accounts(id,username,email,password_hash) VALUES (?,?,?,?)', args: ['pilot:' + randomUUID(), account.username, account.email, await hashPassword(password)] });
        }
        if (statements.length) {
            const file = new URL(`accounts-${Date.now()}.json`, outputDir);
            await writeFile(file, JSON.stringify(created, null, 2), { flag: 'wx', mode: 0o600 });
            await client.batch(statements, 'write');
            console.log(`Created ${created.length} accounts. Private credentials saved in ${file.pathname}`);
        } else console.log('Accounts already exist. No passwords changed.');
    }
} finally { client.close(); }
