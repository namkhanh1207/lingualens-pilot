import { getChatGPTUser, chatGPTSignInPath, chatGPTSignOutPath } from './chatgpt-auth';
import { env } from 'cloudflare:workers';
import Pilot from './pilot';
export const dynamic = 'force-dynamic';
export default async function Page() {
 const user = await getChatGPTUser();
 const authLabel = env.AUTH_MODE === 'sites' ? 'ChatGPT' : env.AUTH_MODE === 'local-test' ? 'tài khoản thử trên máy' : 'Cloudflare Access';
 return <Pilot signedIn={!!user} signInPath={chatGPTSignInPath('/')} signOutPath={chatGPTSignOutPath()} authLabel={authLabel} />;
}

