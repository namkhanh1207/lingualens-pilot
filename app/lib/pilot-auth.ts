import { randomBytes } from 'node:crypto';
import { database } from './database';
import { tokenHash, verifyPassword, dummyPasswordHash } from './passwords.mjs';

export const sessionCookie = 'lingualens_session';
export const sessionSeconds = 7 * 24 * 60 * 60;
export function cookieToken(header: string | null) {
    return header?.split(';').map(part => part.trim()).find(part => part.startsWith(sessionCookie + '='))?.slice(sessionCookie.length + 1) ?? '';
}
export async function sessionUser(token: string) {
    if (!/^[a-f0-9]{64}$/.test(token)) return null;
    const row = await database().prepare(`SELECT a.id,a.username,a.email FROM pilot_sessions s
        JOIN pilot_accounts a ON a.id=s.account_id
        WHERE s.token_hash=? AND s.expires>? AND a.disabled=0`).bind(tokenHash(token), Date.now())
        .first<{ id: string; username: string; email: string }>();
    return row ? { userId: row.id, displayName: row.username, email: row.email, fullName: null } : null;
}
export async function login(username: string, password: string, ip: string) {
    const db = database(), now = Date.now(), expires = now + 15 * 60 * 1000;
    const counters = await db.batch([
        db.prepare('DELETE FROM pilot_login_limits WHERE expires<?').bind(now),
        db.prepare('DELETE FROM pilot_sessions WHERE expires<?').bind(now),
        ...['user:' + username, 'ip:' + ip].map(key => db.prepare(`
            INSERT INTO pilot_login_limits(key,attempts,expires) VALUES (?,1,?)
            ON CONFLICT(key) DO UPDATE SET attempts=attempts+1 RETURNING attempts
        `).bind(tokenHash(key), expires)),
    ]);
    if (Number(counters[2].results[0].attempts) > 8 || Number(counters[3].results[0].attempts) > 40) {
        return { error: 'Bạn đã thử quá nhiều lần. Vui lòng chờ 15 phút.', status: 429 } as const;
    }
    const account = await db.prepare('SELECT id,password_hash,disabled FROM pilot_accounts WHERE username=?')
        .bind(username).first<{ id: string; password_hash: string; disabled: number }>();
    const valid = await verifyPassword(password, account?.password_hash ?? dummyPasswordHash);
    if (!valid || !account || account.disabled) return { error: 'Tài khoản hoặc mật khẩu chưa đúng.', status: 401 } as const;
    const token = randomBytes(32).toString('hex');
    await db.batch([
        db.prepare('DELETE FROM pilot_login_limits WHERE key=?').bind(tokenHash('user:' + username)),
        db.prepare('INSERT INTO pilot_sessions(token_hash,account_id,expires) VALUES (?,?,?)').bind(tokenHash(token), account.id, now + sessionSeconds * 1000),
    ]);
    return { token, status: 200 } as const;
}
