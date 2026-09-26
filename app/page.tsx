import { getChatGPTUser, chatGPTSignInPath } from './chatgpt-auth';
import Pilot from './pilot';
export const dynamic = 'force-dynamic';
export default async function Page() {
 const user = await getChatGPTUser();
 return <Pilot signedIn={!!user} signInPath={chatGPTSignInPath('/')} />;
}

