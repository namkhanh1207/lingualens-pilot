import { db, record, now, HttpError } from './server';
import { fingerprint, sessionReading, freezeReading } from './learning-history';
import { nextReview } from './learning';

export async function saveVocabulary(owner: string, b: {word:string; meaning:string; reading:string; session?:string; paragraph?:number}) {
    let context: Record<string,any> = {};
    if (b.session) {
        const s = await record(owner,'session',b.session);
        if (!s) throw new HttpError(404,'Không tìm thấy buổi học của bạn.');
        const r = await sessionReading(s), paragraph = b.paragraph ?? -1;
        const quote = r.paragraphs[paragraph];
        if (!quote || !quote.toLowerCase().includes(b.word.toLowerCase())) throw new HttpError(400,'Cụm từ phải xuất hiện trong đoạn đã chọn.');
        context = {session:b.session, reading:r.id, title:r.title, paragraph, quote, contentVersion:s.contentVersion || await freezeReading(r)};
    }
    const key = await fingerprint(JSON.stringify([b.word.toLowerCase(),b.meaning,context.contentVersion || '',context.paragraph ?? null]));
    const data = {word:b.word,meaning:b.meaning,reading:b.reading,...context,level:0,due:now(),reviews:0,schema:'context-vocab-v1'};
    await db().prepare('INSERT OR IGNORE INTO records (owner,kind,id,data,updated) VALUES (?,?,?,?,?)').bind(owner,'vocab',key,JSON.stringify(data),now()).run();
    return {ok:true,id:key};
}

export async function reviewVocabulary(owner:string,b:{id:string;rating:'again'|'good'|'easy';requestId?:string;expectedReviews?:number}) {
    const request = b.requestId || crypto.randomUUID();
    const signature = JSON.stringify([b.id,b.rating,b.expectedReviews ?? null]);
    const replay = async () => {
        const old = await record(owner,'vocab_review',request);
        if (old && old.input !== signature) throw new HttpError(409,'Mã ôn đã được dùng cho nội dung khác.');
        return old ? {ok:true} : null;
    };
    const cached = await replay(); if (cached) return cached;
    for (let retry=0;retry<4;retry++) {
        const row = await db().prepare("SELECT data FROM records WHERE owner=? AND kind='vocab' AND id=?").bind(owner,b.id).first<{data:string}>();
        if (!row) throw new HttpError(404,'Không tìm thấy từ.');
        const v = JSON.parse(row.data);
        if (b.expectedReviews !== undefined && (v.reviews || 0) !== b.expectedReviews) {
            const previous = await replay(); if (previous) return previous;
            throw new HttpError(409,'Thẻ này vừa được ôn ở nơi khác. Hãy tải lại sổ từ.');
        }
        const time = now(), next = {...v,...nextReview(v.level || 0,b.rating),reviews:(v.reviews || 0)+1};
        const entry = {input:signature,card:b.id,word:v.word,rating:b.rating,before:v.reviews || 0,due:next.due,at:time,scheduler:'pilot-interval-v1'};
        try {
            const result = await db().batch([
                db().prepare("INSERT INTO records (owner,kind,id,data,updated) SELECT ?,'vocab_review',?,?,? WHERE EXISTS (SELECT 1 FROM records WHERE owner=? AND kind='vocab' AND id=? AND data=?)").bind(owner,request,JSON.stringify(entry),time,owner,b.id,row.data),
                db().prepare("UPDATE records SET data=?,updated=? WHERE owner=? AND kind='vocab' AND id=? AND data=?").bind(JSON.stringify(next),time,owner,b.id,row.data)
            ]);
            if (result[0].meta.changes) return {ok:true};
        } catch(e) { const previous = await replay(); if (previous) return previous; throw e; }
        const previous = await replay(); if (previous) return previous;
    }
    throw new HttpError(409,'Thẻ đang được cập nhật. Hãy thử lại.');
}
