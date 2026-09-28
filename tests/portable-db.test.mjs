import assert from 'node:assert/strict';
import { createClient } from '@libsql/client';
import { migrate } from '../scripts/migrate-turso.mjs';
import { hashPassword, verifyPassword } from '../app/lib/passwords.mjs';
const client = createClient({ url: 'file::memory:' });
try {
    await migrate(client);
    await migrate(client);
    assert.equal((await client.execute('SELECT COUNT(*) n FROM pilot_migrations')).rows[0].n, 5);
    await client.execute("INSERT INTO users(id,name,created) VALUES ('alice','Alice','now')");
    const before = (await client.execute('SELECT revision FROM research_revision WHERE id=1')).rows[0].revision;
    await client.execute("INSERT INTO records(owner,kind,id,data,updated) VALUES ('alice','skill_path','one','{}','now')");
    const after = (await client.execute('SELECT revision FROM research_revision WHERE id=1')).rows[0].revision;
    assert.ok(after > before, 'research revision triggers preserved');
    await assert.rejects(client.batch([
        "INSERT INTO users(id,name,created) VALUES ('bob','Bob','now')",
        "INSERT INTO users(id,name,created) VALUES ('alice','duplicate','now')",
    ], 'write'));
    assert.equal((await client.execute("SELECT * FROM users WHERE id='bob'")).rows.length, 0, 'batch failure rolls back preceding writes');
    const hash = await hashPassword('test-only-long-password');
    assert.ok(await verifyPassword('test-only-long-password', hash));
    assert.equal(await verifyPassword('wrong', hash), false);
    assert.equal(await verifyPassword('anything', 'corrupt'), false);
    assert.notEqual(hash, await hashPassword('test-only-long-password'), 'unique password salts');
    console.log('PASS Turso migrations, repeat migration, revision tracking, transactional rollback, password verification and salts.');
} finally { client.close(); }
