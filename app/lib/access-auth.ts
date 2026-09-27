import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose';

export type AccessConfig = { ACCESS_TEAM_DOMAIN?: string; ACCESS_AUD?: string };
const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

export function accessIssuer(config: AccessConfig): string | null {
    const value = config.ACCESS_TEAM_DOMAIN?.replace(/\/$/, '');
    // Never fetch keys from a URL or issuer supplied by an incoming token.
    return value && /^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(value) ? value : null;
}

export async function verifyAccessToken(token: string | null, config: AccessConfig, testKeys?: JWTVerifyGetKey) {
    const issuer = accessIssuer(config), audience = config.ACCESS_AUD?.trim();
    if (!token || token.length > 16384 || !issuer || !audience) return null;
    try {
        let keys = testKeys || keySets.get(issuer);
        if (!keys) {
            const remoteKeys = createRemoteJWKSet(new URL(issuer + '/cdn-cgi/access/certs'), { timeoutDuration: 5000 });
            keySets.set(issuer, remoteKeys);
            keys = remoteKeys;
        }
        const { payload } = await jwtVerify(token, keys, {
            issuer, audience, algorithms: ['RS256'], requiredClaims: ['sub', 'email', 'exp', 'iat'],
        });
        if (payload.type !== 'app' || typeof payload.sub !== 'string' || !payload.sub ||
            typeof payload.email !== 'string' || !payload.email.includes('@')) return null;
        const email = payload.email.trim().toLowerCase();
        // Namespace identities: never accidentally reuse a Sites or different team's account.
        return { userId: `access:${issuer}:${payload.sub}`, email, displayName: email, fullName: null };
    } catch {
        // An invalid/expired token or unavailable key service must never fall back to raw headers.
        return null;
    }
}
