export function nextReview(level: number, rating: 'again' | 'good' | 'easy', now = Date.now()) {
    const next = rating === 'again' ? 0 : Math.min(6, level + (rating === 'easy' ? 2 : 1));
    const days = [0, 1, 3, 7, 14, 30, 60][next];
    return { level: next, due: new Date(now + (rating === 'again' ? 600000 : days * 86400000)).toISOString() };
}
export function roleForEmail(email: string, lists: {
    admin?: string;
    researcher?: string;
    moderator?: string;
}) {
    const has = (s?: string) => s?.split(',').map(x => x.trim().toLowerCase()).includes(email.toLowerCase());
    return has(lists.admin) ? 'admin' : has(lists.researcher) ? 'researcher' : has(lists.moderator) ? 'moderator' : 'learner';
}
export function localConversation(message: string, persona: string, turn: number) {
    const prompts: Record<string, string[]> = {
        'Study buddy': ['What are you studying this week? Tell me about one difficult part.', 'What have you tried so far? Give me a specific example.', 'How would you explain that idea to a classmate?', 'What will you do differently next time?'],
        'Job interviewer': ['Tell me about a project you worked on and your role.', 'What challenge did you face, and how did you respond?', 'What was the result? Can you describe it with a concrete example?', 'What did that experience teach you?'],
        'Travel partner': ['Where would you like to go, and why?', 'How would you ask a local person for directions politely?', 'Imagine your train is delayed. What would you say at the information desk?', 'Which part of the journey would you enjoy most?'],
    };
    if (/formal|informal|register|polite/i.test(message))
        return 'Formal: "Could you please clarify that point?"\nNeutral: "Could you explain that again?"\nCasual: "What do you mean?"\nChoose based on your relationship and the situation. These are prepared examples, not an analysis of your sentence.';
    return (prompts[persona] || prompts['Study buddy'])[turn % 4];
}
