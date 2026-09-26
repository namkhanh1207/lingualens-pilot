'use client';
import {useEffect,useRef,useState} from 'react';
import {Sheet,SheetContent,SheetTitle,SheetDescription} from '@/components/ui/sheet';
import {initialPosition,readPosition,positionBounds,normalizedPosition,pageGuide,type Position} from './lib/companion-model';

type Props={scope:string;page:string;openSignal:number;due:number;completed:number;busy:boolean;go:(page:string)=>Promise<void>};
export default function Companion({scope,page,openSignal,due,completed,busy,go}:Props) {
    const [position,setPosition]=useState<Position>(initialPosition),[ready,setReady]=useState(false),[small,setSmall]=useState(false);
    const [bounds,setBounds]=useState(()=>positionBounds(1024,768)),[open,setOpen]=useState(false),[dragging,setDragging]=useState(false),[tabVisible,setTabVisible]=useState(true);
    const [step,setStep]=useState<number|null>(null),[storageError,setStorageError]=useState(false),[navigationError,setNavigationError]=useState('');
    const key=useRef(''),current=useRef(position),boundsRef=useRef(bounds),launcher=useRef<HTMLButtonElement>(null),focusTarget=useRef<HTMLElement|null>(null);
    const drag=useRef<{id:number;x:number;y:number;left:number;top:number;previous:Position}|null>(null);
    current.current=position; boundsRef.current=bounds;
    function persist(next:Position) {
        current.current=next;setPosition(next);
        try {localStorage.setItem(key.current,JSON.stringify(next));setStorageError(false);}catch {setStorageError(true);}
    }
    useEffect(()=>{
        function resize() {
            const v=window.visualViewport, mobile=window.innerWidth<=760;
            const nextKey='lingualens.companion.v1.'+scope+'.'+(mobile?'mobile':'desktop');
            if(key.current!==nextKey){key.current=nextKey;try{setPosition(readPosition(localStorage.getItem(nextKey)));}catch{setPosition({...initialPosition});setStorageError(true);}}
            setSmall(mobile);
            setBounds(positionBounds(v?.width || window.innerWidth,v?.height || window.innerHeight,v?.offsetLeft || 0,v?.offsetTop || 0));setReady(true);
        }
        const visibility=()=>setTabVisible(!document.hidden);
        resize();visibility();window.addEventListener('resize',resize);window.visualViewport?.addEventListener('resize',resize);window.visualViewport?.addEventListener('scroll',resize);document.addEventListener('visibilitychange',visibility);
        return ()=>{window.removeEventListener('resize',resize);window.visualViewport?.removeEventListener('resize',resize);window.visualViewport?.removeEventListener('scroll',resize);document.removeEventListener('visibilitychange',visibility);};
    },[scope]);
    useEffect(()=>{if(openSignal){setOpen(true);setStep(null);}},[openSignal]);
    useEffect(()=>{setStep(null);},[page]);
    const steps=pageGuide(page), guide=step===null?null:steps[step];
    function closePanel(){setOpen(false);}
    function hide(){persist({...position,display:'hidden'});focusTarget.current=document.getElementById('companion-help');closePanel();}
    function place(x:number){persist({...position,x,y:1,display:position.display==='hidden'?'avatar':position.display});}
    async function navigate(destination:string){setNavigationError('');try{await go(destination);closePanel();}catch{setNavigationError('Không thể chuyển trang. Hãy lưu nội dung đang nhập rồi thử lại.');}}
    function showTarget(){const target=guide?.target ? document.querySelector<HTMLElement>(guide.target):null;if(target){target.tabIndex=-1;focusTarget.current=target;closePanel();}else setStep(n=>n===null || n+1>=steps.length ? null:n+1);}
    return <>
        {ready && position.display!=='hidden' && !open && <div className={'companion-shell '+(dragging?'dragging ':'')+(!tabVisible?'paused':'')} style={{left:bounds.left+position.x*bounds.width,top:bounds.top+position.y*bounds.height}}>
            {position.display==='avatar' && <button className="companion-grip" aria-label="Kéo vị trí người đồng hành; dùng phím mũi tên để di chuyển" title="Kéo để di chuyển" onKeyDown={e=>{const d:Record<string,number[]>={ArrowLeft:[-.1,0],ArrowRight:[.1,0],ArrowUp:[0,-.1],ArrowDown:[0,.1]};if(d[e.key]){e.preventDefault();persist({...position,x:Math.max(0,Math.min(1,position.x+d[e.key][0])),y:Math.max(0,Math.min(1,position.y+d[e.key][1]))});}}}
                onPointerDown={e=>{if(e.button!==0)return;e.currentTarget.setPointerCapture(e.pointerId);drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,left:bounds.left+position.x*bounds.width,top:bounds.top+position.y*bounds.height,previous:position};setDragging(true);}}
                onPointerMove={e=>{const d=drag.current;if(!d || d.id!==e.pointerId)return;setPosition(p=>({...p,...normalizedPosition(d.left+e.clientX-d.x,d.top+e.clientY-d.y,boundsRef.current,false)}));}}
                onPointerUp={e=>{const d=drag.current;if(!d || d.id!==e.pointerId)return;drag.current=null;setDragging(false);persist({...d.previous,...normalizedPosition(d.left+e.clientX-d.x,d.top+e.clientY-d.y,boundsRef.current,d.previous.dock)});}}
                onPointerCancel={()=>{const d=drag.current;drag.current=null;setDragging(false);if(d)setPosition(d.previous);}}>⠿</button>}
            <button ref={launcher} className="companion-launch" aria-label="Mở người đồng hành LinguaLens" title="Cần mình giúp gì không?" onClick={()=>setOpen(true)}
                style={{ transition: 'background var(--motion-duration-fast), transform var(--motion-duration-fast) var(--motion-easing-spring)' }}
                onMouseDown={e=>{e.currentTarget.style.transform='scale(0.92)';}}
                onMouseUp={e=>{e.currentTarget.style.transform='';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';}}>
                {position.display==='avatar'?<svg className="companion-avatar" width="62" height="62" viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="8" width="54" height="46" rx="20" fill="#2855d9"/><path d="M17 45 Q32 36 47 45 V59 Q32 51 17 59Z" fill="#fff" stroke="#101e33" strokeWidth="2"/><path d="M32 40V55" stroke="#101e33" strokeWidth="2"/><circle cx="23" cy="28" r="3" fill="white"/><circle cx="41" cy="28" r="3" fill="white"/><path d="M27 34Q32 38 37 34" fill="none" stroke="white" strokeWidth="2"/></svg>:<span>?</span>}
            </button>

        </div>}
        <Sheet open={open} onOpenChange={setOpen}><SheetContent side={small?'bottom':position.x>.5?'left':'right'} className="companion-panel" onCloseAutoFocus={e=>{e.preventDefault();const target=focusTarget.current;focusTarget.current=null;if(target?.isConnected){target.scrollIntoView({block:'center'});target.focus({preventScroll:true});}else (launcher.current || document.getElementById('companion-help'))?.focus();}}>
            <SheetTitle>Người đồng hành LinguaLens</SheetTitle><SheetDescription>Hướng dẫn soạn sẵn theo trang bạn đang mở. Bạn chủ động chọn mọi thao tác.</SheetDescription>
            <div className="companion-content stack">
                <div className="notice"><p>Bạn đã hoàn thành <b>{completed}</b> buổi đọc; có <b>{due}</b> thẻ đến lịch ôn.</p></div>
                {busy && <p role="status">Trang đang lưu hoặc tải dữ liệu. Hãy chờ hoàn tất trước khi chuyển bước.</p>}
                {guide ? <section aria-label="Hướng dẫn từng bước"><p className="small">Bước {step!+1}/{steps.length}</p><h3>{guide.title}</h3><p>{guide.text}</p><div className="toolbar">{guide.target && <button className="secondary" onClick={showTarget}>Xem vùng này</button>}<button className="secondary" disabled={step===0} onClick={()=>setStep(step!-1)}>Trước</button><button className="btn" onClick={()=>setStep(step!+1<steps.length?step!+1:null)}>{step!+1<steps.length?'Tiếp':'Xong'}</button><button className="secondary" onClick={()=>setStep(null)}>Bỏ qua hướng dẫn</button></div></section> : <><h3>Bước tiếp theo</h3><p>{page==='reading'?'Đọc đoạn văn, lưu cụm từ cần nhớ, rồi trả lời từng câu.':page==='vocabulary'?'Ôn những thẻ đến hạn trước. Bạn luôn có thể mở lại nguồn bài.':'Chọn một bài phù hợp hoặc tiếp tục buổi học trong Thư viện.'}</p><button className="btn" onClick={()=>setStep(0)}>Hướng dẫn trang này</button></>}
                <div className="toolbar"><button className="secondary" disabled={busy} onClick={()=>navigate(due?'vocabulary':'discover')}>{due?'Ôn '+due+' thẻ đến hạn':'Chọn bài đọc'}</button><button className="secondary" disabled={busy} onClick={()=>navigate('library')}>Tiếp tục buổi học</button><button className="secondary" disabled={busy} onClick={()=>navigate('support')}>Gửi góp ý</button></div>
                {navigationError && <p role="alert">{navigationError}</p>}
                <details><summary>Vị trí và hiển thị</summary><div className="toolbar"><button className="secondary" onClick={()=>place(0)}>Góc trái</button><button className="secondary" onClick={()=>place(1)}>Góc phải</button><button className="secondary" onClick={()=>persist({...initialPosition})}>Đặt lại vị trí</button></div><label className="check"><input type="checkbox" checked={position.dock} onChange={e=>persist({...position,dock:e.target.checked})}/>Ghim cạnh sau khi kéo</label><div className="toolbar"><button className="secondary" onClick={()=>{persist({...position,display:position.display==='collapsed'?'avatar':'collapsed'});closePanel();}}>{position.display==='collapsed'?'Hiện nhân vật':'Thu gọn'}</button><button className="secondary" onClick={hide}>Ẩn người đồng hành</button><button className="secondary" onClick={()=>persist({...position,display:'avatar'})}>Hiện nhân vật</button></div></details>
                <p className="small">Chế độ yên lặng: chỉ giúp khi bạn mở. Không tự bật micro, phát tiếng hay gửi câu trả lời. Vị trí lưu riêng trên trình duyệt này; mở lại bằng nút Người đồng hành ở thanh trên.</p>
                {storageError && <p role="status">Trình duyệt không cho lưu vị trí. Bạn vẫn dùng được trợ giúp trong lần mở này.</p>}
            </div>
        </SheetContent></Sheet>
    </>;
}
