import { database } from '../../lib/database';
import { cookieToken, login, sessionCookie, sessionSeconds } from '../../lib/pilot-auth';
import { tokenHash } from '../../lib/passwords.mjs';
import { boundedBody, HttpError, json } from '../../lib/server';
import { expectedOrigin } from '../../lib/request-origin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
    try {
        if (req.headers.get('origin') !== expectedOrigin(req) || req.headers.get('sec-fetch-site') === 'cross-site') {
            return json({ error: 'Nguồn yêu cầu không hợp lệ.' }, 403);
        }
        const body = await boundedBody(req);
        if (!body || typeof body !== 'object') return json({ error: 'Dữ liệu không hợp lệ.' }, 400);
        const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
        if (body.op === 'logout') {
            const token = cookieToken(req.headers.get('cookie'));
            if (token) await database().prepare('DELETE FROM pilot_sessions WHERE token_hash=?').bind(tokenHash(token)).run();
            const response = json({ ok: true });
            response.headers.set('Set-Cookie', `${sessionCookie}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`);
            return response;
        }
        if (body.op !== 'login' || typeof body.username !== 'string' || typeof body.password !== 'string' ||
            !/^[a-z0-9_-]{3,32}$/.test(body.username.trim().toLowerCase()) || body.password.length > 256 || !body.password.length) {
            return json({ error: 'Vui lòng nhập tài khoản và mật khẩu được cấp.' }, 400);
        }
        // Vercel overwrites x-vercel-forwarded-for at its edge. On other hosts,
        // use one conservative shared IP bucket rather than trusting arbitrary headers.
        const ip = process.env.VERCEL ? req.headers.get('x-vercel-forwarded-for') || 'unknown' : 'local';
        const outcome = await login(body.username.trim().toLowerCase(), body.password, ip);
        if (!outcome.token) return json({ error: outcome.error }, outcome.status);
        const old = cookieToken(req.headers.get('cookie'));
        if (old) await database().prepare('DELETE FROM pilot_sessions WHERE token_hash=?').bind(tokenHash(old)).run();
        const response = json({ ok: true });
        response.headers.set('Set-Cookie', `${sessionCookie}=${outcome.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${sessionSeconds}${secure}`);
        return response;
    } catch (error) {
        if (error instanceof HttpError) return json({ error: error.message }, error.status);
        return json({ error: 'Đăng nhập chưa sẵn sàng. Vui lòng liên hệ người tổ chức thử nghiệm.' }, 503);
    }
}
