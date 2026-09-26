'use client';
import {useMemo,useState} from 'react';
type Item={id:string;kind:string;data:Record<string,any>};
export default function LibrarySearch({records,openReading,go}:{records:Item[];openReading:(id:string)=>void;go:(page:string)=>void}) {
 const [query,setQuery]=useState('');
 const items=useMemo(()=>records.flatMap(r=>{
  if(r.kind==='session')return [{...r,title:r.data.readingContent?.title || r.data.reading,text:[r.data.note,...Object.values(r.data.draft || {})].join('\n'),type:'Buổi đọc',page:'reading'}];
  if(r.kind==='vocab')return [{...r,title:r.data.word,text:[r.data.meaning,r.data.quote].filter(Boolean).join('\n'),type:'Từ vựng',page:'vocabulary'}];
  if(r.kind==='chat')return [{...r,title:r.data.persona || 'Hội thoại',text:(r.data.turns || []).map((t:any)=>t.text).join('\n'),type:'Hội thoại',page:'library'}];
  if(r.kind==='skill_path')return [{...r,title:'Hành trình: Một chiếc cốc, nhiều góc nhìn',text:[r.data.writing,r.data.speaking].filter(Boolean).join('\n'),type:'Bản viết và luyện nói',page:'skill-path'}];
  return [];
 }),[records]);
 const needle=query.trim().toLocaleLowerCase(),matches=needle?items.filter(i=>(i.title+' '+i.text).toLocaleLowerCase().includes(needle)):[];
 return <div className="card"><h2>Tìm trong dữ liệu của bạn</h2><label className="form-label">Từ khóa trong ghi chú, từ vựng, hội thoại hoặc bản viết<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ví dụ: deposit, cốc giấy…"/></label>{needle && <p role="status">{matches.length} mục phù hợp</p>}{matches.slice(0,30).map(i=><div className="post" key={i.kind+i.id}><span className="badge">{i.type}</span><h3>{i.title}</h3><p>{i.text.slice(Math.max(0,i.text.toLowerCase().indexOf(needle)-70),Math.max(0,i.text.toLowerCase().indexOf(needle)-70)+350)}</p>{i.page!=='library' && <button className="secondary" onClick={()=>i.page==='reading'?openReading(i.id):go(i.page)}>Mở mục học</button>}</div>)}{matches.length>30 && <p>Hiển thị 30 mục đầu. Thêm từ khóa để thu hẹp kết quả.</p>}<p className="small">Chỉ tìm trong dữ liệu của tài khoản đang đăng nhập. Bản viết trước đây nằm trong Lịch sử hành trình.</p></div>;
}
