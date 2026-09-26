import seed from '../readings.json';
export const readings = seed.readings;
export function publicReadings() {
    return readings.map(r => ({ ...r, questions: r.questions.map(q => ({ id: q.id, type: q.type, skill: q.skill, prompt: q.prompt, options: 'options' in q ? q.options : undefined })) }));
}
export function findReading(id: string) { return readings.find(r => r.id === id); }
export function findQuestion(id: string) { for (const r of readings) {
    const q = r.questions.find(q => q.id === id);
    if (q)
        return { r, q };
} return null; }
