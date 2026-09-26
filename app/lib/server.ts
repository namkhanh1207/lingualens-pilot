import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../chatgpt-auth';
import { roleForEmail } from './learning';
export class HttpError extends Error {
    constructor(public status: number, message: string) { super(message); }
}
export const db = () => {
    const database = env.DB || (env as any).LINGUALENS_DB;
    if (!database) throw new HttpError(503, 'Kho dữ liệu chưa sẵn sàng. Vui lòng thử lại.');
    return database;
};
export const now = () => new Date().toISOString();
export async function identity() {
    const u = await getChatGPTUser();
    if (!u)
        throw new HttpError(401, 'Vui lòng đăng nhập để tiếp tục.');
    const role = roleForEmail(u.email, { admin: env.ADMIN_EMAILS, researcher: env.RESEARCHER_EMAILS, moderator: env.MODERATOR_EMAILS });
    return { ...u, role };
}
export async function profile(u: Awaited<ReturnType<typeof identity>>) {
    await db().prepare('INSERT OR IGNORE INTO users (id,name,created) VALUES (?,?,?)').bind(u.userId, 'Người học', now()).run();
    await db().prepare('INSERT OR IGNORE INTO research_identities (owner,participant) VALUES (?,?)').bind(u.userId, 'P-' + crypto.randomUUID()).run();
    return await db().prepare('SELECT * FROM users WHERE id=?').bind(u.userId).first() as {
        id: string;
        name: string;
        cefr: string;
        goal: string;
        research: number;
        ai_consent: number;
        created: string;
    };
}
export async function record(owner: string, kind: string, id: string) {
    const row = await db().prepare('SELECT data FROM records WHERE owner=? AND kind=? AND id=?').bind(owner, kind, id).first<{
        data: string;
    }>();
    return row ? JSON.parse(row.data) : null;
}
export async function save(owner: string, kind: string, id: string, data: unknown) {
    await db().prepare('INSERT INTO records (owner,kind,id,data,updated) VALUES (?,?,?,?,?) ON CONFLICT(owner,kind,id) DO UPDATE SET data=excluded.data,updated=excluded.updated').bind(owner, kind, id, JSON.stringify(data), now()).run();
}
export async function list(owner: string, kind?: string) {
    const result = kind ? await db().prepare('SELECT * FROM records WHERE owner=? AND kind=? ORDER BY updated DESC').bind(owner, kind).all() : await db().prepare('SELECT * FROM records WHERE owner=? ORDER BY updated DESC').bind(owner).all();
    return result.results.map(r => ({ id: r.id as string, owner: r.owner as string, kind: r.kind as string, updated: r.updated as string, data: JSON.parse(r.data as string) }));
}
export function requireRole(role: string, allowed: string[]) { if (!allowed.includes(role))
    throw new HttpError(403, 'Tài khoản không có quyền thực hiện thao tác này.'); }
export function checkOrigin(req: Request) {
    if (req.headers.get('sec-fetch-site') === 'cross-site')
        throw new HttpError(403, 'Yêu cầu khác nguồn bị từ chối.');
    const origin = req.headers.get('origin');
    if (origin && new URL(origin).host !== new URL(req.url).host)
        throw new HttpError(403, 'Nguồn yêu cầu không hợp lệ.');
}
export function json(data: unknown, status = 200) { return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } }); }
export async function boundedBody(req: Request) {
    const reader = req.body?.getReader();
    if (!reader) throw new HttpError(400, 'Thiếu nội dung yêu cầu.');
    const decoder = new TextDecoder();
    let raw = '', bytes = 0;
    while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        bytes += chunk.value.byteLength;
        if (bytes > 32000) { await reader.cancel(); throw new HttpError(413, 'Nội dung quá dài.'); }
        raw += decoder.decode(chunk.value, { stream: true });
    }
    raw += decoder.decode();
    try { return JSON.parse(raw); }
    catch { throw new HttpError(400, 'Dữ liệu không hợp lệ.'); }
}
export async function limited(owner: string, key: string, max: number) {
    const day = now().slice(0, 10) + ':' + key;
    const result = await db().prepare('INSERT INTO usage (owner,day,count) VALUES (?,?,1) ON CONFLICT(owner,day) DO UPDATE SET count=count+1 WHERE count<? RETURNING count').bind(owner, day, max).first();
    if (!result)
        throw new HttpError(429, 'Bạn đã đạt giới hạn hôm nay. Hãy tiếp tục với bài tập soạn sẵn.');
}
