import { getChatGPTUser, chatGPTSignInPath, chatGPTSignOutPath } from './chatgpt-auth';
import Pilot from './pilot';
export const dynamic = 'force-dynamic';
export default async function Page() {
 const user = await getChatGPTUser();
 const authLabel = 'tài khoản thử nghiệm';
 return <Pilot signedIn={!!user} signInPath={chatGPTSignInPath('/')} signOutPath={chatGPTSignOutPath()} authLabel={authLabel} />;
}

