'use client';
import { useEffect, useState } from 'react';

export default function SessionHistory({ session, legacy, revision, questions }: { session: string; legacy: boolean; revision: string; questions: {id: string; prompt: string}[] }) {
    const [items, setItems] = useState<any[]>([]), [error, setError] = useState(''), [loading, setLoading] = useState(false), [open, setOpen] = useState(false);
    useEffect(() => {
        if (!open) return;
        const controller = new AbortController();
        setItems([]); setLoading(true); setError('');
        void (async () => {
            let after = 0; const all: any[] = [];
            do {
                const response = await fetch('/api/pilot?view=history&session='+encodeURIComponent(session)+'&after='+after, { signal: controller.signal, cache: 'no-store' });
                const body: any = await response.json();
                if (!response.ok) throw Error(body.error || 'Không tải được lịch sử.');
                all.push(...body.items); after = body.next || 0;
            } while (after);
            if (!controller.signal.aborted) setItems(all);
        })().catch(e => { if (!controller.signal.aborted) setError(e.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
        return () => controller.abort();
    }, [session, revision, open]);
    return <section className="card"><h2>Lịch sử trả lời và trợ giúp</h2>
        <p className="small">{legacy ? 'Buổi cũ: chỉ có lịch sử chi tiết từ khi nâng cấp. Không thể suy lại đáp án đầu tiên hoặc các gợi ý trước đó.' : 'Mỗi lần gửi đáp án và mở gợi ý được lưu riêng. Làm lại không ghi đè lần đầu.'}</p>
        <button className="secondary" aria-expanded={open} onClick={() => setOpen(v => !v)}>{open ? 'Thu gọn lịch sử' : 'Xem lịch sử'}</button>
        {open && <>{loading && <p role="status">Đang tải lịch sử…</p>}{error && <p role="alert">{error}</p>}{!loading && !error && !items.length && <p>Chưa có lần trả lời hoặc gợi ý nào được ghi nhận.</p>}
        {items.map(item => <div className="post" key={item.sequence}><strong>{questions.find(q => q.id === item.question)?.prompt || 'Câu hỏi của buổi học'} · {item.operation === 'answer' ? 'Lần trả lời '+item.data.ordinal : 'Mở gợi ý mức '+item.data.level}</strong><p className="small">{new Date(item.created).toLocaleString('vi-VN')}</p>
            {item.operation === 'answer' && <><p>{item.data.correct === null ? 'Câu mở — tự đối chiếu' : item.data.correct ? 'Đúng' : 'Chưa đúng'} · {item.data.isFirstAttempt ? 'Lần đầu' : item.data.firstAttemptKnown ? 'Làm lại' : 'Lịch sử trước nâng cấp không đầy đủ'}</p><p className="small">Mức gợi ý trước khi gửi: {item.data.hintLevelBefore}/3 · {item.data.answerAlreadyShown ? 'Đã có phản hồi đáp án hoặc dẫn chứng trước đó' : 'Chưa có phản hồi đáp án trước đó'}</p></>}
        </div>)}</>}
    </section>;
}
