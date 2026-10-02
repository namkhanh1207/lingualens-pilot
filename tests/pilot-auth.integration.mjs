import assert from 'node:assert/strict';
import { createClient } from '@libsql/client';
import { randomUUID } from 'node:crypto';
import { hashPassword, tokenHash } from '../app/lib/passwords.mjs';
const base = process.env.PILOT_AUTH_TEST_URL || 'http://127.0.0.1:5182';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
assert.ok(process.env.TURSO_DATABASE_URL?.startsWith('file:'), 'Auth tests only write to a local test database');
const client = createClient({ url: process.env.TURSO_DATABASE_URL });
const id = randomUUID(), username = 'qa_' + id.slice(0, 8), password = randomUUID();
const admin = username + '_admin';
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks++; console.log('PASS', message); };
async function auth(body, cookie = '', origin = base) {
    return fetch(base + '/api/auth', { method: 'POST', headers: { Origin: origin, Cookie: cookie, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}
const signin = (name = username, pass = password, cookie = '') => auth({ op: 'login', username: name, password: pass }, cookie);
const privateGet = cookie => fetch(base + '/api/pilot', { headers: { Cookie: cookie } });
const cookieOf = response => response.headers.get('set-cookie')?.split(';')[0] ?? '';
try {
    await client.execute({ sql: 'DELETE FROM pilot_login_limits WHERE key=?', args: [tokenHash('ip:local')] });
    await client.batch([
        { sql: 'INSERT INTO pilot_accounts(id,username,email,password_hash) VALUES (?,?,?,?)', args: [id, username, username + '@test.invalid', await hashPassword(password)] },
        { sql: 'INSERT INTO pilot_accounts(id,username,email,password_hash) VALUES (?,?,?,?)', args: [id + '-admin', admin, 'test-admin@sites.test', await hashPassword(password)] },
    ], 'write');
    check((await privateGet('')).status === 401, 'anonymous private request rejected');
    check((await fetch(base + '/api/pilot', { headers: { 'oai-authenticated-user-id': id, 'oai-authenticated-user-email': 'test-admin@sites.test' } })).status === 401, 'production ignores forged identity headers even with AUTH_MODE=local-test');
    check((await auth({ op: 'login', username, password }, '', 'https://other.invalid')).status === 403, 'cross-origin login blocked');
    check((await auth({ op: 'login', username, password }, '', '')).status === 403, 'missing Origin rejected for auth mutations');
    check((await signin(username, 'wrong')).status === 401, 'incorrect password rejected');
    const signed = await signin();
    check(signed.status === 200, 'valid account signs in');
    const cookie = cookieOf(signed), rawCookie = signed.headers.get('set-cookie');
    check(rawCookie.includes('HttpOnly') && rawCookie.includes('Secure') && rawCookie.includes('SameSite=Lax'), 'production session cookie has security attributes');
    check(!(await signed.text()).includes(cookie.split('=')[1]), 'session token is not exposed in response JSON');
    const stored = await client.execute({ sql: 'SELECT token_hash FROM pilot_sessions WHERE account_id=?', args: [id] });
    check(stored.rows[0].token_hash === tokenHash(cookie.split('=')[1]), 'database stores only session token hashes');
    check((await privateGet(cookie)).status === 200, 'cookie authenticates private data');
    const save = await fetch(base + '/api/pilot', { method: 'POST', headers: { Cookie: cookie, Origin: base, 'Content-Type': 'application/json' }, body: JSON.stringify({op:'profile',name:'Auth QA',cefr:'B1',goal:'Reading',research:false,aiConsent:false}) });
    check(save.status === 200, 'browser-origin authenticated learning mutation succeeds');
    check((await fetch(base + '/api/pilot', { method: 'POST', headers: { Cookie: cookie, 'Content-Type': 'application/json' }, body: JSON.stringify({op:'bookmark',reading:'campus-cups'}) })).status === 403, 'production learning mutations require an Origin');
    check((await fetch(base + '/api/pilot?view=admin', { headers: { Cookie: cookie } })).status === 403, 'learner has no admin access');
    const adminCookie = cookieOf(await signin(admin));
    check((await fetch(base + '/api/pilot?view=admin', { headers: { Cookie: adminCookie } })).status === 200, 'organizer allowlist grants admin access');
    const forged = 'lingualens_session=' + 'a'.repeat(64);
    check((await privateGet(forged)).status === 401, 'fabricated session token rejected');
    const rotated = cookieOf(await signin(username, password, cookie));
    check(rotated !== cookie && (await privateGet(cookie)).status === 401, 'login rotates and revokes previous browser session');
    check((await auth({ op: 'logout' }, rotated, 'https://other.invalid')).status === 403, 'cross-origin logout blocked');
    check((await auth({ op: 'logout' }, rotated)).status === 200, 'logout succeeds');
    check((await privateGet(rotated)).status === 401, 'logged-out token cannot be replayed');
    const expired = cookieOf(await signin());
    await client.execute({ sql: 'UPDATE pilot_sessions SET expires=0 WHERE account_id=?', args: [id] });
    check((await privateGet(expired)).status === 401, 'expired session rejected');
    const disabledCookie = cookieOf(await signin());
    await client.execute({ sql: 'UPDATE pilot_accounts SET disabled=1 WHERE id=?', args: [id] });
    check((await privateGet(disabledCookie)).status === 401 && (await signin()).status === 401, 'disabled account loses existing and new sessions');
    await client.execute({ sql: 'UPDATE pilot_accounts SET disabled=0 WHERE id=?', args: [id] });
    const attempts = await Promise.all(Array.from({ length: 10 }, () => signin(username, 'incorrect')));
    check(attempts.some(r => r.status === 429), 'concurrent password guessing is rate limited in persistent storage');
    check((await signin()).status === 429, 'lockout applies even to a correct password');
    check((await auth(null)).status === 400, 'malformed payload rejected');
    console.log(`SUCCESS: ${checks} production authentication checks passed.`);
} finally {
    // Remove only this test's accounts and generated learner profiles.
    await client.batch([
        { sql: 'DELETE FROM pilot_sessions WHERE account_id IN (?,?)', args: [id, id + '-admin'] },
        { sql: 'DELETE FROM pilot_accounts WHERE id IN (?,?)', args: [id, id + '-admin'] },
        { sql: 'DELETE FROM research_identities WHERE owner IN (?,?)', args: [id, id + '-admin'] },
        { sql: 'DELETE FROM records WHERE owner IN (?,?)', args: [id, id + '-admin'] },
        { sql: 'DELETE FROM users WHERE id IN (?,?)', args: [id, id + '-admin'] },
        { sql: 'DELETE FROM pilot_login_limits WHERE key IN (?,?,?)', args: [tokenHash('ip:local'), tokenHash('user:' + username), tokenHash('user:' + admin)] },
    ], 'write');
    client.close();
}
