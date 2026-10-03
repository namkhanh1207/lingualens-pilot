'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, Compass, Layers, Library, MessageCircle, Headphones, AudioLines, ScanEye, Users, LifeBuoy, ShieldCheck, FlaskConical, Settings, LayoutDashboard, ArrowUpRight, ArrowLeft, Bookmark, Highlighter, Search, Sparkles, Menu, LogOut, Download, Check, Send, Plus, Volume2 } from 'lucide-react';
import LibrarySearch from './library-search';
import SkillPath from './skill-path';
import Companion from './companion';
import MediaLab from './media-lab';
import PilotGuide from './pilot-guide';
import ResearchSummary from './research-summary';
import VocabularyWorkspace, { ContextVocabulary } from './context-vocabulary';
import SessionHistory from './session-history';
import QuestionPanel from './question-panel';
type Any = Record<string, any>;
type Reading = {
    id: string;
    title: string;
    cefr_estimate: string;
    topic: string;
    paragraphs: string[];
    vocabulary: {
        word: string;
        definition: string;
    }[];
    questions: Any[];
};
type Item = {
    id: string;
    kind: string;
    data: Any;
    updated: string;
};
const nav = [['dashboard', 'Tổng quan', LayoutDashboard], ['discover', 'Khám phá bài đọc', Compass], ['skill-path', 'Hành trình kỹ năng', BookOpen], ['vocabulary', 'Từ vựng', Layers], ['library', 'Thư viện của tôi', Library], ['tutor', 'Trợ lý đọc hiểu', Sparkles], ['voice', 'Luyện hội thoại', Headphones], ['pronunciation', 'Luyện phát âm', AudioLines], ['eye', 'Phòng gaze', ScanEye], ['forum', 'Cộng đồng', Users], ['support', 'Hỗ trợ & góp ý', LifeBuoy], ['privacy', 'Hồ sơ & riêng tư', ShieldCheck]] as const;
const skillNames: Record<string, string> = { detail: 'Chi tiết', inference: 'Suy luận', vocabulary_in_context: 'Từ trong ngữ cảnh', main_idea: 'Ý chính', reference: 'Từ tham chiếu', author_purpose: 'Mục đích tác giả', critical_reading: 'Đọc phản biện', evidence_based_explanation: 'Giải thích bằng dẫn chứng' };
const date = (x: string) => new Date(x).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
function download(name: string, data: unknown) { const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
async function request(view = 'bootstrap') {
    async function page(cursor?: string) {
        const r = await fetch('/api/pilot?view=' + encodeURIComponent(view) + (cursor ? '&cursor=' + encodeURIComponent(cursor) : ''), { cache: 'no-store' });
        const j: any = await r.json();
        if (!r.ok) throw Error(j.error || 'Không thể tải dữ liệu.');
        return j;
    }
    const first = await page();
    if (view !== 'research') return first;
    const keys = ['participants','events','responses','history','experiments','contentVersions'];
    let cursor = first.pagination.nextCursor, pages = 1;
    while (cursor) {
        if (pages > 10000) throw Error('Bản xuất quá lớn để tải trong trình duyệt. Không tải xuống dữ liệu chưa đầy đủ.');
        const next = await page(cursor);
        for (const key of keys) first[key].push(...next[key]);
        cursor = next.pagination.nextCursor; pages++;
    }
    const check = await page();
    if (check.pagination.revision !== first.pagination.revision) throw Error('Dữ liệu hoặc đồng ý nghiên cứu vừa thay đổi. Hãy tải lại.');
    for (const key of keys) if (first[key].length !== first.pagination.totals[key]) throw Error('Bản xuất chưa đủ dữ liệu. Hãy tải lại.');
    first.pagination = { ...first.pagination, complete: true, hasMore: false, nextCursor: null, pages };
    return first;
}
export default function Workspace({ signedIn, signInPath, signOutPath, authLabel }: {
    signedIn: boolean;
    signInPath: string;
    signOutPath: string;
    authLabel: string;
}) {
    // Match the server on the first client render; the mount effect restores the URL hash.
    const [page, setPage] = useState(signedIn ? 'dashboard' : 'discover'), [mobile, setMobile] = useState(false), [data, setData] = useState<Any | null>(null), [readings, setReadings] = useState<Reading[]>([]), [error, setError] = useState(''), [toast, setToast] = useState(''), [busy, setBusy] = useState(false), [loading, setLoading] = useState(true), [search, setSearch] = useState(''), [level, setLevel] = useState('all');
    const [active, setActive] = useState<{
        id: string;
        data: Any;
    } | null>(null), [answers, setAnswers] = useState<Record<string, string>>({}), [note, setNote] = useState(''), [highlights, setHighlights] = useState<number[]>([]), [results, setResults] = useState<Any>({}), [hints, setHints] = useState<Any>({}), [focus, setFocus] = useState<number | null>(null), [saveStatus, setSaveStatus] = useState(''), [lookup, setLookup] = useState('');
    const pathDirty=useRef(false);
    const setPathDirty=useCallback((value:boolean)=>{pathDirty.current=value;},[]);
    const [companionOpen,setCompanionOpen] = useState(0);
    const [selection,setSelection] = useState<{word:string;paragraph:number;nonce:number}>();
    const pendingRequests = useRef(new Map<string, string>()), inFlight = useRef(new Map<string, Promise<any>>());
    const queue = useRef<Promise<any>>(Promise.resolve()), activeRef = useRef(active), draftRef = useRef({ answers, note, highlights }), dirty = useRef(false), [draftVersion, setDraftVersion] = useState(0);
    activeRef.current = active;
    draftRef.current = { answers, note, highlights };
    const [admin, setAdmin] = useState<Any | null>(null), [research, setResearch] = useState<Any | null>(null), [flash, setFlash] = useState(0), [revealed, setRevealed] = useState(false), [editPost, setEditPost] = useState<Any | null>(null);
    const [chatId, setChatId] = useState(''), [turns, setTurns] = useState<Any[]>([]), [chatText, setChatText] = useState(''), [persona, setPersona] = useState('Study buddy'), [chatReading, setChatReading] = useState('campus-cups'), [chatMode, setChatMode] = useState(''), [chatStatus, setChatStatus] = useState(''), [audio, setAudio] = useState(false);
    const [profileDraft, setProfileDraft] = useState<Any | null>(null), [feedback, setFeedback] = useState(false), [confirmDelete, setConfirmDelete] = useState('');
    const records: Item[] = data?.records || [], sessions = records.filter(r => r.kind === 'session'), vocab = records.filter(r => r.kind === 'vocab'), bookmarks = new Set(records.filter(r => r.kind === 'bookmark').map(r => r.id));
    const reading: Reading | undefined = active?.data.readingContent || readings.find(r => r.id === active?.data.reading), allResults = sessions.flatMap(s => Object.values(s.data.results || {})) as Any[], graded = allResults.filter(r => r.correct !== null), correct = graded.filter(r => r.correct).length;
    const firstUnaided = sessions.flatMap(s => Object.values(s.data.firstResults || {})).filter((r: any) => r.correct !== null && r.firstAttemptKnown && r.hintLevelBefore === 0 && !r.answerAlreadyShown) as Any[];
    const notify = (msg: string) => setToast(msg);
    const refresh = useCallback(async () => { try {
        const d = await request(signedIn ? 'bootstrap' : 'readings');
        setReadings(d.readings);
        if (signedIn) {
            setData(d);
            setProfileDraft(old => old || { name: d.profile.name, cefr: d.profile.cefr, goal: d.profile.goal, research: !!d.profile.research, aiConsent: !!d.profile.ai_consent });
        }
        setLoading(false);
        return d;
    }
    catch (e) {
        setError((e as Error).message);
        setLoading(false);
    } }, [signedIn]);
    useEffect(() => {
        let cancelled = false;
        const initialHash = location.hash.slice(1);
        void refresh().then(d => {
            if (cancelled || !d || location.hash.slice(1) !== initialHash) return;
            if (initialHash === 'reading' || initialHash.startsWith('reading/')) {
                if (!signedIn) return;
                const ownedSessions: Item[] = (d.records || []).filter((r: Item) => r.kind === 'session');
                const id = initialHash.slice('reading/'.length);
                const session = initialHash === 'reading'
                    ? ownedSessions.find(s => !s.data.finished) || ownedSessions[0]
                    : ownedSessions.find(s => s.id === id);
                if (session && d.readings.some((r: Reading) => r.id === session.data.reading)) openSession(session);
                else { setPage('library'); setError('Buổi học không tồn tại trong tài khoản này. Hãy chọn một buổi trong thư viện.'); }
            } else if (signedIn && ['admin','research'].includes(initialHash)) {
                void go(initialHash);
            } else if (nav.some(n => n[0] === initialHash)) {
                setPage(initialHash);
                if (initialHash === 'voice' || initialHash === 'tutor') {
                    setChatId(crypto.randomUUID()); setChatMode(initialHash);
                }
            }
        });
        return () => { cancelled = true; };
    }, [refresh, signedIn]);
    useEffect(() => { if (!toast)
        return; const t = setTimeout(() => setToast(''), 4000); return () => clearTimeout(t); }, [toast]);
    function post(body: Any) {
        const durable = ['answer','hint','event','review','path_update'].includes(body.op);
        const signature = JSON.stringify(body);
        if (durable && inFlight.current.has(signature)) return inFlight.current.get(signature)!;
        if (durable) {
            const requestId = pendingRequests.current.get(signature) || crypto.randomUUID();
            pendingRequests.current.set(signature, requestId); body = { ...body, requestId };
        }
        const run = queue.current.catch(() => {}).then(async () => {
            for (let attempt = 0; attempt < 2; attempt++) {
                try {
                    const r = await fetch('/api/pilot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
                    const j: any = await r.json();
                    if (!r.ok) {
                        if (durable && r.status >= 500 && attempt === 0) continue;
                        throw Error(j.error || 'Không thể lưu.');
                    }
                    if (durable) pendingRequests.current.delete(signature);
                    return j;
                } catch (e) {
                    if (durable && e instanceof TypeError && attempt === 0) continue;
                    throw e;
                }
            }
        });
        queue.current = run;
        if (durable) {
            inFlight.current.set(signature, run);
            void run.finally(() => inFlight.current.delete(signature)).catch(() => {});
        }
        return run;
    }
    async function action(body: Any, success = 'Đã lưu.', reload = true) { if (!signedIn) {
        setError('Hãy đăng nhập để lưu và tiếp tục.');
        return null;
    } setError(''); setBusy(true); try {
        const j = await post(body);
        if (success)
            notify(success);
        if (reload)
            await refresh();
        return j;
    }
    catch (e) {
        setError((e as Error).message);
        return null;
    }
    finally {
        setBusy(false);
    } }
    async function flushDraft() { if (!dirty.current || !activeRef.current || activeRef.current.data.finished)
        return; dirty.current = false; const sid = activeRef.current.id; const draft = { ...draftRef.current }; setSaveStatus('Đang lưu…'); try {
        await post({ op: 'draft', session: sid, ...draft });
        setSaveStatus('Đã lưu trên máy chủ');
    }
    catch (e) {
        dirty.current = true;
        setSaveStatus('Chưa lưu — hãy thử lại');
        throw e;
    } }
    useEffect(() => { if (!dirty.current)
        return; const t = setTimeout(() => { void flushDraft().catch(e => setError(e.message)); }, 800); return () => clearTimeout(t); }, [draftVersion]);
    useEffect(() => { const handler = (e: BeforeUnloadEvent) => { if (dirty.current || pathDirty.current) {
        e.preventDefault();
        e.returnValue = '';
    } }; window.addEventListener('beforeunload', handler); return () => window.removeEventListener('beforeunload', handler); }, []);
    async function go(p: string) { try {
        if(p !== page && pathDirty.current && !window.confirm('Bạn có thay đổi chưa lưu trong hành trình. Rời trang và bỏ thay đổi?')) return;
        await flushDraft();
        setPage(p);
        location.hash = p;
        setMobile(false);
        setError('');
        setFocus(null);
        if ('speechSynthesis' in window)
            speechSynthesis.cancel();
        if (p === 'admin')
            setAdmin(await request('admin'));
        if (p === 'research') { setResearch(null); setResearch(await request('research')); }
        if (p === 'voice' || p === 'tutor') {
            if (chatMode !== p) {
                setChatId(crypto.randomUUID());
                setTurns([]);
                setChatMode(p);
                setChatStatus('');
            }
        }
        void refresh();
    }
    catch (e) {
        setError((e as Error).message);
    } }
    function openSession(s: { id: string; data: Any }) {
        setSelection(undefined);
        setActive(s);
        setAnswers(s.data.draft || {});
        setNote(s.data.note || '');
        setHighlights(s.data.highlights || []);
        setResults(s.data.results || {});
        setHints({});
        setFocus(null);
        setSaveStatus('Đã tải buổi học');
        dirty.current = false;
        setPage('reading');
        location.hash = 'reading/' + s.id;
        setChatReading(s.data.reading);
    }
    async function start(r: Reading) { if (!signedIn) {
        setError('Đăng nhập để bắt đầu bài đọc và lưu tiến độ.');
        return;
    } const s = await action({ op: 'start', reading: r.id }, '', false); if (s) {
        openSession(s);
    } }
    function draft(update: Partial<{
        answers: Record<string, string>;
        note: string;
        highlights: number[];
    }>) { if (update.answers)
        setAnswers(update.answers); if (update.note !== undefined)
        setNote(update.note); if (update.highlights)
        setHighlights(update.highlights); draftRef.current = { ...draftRef.current, ...update }; dirty.current = true; setSaveStatus('Chưa lưu…'); setDraftVersion(v => v + 1); }
    async function event(type: string, value: number) { if (!data?.profile.research || !activeRef.current)
        return; try {
        await post({ op: 'event', session: activeRef.current.id, type, value });
    }
    catch { /* Learning remains available; surface instrumentation issue. */
        setSaveStatus('Ghi nhận hành vi bị gián đoạn. Đáp án vẫn có thể lưu.');
    } }
    useEffect(() => { if (page !== 'reading' || !active || active.data.finished)
        return; let started = Date.now(), lastScroll = 0; const timer = setInterval(() => { if (document.visibilityState === 'visible') {
        void event('dwell', Date.now() - started);
    } started = Date.now(); }, 15000); const scroll = () => { if (Date.now() - lastScroll > 5000) {
        lastScroll = Date.now();
        void event('scroll', Math.round(window.scrollY));
    } }; window.addEventListener('scroll', scroll); return () => { clearInterval(timer); window.removeEventListener('scroll', scroll); }; }, [page, active?.id, data?.profile.research]);
    async function submit(q: Any) { try {
        await flushDraft();
        const result = await action({ op: 'answer', session: active?.id, question: q.id, answer: answers[q.id] || '' }, '', false);
        if (result)
            setResults(old => ({ ...old, [q.id]: result }));
    }
    catch (e) {
        setError((e as Error).message);
    } }
    async function hint(q: Any) { try {
        await flushDraft();
        const h = await action({ op: 'hint', session: active?.id, question: q.id }, '', false);
        if (h) {
            setHints(old => ({ ...old, [q.id]: h }));
            setFocus(h.paragraph ? Number(h.paragraph) - 1 : null);
        }
    }
    catch (e) {
        setError((e as Error).message);
    } }
    async function sendChat() { if (!chatText.trim())
        return; const msg = chatText; const result = await action({ op: 'chat', id: chatId || crypto.randomUUID(), mode: page === 'tutor' ? 'tutor' : 'voice', reading: chatReading, persona, message: msg }, '', false); if (result) {
        setTurns(t => [...t, { role: 'user', text: msg }, { role: 'assistant', text: result.text, adapter: result.adapter }]);
        setChatText('');
        setChatStatus(result.reason);
        if (audio && 'speechSynthesis' in window) {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(result.text);
            utterance.lang = 'en-US';
            speechSynthesis.speak(utterance);
        }
    } }
    const title = page === 'reading' ? reading?.title : page === 'admin' ? 'Quản trị pilot' : page === 'research' ? 'Không gian nghiên cứu' : nav.find(n => n[0] === page)?.[1];
    const isManager = ['admin', 'moderator'].includes(data?.role), isResearch = ['admin', 'researcher'].includes(data?.role);
    const signCard = <div className="card signin-card"><span className="badge">TÀI KHOẢN CÁ NHÂN</span><h2 style={{ marginTop: 16 }}>Tiếp tục với {authLabel}</h2><p>Mỗi người học có đáp án, từ vựng và lịch sử riêng. Camera và micro luôn là tùy chọn.</p><a className="btn" style={{ marginTop: 16 }} href={signInPath} target="_top">Đăng nhập bằng {authLabel} <ArrowUpRight size={17}/></a></div>;
    return <div className="shell"><aside className={'sidebar ' + (mobile ? 'open' : '')}><div className="brand"><span className="brand-symbol"><BookOpen size={24}/></span><b>LinguaLens<span>ENGLISH LEARNING LAB</span></b></div>{nav.map(([key, label, Icon], i) => <div key={key}>{[0, 5, 9].includes(i) && <div className="nav-label">{i === 0 ? 'KHÔNG GIAN HỌC' : i === 5 ? 'LUYỆN TẬP & KHÁM PHÁ' : 'KẾT NỐI & CÁ NHÂN'}</div>}<button className={'nav-item ' + (page === key || (page === 'reading' && key === 'discover') ? 'active' : '')} onClick={() => go(key)}><Icon size={18}/>{label}</button></div>)}{isResearch && <button className={'nav-item ' + (page === 'research' ? 'active' : '')} onClick={() => go('research')}><FlaskConical size={18}/>Nghiên cứu</button>}{isManager && <button className={'nav-item ' + (page === 'admin' ? 'active' : '')} onClick={() => go('admin')}><Settings size={18}/>Quản trị</button>}<div className="sidebar-foot">PILOT 01<span>Góp ý của bạn giúp sản phẩm tốt hơn.</span></div></aside><main className="main"><header className="topbar"><div className="row"><button className="secondary mobile-menu" aria-label="Mở hoặc đóng menu" onClick={() => setMobile(!mobile)}><Menu size={18}/></button><span>Không gian học / <b>{page === 'reading' ? 'Bài đọc' : title}</b></span></div><div className="row">{signedIn && <button id="companion-help" className="secondary" onClick={()=>setCompanionOpen(n=>n+1)}>Người đồng hành</button>}<span className="badge">Bản dùng thử</span>{signedIn ? <a href={signOutPath} target="_top" className="secondary" aria-label="Đăng xuất"><LogOut size={16}/></a> : <a className="btn" href={signInPath} target="_top">Đăng nhập</a>}</div></header><div className="workspace">{error && <div className="error" role="alert">{error} <button className="secondary" onClick={() => { setError(''); void refresh(); }}>Thử tải lại</button></div>}{loading ? <div className="card" role="status">Đang tải không gian học…</div> : <>
 {page === 'dashboard' && <>
  <div className="page-heading">
    <div>
      <p className="eyebrow">TỔNG QUAN TIẾN ĐỘ</p>
      <h1>Chào {data?.profile?.name || 'bạn'}.</h1>
      <p>Theo dõi quá trình rèn luyện, nhịp độ học tập và mục tiêu tiếp theo.</p>
    </div>
    <span className="heading-icon"><LayoutDashboard size={36}/></span>
  </div>
  {signedIn && <PilotGuide records={records} go={go}/>}
  {signedIn ? (
    <>
      <div className="grid-3">
        <div className="card">
          <div className="metric">{sessions.filter(s => s.data.finished).length}</div>
          <div className="metric-label">Buổi đọc đã hoàn thành</div>
        </div>
        <div className="card">
          <div className="metric">{vocab.length}</div>
          <div className="metric-label">Từ trong sổ tay</div>
        </div>
        <div className="card">
          <div className="metric">{firstUnaided.length ? Math.round(firstUnaided.filter(r => r.correct).length / firstUnaided.length * 100) + '%' : '—'}</div>
          <div className="metric-label">Đúng lần đầu, chưa dùng trợ giúp (buổi mới)</div>
        </div>
      </div>
      <div className="grid-2">
        <div className="card">
          <h2>Kết quả luyện tập gần nhất</h2>
          <p className="small">Bao gồm lần làm lại sau khi xem gợi ý/đáp án; không phải điểm năng lực độc lập.</p>
          {graded.length ? Object.entries(skillNames).filter(([k]) => graded.some(r => r.skill === k)).map(([k, v]) => {
            const g = graded.filter(r => r.skill === k);
            return <div key={k} style={{ marginTop: 15 }}>
              <div className="row between">
                <span>{v}</span>
                <span className="small">{g.filter(r => r.correct).length}/{g.length}</span>
              </div>
              <div className="progress-bar">
                <span style={{ width: g.filter(r => r.correct).length / g.length * 100 + '%' }}/>
              </div>
            </div>;
          }) : <p>Hoàn thành câu hỏi để xem dữ liệu của bạn. Đây chưa phải đánh giá CEFR.</p>}
        </div>
        <div className="card">
          <h2>Gợi ý cho buổi học tiếp theo</h2>
          <p>{graded.some(r => !r.correct) ? 'Bạn có câu trắc nghiệm chưa đúng. Hãy đọc lại dẫn chứng và thử bài cùng kỹ năng trước khi tăng độ khó.' : 'Bắt đầu với một bài B1, sau đó chọn bài khó hơn nếu thấy phù hợp.'}</p>
          <div className="row" style={{ marginTop: 16 }}>
            <button className="btn" onClick={() => go('discover')}>
              Khám phá bài đọc <ArrowUpRight size={17}/>
            </button>
            {sessions.some(s => !s.data.finished) && (
              <button className="secondary" onClick={() => {
                const ongoing = sessions.find(s => !s.data.finished);
                if (ongoing) openSession(ongoing);
              }}>
                Tiếp tục bài đang đọc
              </button>
            )}
          </div>
          <p className="small" style={{ marginTop: 14 }}>Đề xuất theo quy tắc đơn giản từ kết quả bài làm; bạn luôn có thể chọn khác.</p>
        </div>
      </div>
      {sessions.some(s => !s.data.finished) && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="row between">
            <h2>Bài đọc đang dở</h2>
            <button className="secondary" onClick={() => go('library')}>Xem tất cả</button>
          </div>
          {sessions.filter(s => !s.data.finished).slice(0, 2).map(s => {
            const r = readings.find(reading => reading.id === s.data.reading);
            if (!r) return null;
            return (
              <div className="post row between" key={s.id} style={{ alignItems: 'center', marginTop: 12 }}>
                <div>
                  <span className="badge">{r.cefr_estimate}</span>
                  <h3 style={{ marginTop: 6 }}>{r.title}</h3>
                  <p className="small">Bắt đầu: {date(s.data.started)} · {Object.keys(s.data.results || {}).length}/{r.questions.length} câu đã làm</p>
                </div>
                <button className="btn" onClick={() => openSession(s)}>Tiếp tục <ArrowUpRight size={16}/></button>
              </div>
            );
          })}
        </div>
      )}
    </>
  ) : (
    signCard
  )}
</>}

{page === 'discover' && <>
  <div className="page-heading">
    <div>
      <p className="eyebrow">MỖI BÀI ĐỌC, MỘT GÓC NHÌN MỚI</p>
      <h1>Học từ điều bạn tò mò.</h1>
      <p>Đọc, đặt câu hỏi và biến từ mới thành vốn từ của bạn.</p>
    </div>
    <span className="heading-icon"><Compass size={36}/></span>
  </div>
  <div className="notice">
    <Sparkles size={20}/>
    <div>
      <strong>Một buổi học, theo nhịp của bạn.</strong>
      <p>{readings.length} bài đọc · {readings.reduce((n, r) => n + r.questions.length, 0)} câu hỏi · Gợi ý có dẫn chứng. Không cần bật camera hay micro.</p>
    </div>
  </div>
  <div className="section-head">
    <h2>Chọn bài đọc</h2>
    <span>Trình độ A2–B2 ước lượng</span>
  </div>
  <div className="row" style={{ marginBottom: 20 }}>
    <label style={{ flex: 1 }}>
      <span className="sr-only">Tìm bài đọc</span>
      <input placeholder="Tìm theo tên hoặc chủ đề…" value={search} onChange={e => setSearch(e.target.value)}/>
    </label>
    <label>
      <span className="sr-only">Trình độ</span>
      <select value={level} onChange={e => setLevel(e.target.value)}>
        <option value="all">Mọi trình độ</option>
        {['A2', 'B1', 'B1+', 'B2'].map(x => <option key={x}>{x}</option>)}
      </select>
    </label>
  </div>
  <div className="reading-grid">
    {readings.filter(r => (level === 'all' || r.cefr_estimate === level) && (r.title + ' ' + r.topic).toLowerCase().includes(search.toLowerCase())).map(r => (
      <button key={r.id} className="reading-card" disabled={busy} onClick={() => start(r)}>
        <div className={'cover cover-' + (readings.indexOf(r) % 3)}>
          <span>0{readings.indexOf(r) + 1}</span>
          <BookOpen size={46}/>
          <small>{r.topic}</small>
        </div>
        <div className="reading-card-body">
          <span className="badge">{r.cefr_estimate}</span>
          <h3>{r.title}</h3>
          <p>{r.paragraphs.join(' ').split(/\s+/).length} từ · {r.questions.length} câu hỏi · 8–12 phút</p>
          <span className="text-link">{sessions.some(s => s.data.reading === r.id && !s.data.finished) ? 'Tiếp tục đọc' : 'Bắt đầu đọc'} <ArrowUpRight size={17}/></span>
        </div>
      </button>
    ))}
  </div>
  {!readings.some(r => (level === 'all' || r.cefr_estimate === level) && (r.title + ' ' + r.topic).toLowerCase().includes(search.toLowerCase())) && (
    <div className="empty">Chưa có bài phù hợp. Thử từ khóa hoặc trình độ khác.</div>
  )}
  <p className="small">Bài đọc hư cấu tự biên soạn với AI cho pilot. Mức độ khó chưa được chuẩn hóa.</p>
  {!signedIn && signCard}
</>}
 {!signedIn && !['discover', 'dashboard'].includes(page) ? signCard : <>
 {page === 'reading' && reading && active && <><div className="row between" style={{ marginBottom: 20 }}><button className="secondary" onClick={() => go('discover')}><ArrowLeft size={16}/>Danh sách bài</button><span className="save-status" role="status">{saveStatus}</span></div><div className="reading-layout"><div><div className="card"><div className="row between"><span className="badge">{reading.cefr_estimate} · {reading.topic}</span><button className="secondary" disabled={busy} onClick={() => action({ op: 'bookmark', reading: reading.id }, bookmarks.has(reading.id) ? 'Đã bỏ lưu.' : 'Đã lưu bài.')}><Bookmark size={16} fill={bookmarks.has(reading.id) ? 'currentColor' : 'none'}/>{bookmarks.has(reading.id) ? 'Đã lưu' : 'Lưu bài'}</button></div><h1 style={{ fontSize: 32, marginTop: 22 }}>{reading.title}</h1><p className="small" style={{ marginTop: 10 }}>Nội dung gốc cho pilot · Bối cảnh hư cấu · Chọn đoạn để đánh dấu</p><button className="secondary" onMouseDown={e=>e.preventDefault()} onClick={()=>{const selected=window.getSelection();const word=selected?.toString().trim() || '';const node=selected?.anchorNode?.parentElement?.closest('[data-reading-paragraph]');const end=selected?.focusNode?.parentElement?.closest('[data-reading-paragraph]');if(!node || node!==end || !word || word.length>80){notify('Hãy chọn tối đa 80 ký tự trong cùng một đoạn.');return;}setSelection({word,paragraph:Number(node.getAttribute('data-reading-paragraph')),nonce:Date.now()});document.getElementById('context-vocabulary')?.scrollIntoView({block:'center'});}}>Dùng phần đã chọn</button><div className="article" data-guide="passage" lang="en">{reading.paragraphs.map((p, i) => <p key={i} className={(focus === i ? 'focused ' : '') + (highlights.includes(i) ? 'highlighted' : '')}><span className="paragraph-number">PARAGRAPH {i + 1} <button className="secondary" style={{ padding: '2px 7px', float: 'right' }} aria-label={'Đánh dấu đoạn ' + (i + 1)} disabled={!!active.data.finished} onClick={() => { draft({ highlights: highlights.includes(i) ? highlights.filter(x => x !== i) : [...highlights, i] }); void event('highlight', i + 1); }}><Highlighter size={13}/></button></span><span data-reading-paragraph={i}>{p}</span></p>)}</div><div id="context-vocabulary"><ContextVocabulary key={active.id+String(selection?.nonce || 0)} session={active.id} reading={reading} busy={busy} action={action} selection={selection}/></div><div className="divider"/><label className="form-label" htmlFor="note">Ghi chú của bạn</label><textarea id="note" value={note} maxLength={4000} disabled={!!active.data.finished} onChange={e => draft({ note: e.target.value })} placeholder="Điều bạn muốn nhớ từ bài đọc…"/><button className="secondary" style={{ marginTop: 10 }} onClick={() => flushDraft().then(() => notify('Đã lưu ghi chú.')).catch(e => setError(e.message))}>Lưu ngay</button></div><div className="card"><h2><Search size={18} style={{ display: 'inline', marginRight: 8 }}/>Từ vựng trong bài</h2><label className="form-label" htmlFor="lookup">Tìm trong từ điển của bài</label><input id="lookup" value={lookup} onChange={e => setLookup(e.target.value)} onBlur={() => { if (lookup)
                void event('lookup', 1); }} placeholder="Nhập từ cần tìm…"/>{reading.vocabulary.filter(v => v.word.toLowerCase().includes(lookup.toLowerCase())).map(v => <div className="post" key={v.word}><div className="row between"><b>{v.word}</b><button className="secondary" onClick={() => { if ('speechSynthesis' in window) {
                const x = new SpeechSynthesisUtterance(v.word);
                x.lang = 'en-US';
                speechSynthesis.speak(x);
            }
            else
                notify('Trình duyệt chưa hỗ trợ đọc mẫu.'); }}><Volume2 size={16}/>Nghe</button></div><p>{v.definition}</p><button className="secondary" disabled={busy} onClick={() => action({ op: 'vocab', word: v.word, meaning: v.definition, reading: reading.id, session: active.id, paragraph: reading.paragraphs.findIndex(p => p.toLowerCase().includes(v.word.toLowerCase())) }, 'Đã thêm vào sổ từ.')}><Plus size={15}/>Lưu từ</button></div>)}{!reading.vocabulary.some(v => v.word.toLowerCase().includes(lookup.toLowerCase())) && <p>Chưa có từ này trong từ điển nhỏ của bài. Bạn có thể thêm nghĩa riêng tại trang Từ vựng.</p>}</div></div><QuestionPanel
                    questions={reading.questions}
                    answers={answers}
                    results={results}
                    hints={hints}
                    busy={busy}
                    finished={!!active.data.finished}
                    totalQuestions={reading.questions.length}
                    onDraft={draft}
                    onSubmit={submit}
                    onHint={hint}
                    onSetFocus={setFocus}
                    onEvent={event}
                    onFinish={async () => {
                        try {
                            await flushDraft();
                            if (await action({ op: 'finish', session: active.id }, 'Đã hoàn thành buổi đọc.')) {
                                setActive({ ...active, data: { ...active.data, finished: new Date().toISOString() } });
                            }
                        } catch (e) {
                            setError((e as Error).message);
                        }
                    }}
                /></div></>}
 {page === 'reading' && active && <SessionHistory questions={(reading?.questions || []).map(q => ({ id: String(q.id), prompt: String(q.prompt) }))} session={active.id} legacy={active.data.historyVersion !== 2} revision={JSON.stringify([results,hints])}/>}
 {page === 'vocabulary' && <VocabularyWorkspace records={records} busy={busy} action={action} openSource={(id,paragraph)=>{const s=sessions.find(s=>s.id===id);if(s){openSession(s);setFocus(paragraph);}else setError('Không còn buổi đọc gốc trong tài khoản. Đoạn gốc vẫn được giữ trên thẻ.');}}/>}
 {page === 'library' && <><Heading eyebrow="HÀNH TRÌNH CỦA BẠN" title="Mọi điều đã học, ở đây." text="Bài đã lưu, ghi chú, đáp án và lịch sử hội thoại."/><LibrarySearch records={records} go={go} openReading={id=>{const s=sessions.find(s=>s.id===id);if(s)openSession(s);}}/><div className="grid-2"><div className="card"><h2>Bài đã lưu</h2>{readings.filter(r => bookmarks.has(r.id)).map(r => <div className="post" key={r.id}><h3>{r.title}</h3><button className="btn" onClick={() => start(r)}>Mở bài</button></div>)}{!bookmarks.size && <p>Chọn “Lưu bài” khi đang đọc để thêm vào thư viện.</p>}</div><div className="card"><h2>Buổi đọc gần đây</h2>{sessions.map(s => <div className="post" key={s.id}><span className={'badge ' + (s.data.finished ? 'green' : '')}>{s.data.finished ? 'Đã hoàn thành' : 'Đang học'}</span><h3>{readings.find(r => r.id === s.data.reading)?.title}</h3><p className="small">{date(s.data.started)} · {Object.keys(s.data.results || {}).length}/4 câu</p>{s.data.note && <p>Ghi chú: {s.data.note}</p>}<button className="secondary" onClick={() => { const r = readings.find(r => r.id === s.data.reading); if (!r)
                return; openSession(s); }}>Xem buổi học</button></div>)}{!sessions.length && <p>Chưa có buổi đọc. Bắt đầu từ trang Khám phá.</p>}</div></div><div className="card"><h2>Hội thoại đã lưu</h2>{records.filter(r => r.kind === 'chat').map(r => <details className="post" key={r.id}><summary>{r.data.mode === 'tutor' ? 'Trợ lý đọc hiểu' : r.data.persona} · {date(r.updated)}</summary>{r.data.turns.map((t: Any, i: number) => <p key={i}><b>{t.role === 'user' ? 'Bạn' : 'Trợ lý'}:</b> {t.text}</p>)}</details>)}{!records.some(r => r.kind === 'chat') && <p>Những buổi luyện hội thoại sẽ xuất hiện tại đây.</p>}</div></>}
 {(page === 'voice' || page === 'tutor') && <><Heading eyebrow={page === 'voice' ? 'LUYỆN NÓI, THÊM TỰ TIN' : 'ĐỌC SÂU HƠN'} title={page === 'voice' ? 'Một cuộc trò chuyện nhỏ.' : 'Cùng tìm lời giải trong bài đọc.'} text={page === 'voice' ? 'Chọn tình huống. Bạn có thể nhập chữ hoặc dùng micro.' : 'Trợ lý gợi mở từng bước, ưu tiên dẫn chứng trong bài.'}/><div className="notice"><Sparkles size={20}/><div><strong>{data?.aiConfigured && data?.profile.ai_consent ? 'AI trực tuyến sẵn sàng' : 'Đang dùng kịch bản soạn sẵn'}</strong><p>{data?.aiConfigured ? 'Tối đa 20 lượt AI/người/ngày. Quản lý việc gửi nội dung ở Hồ sơ & riêng tư.' : 'Chưa kết nối API. Bạn đang thử luồng hội thoại; phản hồi chưa được cá nhân hóa bởi mô hình AI.'}</p></div></div><div className="grid-2"><div className="card"><div className="row between"><h2>{page === 'voice' ? 'Voice companion' : 'Reading tutor'}</h2><button className="secondary" onClick={() => { setChatId(crypto.randomUUID()); setTurns([]); setChatStatus(''); }}>Buổi mới</button></div>{page === 'voice' ? <><label className="form-label" htmlFor="persona">Tình huống</label><select id="persona" value={persona} disabled={turns.length > 0} onChange={e => setPersona(e.target.value)}>{['Study buddy', 'Job interviewer', 'Travel partner'].map(p => <option key={p}>{p}</option>)}</select></> : <><label className="form-label" htmlFor="chatReading">Bài đọc</label><select id="chatReading" value={chatReading} onChange={e => { setChatReading(e.target.value); setChatId(crypto.randomUUID()); setTurns([]); }}>{readings.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}</select></>}<div className="chat-log" role="log" aria-label="Lịch sử hội thoại" style={{ marginTop: 16 }}>{!turns.length && <p>Gửi câu đầu tiên để bắt đầu. Ví dụ: “Can you help me practise for an interview?”</p>}{turns.map((t, i) => <div key={i} className={'bubble ' + t.role}>{t.text}{t.adapter && <div style={{ fontSize: 11, marginTop: 7 }}>{t.adapter === 'prepared' ? 'Kịch bản soạn sẵn' : 'AI trực tuyến'}</div>}</div>)}</div><form className="chat-input" onSubmit={e => { e.preventDefault(); void sendChat(); }}><label style={{ flex: 1 }}><span className="sr-only">Tin nhắn</span><input value={chatText} maxLength={1200} onChange={e => setChatText(e.target.value)} placeholder="Type your message…"/></label><button className="btn" disabled={busy || !chatText.trim()} aria-label="Gửi tin nhắn"><Send size={18}/></button></form>{chatStatus && <p className="small" role="status">{chatStatus}</p>}<label className="check"><input type="checkbox" checked={audio} onChange={e => setAudio(e.target.checked)}/>Đọc phản hồi bằng giọng trình duyệt</label><p className="small">Bắt đầu buổi mới để đổi tình huống. Hội thoại được lưu vào thư viện.</p></div><div><MediaLab mode="speech" onTranscript={setChatText}/><div className="card"><h2>Cùng một ý, khác hoàn cảnh</h2><p><b>Formal:</b> “Could you please clarify that point?”</p><p><b>Neutral:</b> “Could you explain that again?”</p><p><b>Casual:</b> “What do you mean?”</p><p className="small">Chọn cách nói phù hợp với người nghe và hoàn cảnh; cách thân mật không dùng cho mọi tình huống.</p></div></div></div></>}
 {page === 'skill-path' && <SkillPath action={action} onDirty={setPathDirty} read={()=>{if(pathDirty.current && !window.confirm('Bạn có thay đổi chưa lưu. Mở bài đọc và bỏ thay đổi?'))return;const r=readings.find(r=>r.id==='campus-cups');if(r)void start(r);}} review={()=>void go('vocabulary')}/>}
 {(page === 'pronunciation' || page === 'eye') && <><Heading eyebrow="PHÒNG THỰC NGHIỆM" title={page === 'eye' ? 'Khám phá cách theo dõi ánh nhìn.' : 'Nhìn khẩu hình, thử âm mới.'} text="Tính năng tùy chọn. Các giới hạn được ghi rõ để bạn đánh giá đúng trải nghiệm."/><MediaLab mode={page}/></>}
 {page === 'forum' && <><Heading eyebrow="HỌC CÙNG NHAU" title="Chia sẻ một điều bạn học được." text="Thảo luận cách đọc, cách nhớ từ và những câu hỏi của bạn."/><form className="card" key={editPost?.id || 'new'} onSubmit={async (e) => { e.preventDefault(); const f = e.currentTarget, d = new FormData(f); if (await action({ op: 'post', title: d.get('title'), body: d.get('body'), ...(editPost ? { id: editPost.id } : {}) }, 'Đã lưu bài viết.')) {
                f.reset();
                setEditPost(null);
            } }}><h2>{editPost ? 'Sửa bài viết' : 'Bài viết mới'}</h2><label className="form-label" htmlFor="postTitle">Tiêu đề</label><input id="postTitle" name="title" defaultValue={editPost?.title || ''} maxLength={120} required/><label className="form-label" htmlFor="postBody">Nội dung</label><textarea id="postBody" name="body" defaultValue={editPost?.body || ''} maxLength={3000} required/><p className="small">Không đăng thông tin riêng tư hoặc sao chép toàn bộ bài báo chưa có quyền sử dụng.</p><div className="row" style={{ marginTop: 16 }}><button className="btn" disabled={busy}>Đăng bài</button>{editPost && <button type="button" className="secondary" onClick={() => setEditPost(null)}>Hủy sửa</button>}</div></form><div className="card">{data?.posts.length ? data.posts.map((p: Any) => <article key={p.id} className="post"><span className="small">{p.name} · {date(p.created)}</span><h3>{p.title}</h3><p>{p.body}</p><div className="row" style={{ marginTop: 12 }}>{p.mine && <><button className="secondary" onClick={() => { setEditPost(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Sửa</button><button className="secondary" disabled={busy} onClick={() => action({ op: 'delete_post', id: p.id }, 'Đã xóa bài.')}>Xóa</button></>}<button className="secondary" disabled={busy} onClick={() => action({ op: 'report', id: p.id, reason: 'Người dùng đề nghị kiểm tra nội dung.' }, 'Đã gửi báo cáo.')}>Báo cáo</button></div>{data.comments.filter((c: Any) => c.post === p.id).map((c: Any) => <div className="feedback" key={c.id}><b>{c.name}</b><p>{c.body}</p></div>)}<form className="chat-input" onSubmit={async (e) => { e.preventDefault(); const f = e.currentTarget; const d = new FormData(f); if (await action({ op: 'comment', post: p.id, body: d.get('comment') }, 'Đã gửi bình luận.'))
                f.reset(); }}><input name="comment" maxLength={1000} required placeholder="Thêm bình luận…" aria-label="Nội dung bình luận"/><button className="secondary" disabled={busy}>Gửi</button></form></article>) : <div className="empty">Chưa có bài viết. Hãy mở đầu cuộc trò chuyện.</div>}</div></>}
 {page === 'support' && <><Heading eyebrow="GIÚP CHÚNG TÔI CẢI THIỆN" title="Trải nghiệm của bạn rất quan trọng." text="Gửi lỗi gặp phải hoặc đánh giá sau buổi dùng thử."/><div className="grid-2"><form className="card" onSubmit={async (e) => { e.preventDefault(); const f = e.currentTarget, d = new FormData(f); if (await action({ op: 'ticket', subject: d.get('subject'), body: d.get('body') }, 'Đã gửi yêu cầu hỗ trợ.'))
                f.reset(); }}><h2>Gửi hỗ trợ</h2><label className="form-label" htmlFor="subject">Vấn đề</label><input id="subject" name="subject" maxLength={120} required/><label className="form-label" htmlFor="ticketBody">Mô tả và các bước gặp lỗi</label><textarea id="ticketBody" name="body" maxLength={3000} required/><button className="btn" disabled={busy} style={{ marginTop: 16 }}>Gửi yêu cầu</button></form><form className="card" onSubmit={async (e) => { e.preventDefault(); const d = new FormData(e.currentTarget); if (await action({ op: 'feedback', ease: Number(d.get('ease')), helpful: Number(d.get('helpful')), again: Number(d.get('again')), comment: d.get('comment'), features: d.getAll('features') }, 'Cảm ơn bạn đã đánh giá!'))
                setFeedback(true); }}><h2>Đánh giá buổi dùng thử</h2><p className="small">1 = thấp nhất · 5 = cao nhất. Phiếu góp ý nội bộ, không phải thang đo nghiên cứu chuẩn hóa.</p>{[['ease', 'Web có dễ sử dụng không?'], ['helpful', 'Bạn thấy bài tập hữu ích đến đâu?'], ['again', 'Bạn muốn sử dụng lại đến mức nào?']].map(([k, label]) => <label className="form-label" key={k}>{label}<select name={k} required defaultValue=""><option value="" disabled>Chọn điểm</option>{[1, 2, 3, 4, 5].map(n => <option key={n}>{n}</option>)}</select></label>)}<label className="form-label">Bạn đã thử những phần nào?</label>{['Đọc hiểu', 'Từ vựng', 'Hành trình kỹ năng', 'Người đồng hành', 'Hội thoại', 'Phát âm', 'Gaze', 'Cộng đồng'].map(x => <label className="check" key={x}><input type="checkbox" name="features" value={x}/>{x}</label>)}<label className="form-label" htmlFor="feedbackComment">Điều hữu ích nhất / điều cần sửa</label><textarea id="feedbackComment" name="comment" maxLength={3000}/><button className="btn" disabled={busy} style={{ marginTop: 16 }}>{feedback ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}</button></form></div><div className="card"><h2>Yêu cầu của bạn</h2>{records.filter(r => r.kind === 'ticket').map(r => <div className="post" key={r.id}><span className={'badge ' + (r.data.status === 'resolved' ? 'green' : 'amber')}>{r.data.status === 'resolved' ? 'Đã xử lý' : 'Đang mở'}</span><h3>{r.data.subject}</h3><p>{r.data.body}</p>{r.data.reply && <div className="feedback"><b>Phản hồi từ nhóm</b><p>{r.data.reply}</p></div>}</div>)}{!records.some(r => r.kind === 'ticket') && <p>Chưa có yêu cầu hỗ trợ.</p>}</div></>}
 {page === 'privacy' && profileDraft && <><Heading eyebrow="BẠN KIỂM SOÁT DỮ LIỆU" title="Hồ sơ & quyền riêng tư." text="Bạn có thể học bình thường mà không tham gia nghiên cứu."/><div className="grid-2"><form className="card" onSubmit={async (e) => { e.preventDefault(); await action({ op: 'profile', ...profileDraft }, 'Đã cập nhật lựa chọn của bạn.'); }}><h2>Hồ sơ học tập</h2><label className="form-label" htmlFor="name">Tên hiển thị / biệt danh</label><input id="name" required maxLength={50} value={profileDraft.name} onChange={e => setProfileDraft({ ...profileDraft, name: e.target.value })}/><label className="form-label" htmlFor="cefr">Trình độ tự đánh giá</label><select id="cefr" value={profileDraft.cefr} onChange={e => setProfileDraft({ ...profileDraft, cefr: e.target.value })}>{['A2', 'B1', 'B1+', 'B2', 'C1'].map(x => <option key={x}>{x}</option>)}</select><label className="form-label" htmlFor="goal">Mục tiêu của bạn</label><input id="goal" maxLength={100} value={profileDraft.goal} onChange={e => setProfileDraft({ ...profileDraft, goal: e.target.value })}/><div className="divider"/><h2>Lựa chọn đồng ý</h2><label className="check"><input type="checkbox" checked={profileDraft.research} onChange={e => setProfileDraft({ ...profileDraft, research: e.target.checked })}/><span><strong>Tham gia pilot nghiên cứu</strong>Cho phép ghi thời gian hoạt động, cuộn, tra từ, đánh dấu và đổi đáp án; chia sẻ kết quả học và điểm góp ý với người nghiên cứu. Không ghi hình hoặc suy đoán tâm lý.</span></label><label className="check"><input type="checkbox" checked={profileDraft.aiConsent} onChange={e => setProfileDraft({ ...profileDraft, aiConsent: e.target.checked })}/><span><strong>Gửi nội dung chat đến dịch vụ AI khi đã cấu hình</strong>Bài đọc và tin nhắn có thể gửi đến Google Gemini; gói miễn phí có thể sử dụng nội dung để cải thiện sản phẩm. Không nhập thông tin nhạy cảm. Không gửi email hoặc dữ liệu camera.</span></label><p className="small">Phiên bản đồng ý: pilot-consent-v1. Rút đồng ý sẽ ngừng ghi sự kiện mới và loại dữ liệu khỏi bản xuất nghiên cứu mới. Bản xuất đã tải trước đó cần liên hệ nhóm để xử lý.</p><button className="btn" style={{ marginTop: 18 }} disabled={busy}>Lưu hồ sơ & lựa chọn</button></form><div><div className="card"><h2>Dữ liệu nào được lưu?</h2><p>Hồ sơ, từng lần trả lời và mở gợi ý, ghi chú, từ vựng, hội thoại, bài đăng và góp ý được lưu trên máy chủ để bạn tiếp tục trên thiết bị khác.</p><p>Camera chỉ hiển thị tại thiết bị. Nhận dạng giọng nói có thể dùng dịch vụ của trình duyệt sau khi bạn cho phép. Không lưu âm thanh thô trong pilot.</p><p>Đề xuất giữ dữ liệu pilot 30 ngày; nhóm quản trị cần thực hiện xóa sau đợt thử. Chưa có tác vụ xóa tự động.</p><button className="secondary" onClick={async () => { try {
                download('lingualens-my-data.json', await request('export'));
            }
            catch (e) {
                setError((e as Error).message);
            } }}><Download size={16}/>Tải dữ liệu của tôi</button></div><div className="card"><h2>Xóa dữ liệu ứng dụng</h2><p>Xóa hồ sơ học, bài làm, từ vựng, hội thoại, bài đăng và góp ý đang lưu. Không xóa tài khoản đăng nhập. Hạn mức chống lạm dụng trong ngày vẫn được giữ.</p><label className="form-label" htmlFor="deleteConfirm">Nhập DELETE để xác nhận</label><input id="deleteConfirm" value={confirmDelete} onChange={e => setConfirmDelete(e.target.value)}/><button className="danger" style={{ marginTop: 14 }} disabled={busy || confirmDelete !== 'DELETE'} onClick={async () => { if (await action({ op: 'delete_data', confirmation: 'DELETE' }, 'Đã xóa dữ liệu ứng dụng.', false)) {
                setActive(null);
                setTurns([]);
                setConfirmDelete('');
                location.href = signOutPath;
            } }}>Xóa dữ liệu của tôi</button></div></div></div></>}
 {page === 'admin' && isManager && <><Heading eyebrow="QUẢN TRỊ PILOT" title="Theo dõi và hỗ trợ người học." text="Dữ liệu thực từ các tài khoản đã sử dụng web."/>{admin ? <><div className="notice"><Users size={20}/><p>{admin.userCount} tài khoản đã truy cập · {admin.items.filter((x: Any) => x.kind === 'feedback').length} phiếu góp ý · API {data?.aiConfigured ? 'đã cấu hình' : 'chưa kết nối (0đ)'}</p></div><div className="card"><h2>Hỗ trợ, góp ý & báo cáo</h2>{admin.items.map((r: Any) => <div className="post" key={r.owner + r.kind + r.id}><span className="badge">{r.kind}</span><p className="small">{date(r.updated)}</p>{r.kind === 'feedback' ? <><p>Dễ dùng {r.data.ease}/5 · Hữu ích {r.data.helpful}/5 · Muốn dùng lại {r.data.again}/5</p><p>{r.data.comment || 'Không có ghi chú.'}</p></> : r.kind === 'report' ? <p>{r.data.reason} · Bài {r.data.post}</p> : <><h3>{r.data.subject}</h3><p>{r.data.body}</p><form className="stack" onSubmit={async (e) => { e.preventDefault(); const d = new FormData(e.currentTarget); if (await action({ op: 'reply', owner: r.owner, id: r.id, reply: d.get('reply'), status: d.get('status') }, 'Đã phản hồi.'))
                setAdmin(await request('admin')); }}><textarea name="reply" required maxLength={3000} defaultValue={r.data.reply} aria-label="Phản hồi hỗ trợ"/><select name="status" defaultValue={r.data.status} aria-label="Trạng thái"><option value="open">Đang mở</option><option value="resolved">Đã xử lý</option></select><button className="btn" disabled={busy}>Gửi phản hồi</button></form></>}</div>)}{!admin.items.length && <p>Chưa có phản hồi hoặc yêu cầu.</p>}</div><div className="card"><h2>Kiểm duyệt cộng đồng</h2>{admin.posts.map((p: Any) => <div className="post" key={p.id}><h3>{p.title}</h3><p>{p.body}</p><button className="secondary" disabled={busy} onClick={async () => { if (await action({ op: 'moderate', id: p.id, hidden: !p.hidden }, 'Đã cập nhật.'))
                setAdmin(await request('admin')); }}>{p.hidden ? 'Khôi phục bài' : 'Ẩn bài'}</button></div>)}</div></> : <p>Đang tải dữ liệu quản trị…</p>}</>}
 {page === 'research' && isResearch && <><Heading eyebrow="QUAN SÁT TRƯỚC, KẾT LUẬN SAU" title="Dữ liệu để đặt câu hỏi tốt hơn." text="Pilot 5 người nhằm phát hiện vấn đề sử dụng; chưa chứng minh hiệu quả học tập."/>{research && <><ResearchSummary data={{ participants: research.participants, responses: research.responses }}/><div className="grid-3"><div className="card"><div className="metric">{research.participants.length}</div><p>Người đang đồng ý nghiên cứu</p></div><div className="card"><div className="metric">{research.events.length}</div><p>Sự kiện được ghi nhận</p></div><div className="card"><div className="metric">{research.responses.filter((r: Any) => r.kind === 'feedback').length}</div><p>Phiếu góp ý có đồng ý</p></div></div><div className="notice warn"><FlaskConical size={20}/><p>Hiện mọi người dùng cùng cơ chế gợi ý. Đề cương bên dưới chưa tự phân nhóm hoặc thay đổi can thiệp. Bản xuất dùng mã người tham gia, bỏ tên và nội dung tự do; thời gian và mã buổi học vẫn có thể liên kết, cần giữ kín.</p></div><div className="card row between"><div><h2>Xuất dữ liệu pilot</h2><p className="small">Tải đủ các trang và kiểm tra đồng ý hiện tại trước khi xuất. Dữ liệu thay đổi giữa chừng sẽ yêu cầu tải lại.</p></div><button className="btn" disabled={busy} onClick={async () => { setBusy(true); setError(''); try { const fresh = await request('research'); setResearch(fresh); download('lingualens-research-pilot.json', fresh); } catch (e) { setResearch(null); setError((e as Error).message); } finally { setBusy(false); } }}><Download size={16}/>Tải JSON</button></div><div className="grid-2"><form className="card" onSubmit={async (e) => { e.preventDefault(); const f = e.currentTarget, d = new FormData(f); if (await action({ op: 'experiment', name: d.get('name'), hypothesis: d.get('hypothesis'), condition: d.get('condition') }, 'Đã lưu đề cương.')) {
                f.reset();
                setResearch(await request('research'));
            } }}><h2>Lưu đề cương để trao đổi GVHD</h2><label className="form-label" htmlFor="expName">Tên</label><input id="expName" name="name" required maxLength={120}/><label className="form-label" htmlFor="hypothesis">Giả thuyết</label><textarea id="hypothesis" name="hypothesis" required maxLength={1500}/><label className="form-label" htmlFor="condition">Điều kiện dự kiến</label><select id="condition" name="condition"><option value="adaptive">Gợi ý thích ứng</option><option value="conventional">Phản hồi thông thường</option></select><button className="btn" disabled={busy} style={{ marginTop: 16 }}>Lưu đề cương</button></form><div className="card"><h2>Đề cương đã lưu</h2>{research.experiments.map((e: Any) => <div className="post" key={e.id}><span className="badge">{e.status}</span><h3>{e.name}</h3><p>{e.hypothesis}</p></div>)}{!research.experiments.length && <p>Chưa có đề cương.</p>}</div></div></>}</>}
 </>}
 </>}</div></main>{signedIn && data?.companionScope && <Companion key={data.companionScope} scope={data.companionScope} page={page} openSignal={companionOpen} due={vocab.filter(v=>new Date(v.data.due).getTime()<=Date.now()).length} completed={sessions.filter(s=>s.data.finished).length} busy={busy} go={go}/>} {toast && <div className="toast" role="status">{toast}</div>}</div>;
}
function Heading({ eyebrow, title, text }: {
    eyebrow: string;
    title: string;
    text: string;
}) { return <div className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{text}</p></div></div>; }
