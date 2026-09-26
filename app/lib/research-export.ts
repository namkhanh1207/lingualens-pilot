import { summarizeLearningRecord } from './research-learning-summary';
import { db, HttpError } from './server';

// Each page is read in one D1 transaction. The revision invalidates the whole
// export on a write (including consent withdrawal), rather than mixing snapshots.
export async function researchPage(url: URL) {
    const pageSize = Number(url.searchParams.get('pageSize') || 100);
    if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 200) throw new HttpError(400, 'Kích thước trang phải từ 1 đến 200.');
    let cursor: { revision: number; offset: number; size: number } | null = null;
    if (url.searchParams.has('cursor')) {
        try {
            cursor = JSON.parse(atob(url.searchParams.get('cursor')!));
            if (!cursor || !Number.isSafeInteger(cursor.revision) || cursor.revision < 0 || !Number.isSafeInteger(cursor.offset) || cursor.offset < 0 || cursor.offset > 10000000 || cursor.size !== pageSize) throw Error();
        } catch { throw new HttpError(400, 'Con trỏ xuất dữ liệu không hợp lệ.'); }
    }
    const offset = cursor?.offset || 0;
    const join = ' JOIN users u ON u.id=x.owner JOIN research_identities i ON i.owner=x.owner WHERE u.research=1';
    const sources = [
        { key: 'participants', from: 'research_identities x'+join, fields: 'i.participant,u.cefr', order: 'i.participant' },
        { key: 'events', from: 'events x'+join, fields: 'i.participant,x.id,x.session,x.type,x.data,x.created', order: 'x.rowid' },
        { key: 'responses', from: "records x"+join+" AND x.kind IN ('feedback','session','skill_path','vocab_review')", fields: 'i.participant,x.id,x.kind,x.data,x.updated', order: 'x.rowid' },
        { key: 'history', from: 'learning_history x'+join, fields: 'i.participant,x.sequence,x.session,x.operation,x.question,x.data,x.created', order: 'x.sequence' },
        { key: 'contentVersions', from: 'content_versions x', fields: 'x.id,x.data,x.created', order: 'x.rowid' },
        { key: 'experiments', from: "records x WHERE x.owner='system' AND x.kind='experiment'", fields: 'x.id,x.data', order: 'x.rowid' },
    ];
    const statements = [db().prepare('SELECT revision FROM research_revision WHERE id=1')];
    for (const s of sources) {
        statements.push(db().prepare('SELECT COUNT(*) AS total FROM '+s.from));
        statements.push(db().prepare('SELECT '+s.fields+' FROM '+s.from+' ORDER BY '+s.order+' LIMIT ? OFFSET ?').bind(pageSize, offset));
    }
    const result = await db().batch<Record<string, any>>(statements);
    const revision = Number(result[0].results[0].revision);
    if (cursor && cursor.revision !== revision) throw new HttpError(409, 'Dữ liệu hoặc lựa chọn đồng ý đã thay đổi. Hãy tải lại toàn bộ bản xuất.');
    const totals: Record<string, number> = {}, output: Record<string, any> = {};
    sources.forEach((s, n) => { totals[s.key] = Number(result[1+n*2].results[0].total); output[s.key] = result[2+n*2].results; });
    output.events = output.events.map((r: any) => ({ ...r, data: JSON.parse(r.data) }));
    output.responses = output.responses.map((r: any) => {
        const d = JSON.parse(r.data);
        if (r.kind === 'skill_path' || r.kind === 'vocab_review') return {...r,data:summarizeLearningRecord(r.kind,d)};
        const scores = (values: Record<string, any> = {}) => Object.fromEntries(Object.entries(values).map(([k,v]) => [k, { correct: v.correct, skill: v.skill, attempts: v.attempts, submitted: v.submitted, hintLevelBefore: v.hintLevelBefore, answerAlreadyShown: v.answerAlreadyShown, firstAttemptKnown: v.firstAttemptKnown }]));
        return { ...r, data: r.kind === 'session' ? { reading: d.reading, contentVersion: d.contentVersion || null, historyCoverage: d.historyVersion === 2 ? 'since-start' : 'legacy-history-incomplete', started: d.started, finished: d.finished, results: scores(d.results), firstResults: scores(d.firstResults), hints: d.hints } : { ease: d.ease, helpful: d.helpful, again: d.again, features: d.features } };
    });
    output.history = output.history.map((r: any) => {
        const d = JSON.parse(r.data);
        // Raw answers, free-text, request fingerprints and identities stay private.
        return { ...r, data: { correct: d.correct, skill: d.skill, ordinal: d.ordinal, isFirstAttempt: d.isFirstAttempt, firstAttemptKnown: d.firstAttemptKnown, hintLevelBefore: d.hintLevelBefore, answerAlreadyShown: d.answerAlreadyShown, level: d.level, previousLevel: d.previousLevel, contentVersion: d.contentVersion, provenance: d.provenance, schema: d.schema, at: d.at } };
    });
    output.contentVersions = output.contentVersions.map((r: any) => ({ ...r, data: JSON.parse(r.data) }));
    output.experiments = output.experiments.map((r: any) => ({ id: r.id, ...JSON.parse(r.data) }));
    const hasMore = Object.values(totals).some(total => offset + pageSize < total);
    return { ...output, schema: 'pilot-research-v3', pagination: { revision, pageSize, offset, totals, hasMore, complete: !hasMore && offset === 0, nextCursor: hasMore ? btoa(JSON.stringify({ revision, offset: offset + pageSize, size: pageSize })) : null }, exportedAt: new Date().toISOString() };
}
