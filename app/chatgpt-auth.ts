import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cookieToken, sessionUser } from './lib/pilot-auth';

// Keep the existing export names so learning screens do not need to change.
export type ChatGPTUser = { userId: string; displayName: string; email: string; fullName: string | null };
export async function getChatGPTUser(): Promise<ChatGPTUser | null> {
    const h = await headers();
    // Test impersonation is restricted to explicitly enabled local development.
    // Next production builds never accept these headers, including on localhost.
    if (process.env.NODE_ENV === 'development' && process.env.AUTH_MODE === 'local-test' && !process.env.VERCEL &&
        /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(h.get('host') || '')) {
        const userId = h.get('oai-authenticated-user-id'), email = h.get('oai-authenticated-user-email');
        if (userId && email) return { userId, email, displayName: email, fullName: null };
    }
    return sessionUser(cookieToken(h.get('cookie')));
}
export async function requireChatGPTUser(returnTo: string): Promise<ChatGPTUser> {
    const user = await getChatGPTUser();
    if (user) return user;
    redirect(chatGPTSignInPath(returnTo));
}
export function chatGPTSignInPath(_returnTo = '/') { return '/login'; }
export function chatGPTSignOutPath(_returnTo = '/') { return '/logout'; }
