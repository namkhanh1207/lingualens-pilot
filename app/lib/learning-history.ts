import { db, HttpError, now } from './server';
import { findReading } from './content';

export async function fingerprint(value: string) {
    return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), x => x.toString(16).padStart(2, '0')).join('');
}

export async function freezeReading(reading: NonNullable<ReturnType<typeof findReading>>) {
    const data = JSON.stringify(reading), version = await fingerprint(data);
    await db().prepare('INSERT OR IGNORE INTO content_versions (id,data,created) VALUES (?,?,?)').bind(version, data, now()).run();
    return version;
}

export async function sessionReading(session: Record<string, any>) {
    if (session.contentVersion) {
        const row = await db().prepare('SELECT data FROM content_versions WHERE id=?').bind(session.contentVersion).first<{data: string}>();
        if (!row) throw new HttpError(409, 'Không tìm thấy phiên bản học liệu của buổi học. Vui lòng gửi hỗ trợ.');
        return JSON.parse(row.data) as NonNullable<ReturnType<typeof findReading>>;
    }
    const reading = findReading(session.reading);
    if (!reading) throw new HttpError(404, 'Không tìm thấy bài đọc.');
    return reading;
}

type Input = { op: 'answer' | 'hint'; requestId: string; session: string; question: string; answer?: string };

export async function learningAction(owner: string, input: Input) {
    const signature = JSON.stringify([input.op, input.session, input.question, input.answer ?? null]);
    const replay = async () => {
        const row = await db().prepare('SELECT input,response FROM learning_history WHERE owner=? AND request=?').bind(owner, input.requestId).first<{input: string; response: string}>();
        if (!row) return null;
        if (row.input !== signature) throw new HttpError(409, 'Mã gửi lại đã dùng cho nội dung khác. Hãy tải lại buổi học.');
        return JSON.parse(row.response);
    };
    const cached = await replay();
    if (cached) return cached;
    // The ledger insert and session projection share a transaction. A compare-and-swap
    // prevents another tab's draft/answer from being overwritten by stale state.
    for (let retry = 0; retry < 4; retry++) {
        const row = await db().prepare("SELECT data FROM records WHERE owner=? AND kind='session' AND id=?").bind(owner, input.session).first<{data: string}>();
        if (!row) throw new HttpError(404, 'Không tìm thấy buổi học của bạn.');
        const s = JSON.parse(row.data);
        if (s.finished) throw new HttpError(409, 'Buổi học đã kết thúc.');
        const reading = await sessionReading(s), q = reading.questions.find(q => q.id === input.question);
        if (!q) throw new HttpError(400, 'Câu hỏi không thuộc bài đang học.');
        const version = s.contentVersion || await freezeReading(reading);
        const time = now(), hintBefore = s.hints[input.question] || 0;
        const previous = s.results[input.question];
        const firstAttemptKnown = s.historyVersion === 2;
        let response: Record<string, any>;
        let entry: Record<string, any>;
        if (input.op === 'answer') {
            if (q.type === 'mcq' && !['0','1','2','3'].includes(input.answer || '')) throw new HttpError(400, 'Vui lòng chọn một đáp án.');
            response = { answer: input.answer, correct: q.type === 'mcq' ? Number(input.answer) === q.correct_index : null,
                correctIndex: q.correct_index, modelAnswer: q.sample_answer, rubric: q.rubric,
                evidence: q.evidence_quote, paragraph: q.evidence_paragraph, skill: q.skill, submitted: time,
                attempts: (previous?.attempts || 0) + 1, adapter: q.type === 'mcq' ? 'curated-answer-key' : 'self-review',
                firstAttemptKnown, hintLevelBefore: hintBefore, answerAlreadyShown: !!previous || hintBefore >= 3 };
            entry = { answer: input.answer, correct: response.correct, skill: q.skill, ordinal: response.attempts,
                firstAttemptKnown, isFirstAttempt: firstAttemptKnown && !previous,
                hintLevelBefore: hintBefore, answerAlreadyShown: response.answerAlreadyShown };
            s.results[input.question] = response;
            s.draft[input.question] = input.answer;
            s.firstResults ||= {};
            if (!previous && firstAttemptKnown) s.firstResults[input.question] = response;
        } else {
            const level = Math.min(3, hintBefore + 1);
            response = { level, text: level === 1 ? q.hint : level === 2 ? 'Hãy đọc lại đoạn ' + q.evidence_paragraph + '.' : 'Dẫn chứng: ' + q.evidence_quote, paragraph: level > 1 ? q.evidence_paragraph : null };
            entry = { level, previousLevel: hintBefore, answerAlreadyShown: !!previous || hintBefore >= 3 };
            s.hints[input.question] = level;
        }
        s.historyRevision = (s.historyRevision || 0) + 1;
        entry = { ...entry, contentVersion: version, provenance: firstAttemptKnown ? 'versioned-session' : 'legacy-session-current-content', schema: 'learning-history-v2', at: time };
        try {
            const result = await db().batch([
                db().prepare("INSERT INTO learning_history (owner,request,session,operation,question,input,data,response,created) SELECT ?,?,?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM records WHERE owner=? AND kind='session' AND id=? AND data=?)")
                    .bind(owner, input.requestId, input.session, input.op, input.question, signature, JSON.stringify(entry), JSON.stringify(response), time, owner, input.session, row.data),
                db().prepare("UPDATE records SET data=?,updated=? WHERE owner=? AND kind='session' AND id=? AND data=?")
                    .bind(JSON.stringify(s), time, owner, input.session, row.data),
            ]);
            if (result[0].meta.changes) return response;
        } catch (error) {
            const existing = await replay();
            if (existing) return existing;
            throw error;
        }
        const existing = await replay();
        if (existing) return existing;
    }
    throw new HttpError(409, 'Buổi học đang được cập nhật ở nơi khác. Hãy thử lại.');
}
