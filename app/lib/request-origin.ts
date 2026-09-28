export function expectedOrigin(req: Request): string {
    if (process.env.APP_ORIGIN) return new URL(process.env.APP_ORIGIN).origin;
    if (process.env.NODE_ENV === 'production') throw new Error('APP_ORIGIN is required in production');
    const host = req.headers.get('host') || '';
    if (/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host)) return `http://${host}`;
    return new URL(req.url).origin;
}
