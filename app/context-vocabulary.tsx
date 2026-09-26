'use client';
import { useState, useEffect, useRef } from 'react';
import { animate, useMotionValue } from 'motion/react';
type Action = (body:Record<string,any>,message?:string)=>Promise<any>;

/* ─────────────────────────────────────────────
   ContextVocabulary — unchanged from v8
───────────────────────────────────────────── */
export function ContextVocabulary({session,reading,busy,action,selection}:{session:string;reading:{id:string;paragraphs:string[]};busy:boolean;action:Action;selection?:{word:string;paragraph:number}}) {
    const [word,setWord]=useState(selection?.word || ''),[meaning,setMeaning]=useState(''),[paragraph,setParagraph]=useState(selection?.paragraph || 0);
    const meaningInput=useRef<HTMLTextAreaElement>(null);
    useEffect(()=>{if(selection)meaningInput.current?.focus();},[selection]);
    return <form className="card" onSubmit={async e=>{e.preventDefault();if(await action({op:'vocab',word,meaning,reading:reading.id,session,paragraph},'Đã lưu cụm từ và ngữ cảnh.')){setWord('');setMeaning('');}}}>
        <h2>Lưu từ trong ngữ cảnh</h2><p className="small">Bôi đen cụm từ trong một đoạn, rồi chọn "Dùng phần đã chọn". Bạn cũng có thể nhập cụm từ bằng bàn phím.</p>
        <label className="form-label">Đoạn gốc<select value={paragraph} onChange={e=>setParagraph(Number(e.target.value))}>{reading.paragraphs.map((_,i)=><option key={i} value={i}>Đoạn {i+1}</option>)}</select></label>
        <blockquote lang="en">{reading.paragraphs[paragraph]}</blockquote>
        <label className="form-label">Từ / cụm từ trong đoạn<input required maxLength={80} value={word} onChange={e=>setWord(e.target.value)}/></label>
        <label className="form-label">Nghĩa bạn xác nhận trong ngữ cảnh này<textarea ref={meaningInput} required maxLength={500} value={meaning} onChange={e=>setMeaning(e.target.value)}/></label>
        <p className="small">Nghĩa do bạn nhập; chưa được AI hoặc từ điển kiểm chứng. Cùng một từ với nghĩa khác sẽ thành thẻ riêng.</p>
        <button className="btn" disabled={busy || !word.trim() || !meaning.trim()}>Lưu cụm từ và ngữ cảnh</button>
    </form>;
}

/* ─────────────────────────────────────────────
   Flashcard — v9: 3D flip + colour feedback
   Dùng CSS transform, Motion chỉ cho slide-out
───────────────────────────────────────────── */
const RATING_FLASH: Record<string, string> = {
    again: 'rgba(220,38,38,0.12)',
    good:  'rgba(234,179,8,0.15)',
    easy:  'rgba(34,197,94,0.15)',
};

function Flashcard({ card, busy, action, context, onDone }: {
    card: { id: string; data: Record<string, any> };
    busy: boolean;
    action: Action;
    context: React.ReactNode;
    onDone: () => void;
}) {
    const [flipped, setFlipped] = useState(false);
    const [flash, setFlash] = useState('');
    const [exiting, setExiting] = useState(false);
    const prefersReduced = useRef(
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    // 3D flip via CSS — handled by class toggle
    const cardStyle: React.CSSProperties = {
        minHeight: 260,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: flash || '#f0f4ff',
        borderRadius: 12,
        padding: 30,
        transition: prefersReduced.current
            ? 'background 0.15s'
            : 'transform 0.35s cubic-bezier(0,0,0.2,1), background 0.3s',
        transform: (!prefersReduced.current && flipped) ? 'rotateY(180deg)' : 'none',
        backfaceVisibility: 'hidden',
        position: 'relative',
    };

    async function rate(rating: string) {
        setFlash(RATING_FLASH[rating]);
        await new Promise(r => setTimeout(r, prefersReduced.current ? 0 : 280));
        setFlash('');
        if (!prefersReduced.current) {
            setExiting(true);
            await new Promise(r => setTimeout(r, 200));
        }
        if (await action({ op: 'review', id: card.id, rating, expectedReviews: card.data.reviews || 0 }, 'Đã lưu lần ôn.')) {
            onDone();
        }
        setExiting(false);
        setFlipped(false);
    }

    return (
        <div
            key={card.id}
            style={{
                opacity: exiting ? 0 : 1,
                transform: exiting ? 'translateX(40px)' : 'translateX(0)',
                transition: prefersReduced.current ? 'none' : 'opacity 0.2s, transform 0.2s',
            }}
        >
            {/* Flashcard face */}
            <div style={{ perspective: '1000px', marginBottom: 16 }}>
                <div style={cardStyle}>
                    <h2 style={{ fontFamily: 'var(--font-reading)', fontSize: 38, margin: '15px 0' }}>
                        {card.data.word}
                    </h2>

                    {!flipped ? (
                        <button
                            className="secondary"
                            onClick={() => setFlipped(true)}
                            aria-label="Lật thẻ để xem nghĩa"
                        >
                            Lật thẻ
                        </button>
                    ) : (
                        <div style={{ transform: prefersReduced.current ? 'none' : 'rotateY(180deg)' }}>
                            <p style={{ color: '#293c56', fontSize: 17, margin: '0 0 8px' }}>
                                {card.data.meaning}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Context (paragraph quote) */}
            {context}

            {/* Rating buttons */}
            <div className="row" style={{ marginTop: 16, flexWrap: 'wrap' }}>
                {([
                    ['again', 'Chưa nhớ',   '#fee2e2', '#991b1b'],
                    ['good',  'Nhớ được',    '#fef9c3', '#854d0e'],
                    ['easy',  'Rất dễ',      '#dcfce7', '#166534'],
                ] as const).map(([rating, label, bg, color]) => (
                    <button
                        key={rating}
                        disabled={busy || !flipped}
                        onClick={() => rate(rating)}
                        style={{
                            background: bg,
                            color,
                            border: `1px solid ${color}33`,
                            borderRadius: 8,
                            padding: '8px 14px',
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: busy || !flipped ? 'not-allowed' : 'pointer',
                            opacity: !flipped ? 0.45 : 1,
                            transition: 'opacity 0.15s, transform 0.1s',
                        }}
                        onMouseDown={e => { if (!busy && flipped) (e.currentTarget.style.transform = 'scale(0.96)'); }}
                        onMouseUp={e => { (e.currentTarget.style.transform = ''); }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <p className="small" style={{ marginTop: 12 }}>
                Lịch ôn: 1/3/7/14/30/60 ngày · "Chưa nhớ" hẹn lại sau 10 phút.
            </p>
        </div>
    );
}

/* ─────────────────────────────────────────────
   VocabularyWorkspace — main export
───────────────────────────────────────────── */
export default function VocabularyWorkspace({records,busy,action,openSource}:{records:{id:string;kind:string;data:Record<string,any>}[];busy:boolean;action:Action;openSource:(id:string,paragraph:number)=>void}) {
    const [done,setDone]=useState<string[]>([]),[extra,setExtra]=useState(false),[search,setSearch]=useState('');
    const cards=records.filter(r=>r.kind==='vocab'), due=cards.filter(r=>new Date(r.data.due).getTime()<=Date.now());
    const card=(extra?cards:due).filter(r=>!done.includes(r.id)).sort((a,b)=>a.data.due.localeCompare(b.data.due))[0];

    const context=(v:Record<string,any>)=><>{v.quote ? <><blockquote lang="en">{v.quote}</blockquote><p className="small">{v.title} · Đoạn {v.paragraph+1}</p><button className="secondary" onClick={()=>openSource(v.session,v.paragraph)}>Mở ngữ cảnh gốc</button></> : <p className="small">Thẻ nhập tay hoặc thẻ cũ chưa lưu đoạn gốc.</p>}</>;

    return <><div className="page-heading"><div><p className="eyebrow">TỪ MỚI THÀNH VỐN TỪ</p><h1>Nhớ từ cùng ngữ cảnh.</h1><p>{cards.length} thẻ · {due.length} thẻ đến lịch</p></div></div><div className="grid-2"><div className="card" data-guide="vocabulary"><h2>Ôn tập</h2><p className="small">Lịch pilot theo khoảng cách cố định; "Chưa nhớ" hẹn lại sau 10 phút.</p>
    {card ? (
        <Flashcard
            key={card.id}
            card={card}
            busy={busy}
            action={action}
            context={context(card.data)}
            onDone={() => { setDone(d=>[...d, card.id]); }}
        />
    ) : (
        <>
            <div className="empty-state">
                <div className="empty-state-icon">📖</div>
                <h3>Đã hết thẻ trong lượt ôn này.</h3>
                <p>Tuyệt vời! Bạn đã ôn tất cả thẻ đến hạn.</p>
            </div>
            <button className="secondary" disabled={!cards.length} onClick={()=>{setExtra(true);setDone([]);}}>Ôn thêm tất cả thẻ</button>
        </>
    )}
    </div>
    <form className="card" onSubmit={async e=>{e.preventDefault();const f=e.currentTarget,d=new FormData(f);if(await action({op:'vocab',word:d.get('word'),meaning:d.get('meaning'),reading:''},'Đã thêm thẻ.'))f.reset();}}><h2>Thêm thẻ nhập tay</h2><label className="form-label">Từ / cụm từ<input name="word" required maxLength={80}/></label><label className="form-label">Nghĩa hoặc ví dụ<textarea name="meaning" required maxLength={500}/></label><button className="btn" disabled={busy}>Thêm từ</button></form></div>
    <div className="card"><h2>Sổ từ của bạn</h2><label className="form-label">Tìm từ hoặc nghĩa<input value={search} onChange={e=>setSearch(e.target.value)}/></label>{cards.filter(v=>(v.data.word+' '+v.data.meaning).toLowerCase().includes(search.toLowerCase())).map(v=><details className="post" key={v.id}><summary><b>{v.data.word}</b> — {v.data.meaning}</summary>{context(v.data)}<p className="small">Đã ôn {v.data.reviews || 0} lần · Lần tới: {new Date(v.data.due).toLocaleString('vi-VN')}</p><button className="secondary" disabled={busy} onClick={()=>action({op:'remove_vocab',id:v.id},'Đã xóa thẻ.')}>Xóa thẻ</button></details>)}
    {!cards.filter(v=>(v.data.word+' '+v.data.meaning).toLowerCase().includes(search.toLowerCase())).length && (
        <div className="empty-state" style={{ padding: '24px 0' }}>
            <div className="empty-state-icon">🔖</div>
            <h3>Không tìm thấy từ nào.</h3>
            <p>Thử từ khóa khác hoặc{' '}
                <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setSearch('')}>xóa bộ lọc</span>.
            </p>
        </div>
    )}
    </div>
    <div className="card"><h2>Lịch sử ôn của bạn</h2>{records.filter(r=>r.kind==='vocab_review').slice(0,50).map(r=><p key={r.id}><b>{r.data.word}</b> · {({again:'Chưa nhớ',good:'Nhớ được',easy:'Rất dễ'} as Record<string,string>)[r.data.rating]} · {new Date(r.data.at).toLocaleString('vi-VN')}</p>)}<p className="small">Hiển thị tối đa 50 lần gần nhất; xuất dữ liệu cá nhân để lấy đầy đủ.</p></div></>;
}
