import {db,record,now,HttpError} from './server';
import {fingerprint} from './learning-history';
import {skillUnit} from './skill-unit';
const key=skillUnit.id;
async function content() {
 const full={...skillUnit,answerKey:[0,1,2]}, encoded=JSON.stringify(full),version=await fingerprint(encoded);
 await db().prepare('INSERT OR IGNORE INTO content_versions (id,data,created) VALUES (?,?,?)').bind(version,encoded,now()).run();
 return version;
}
export async function getPath(owner:string) {
 const state=await record(owner,'skill_path',key);
 if(!state)return {unit:skillUnit,state:null,history:[]};
 const row=await db().prepare('SELECT data FROM content_versions WHERE id=?').bind(state.contentVersion).first<{data:string}>();
 if(!row)throw new HttpError(409,'Không tìm thấy phiên bản học liệu. Hãy gửi hỗ trợ.');
 const {answerKey,...unit}=JSON.parse(row.data);
 const history=(await db().prepare("SELECT data,updated FROM records WHERE owner=? AND kind='skill_path_event' ORDER BY updated DESC").bind(owner).all()).results.map(r=>{const e=JSON.parse(r.data as string);return {operation:e.operation,at:r.updated,revision:e.response.revision,writing:e.operation==='draft'||e.operation==='write'?e.response.writing:undefined,review:e.operation==='write'?e.response.writingReview:undefined};});
 history.sort((a,b)=>b.revision-a.revision);
 return {unit,state,history};
}
export async function startPath(owner:string) {
 const contentVersion=await content();
 const state={revision:0,contentVersion,started:now(),writing:'',speaking:'',listening:null,writingReview:null,speakingReview:null};
 await db().prepare('INSERT OR IGNORE INTO records (owner,kind,id,data,updated) VALUES (?,?,?,?,?)').bind(owner,'skill_path',key,JSON.stringify(state),now()).run();
 return getPath(owner);
}
type Input={requestId:string;expectedRevision:number;operation:'draft'|'listen'|'speak'|'write';text?:string;checks?:boolean[];answers?:number[];transcriptViewed?:boolean;audioPlayed?:boolean};
export async function updatePath(owner:string,b:Input) {
 const signature=JSON.stringify(b);
 const replay=async()=>{const e=await record(owner,'skill_path_event',b.requestId);if(e && e.input!==signature)throw new HttpError(409,'Mã gửi lại đã dùng cho nội dung khác.');return e?.response;};
 const previous=await replay();if(previous)return previous;
 const row=await db().prepare("SELECT data FROM records WHERE owner=? AND kind='skill_path' AND id=?").bind(owner,key).first<{data:string}>();
 if(!row)throw new HttpError(404,'Hãy bắt đầu hành trình trước.');
 const s=JSON.parse(row.data);
 if(s.revision!==b.expectedRevision){const cached=await replay();if(cached)return cached;throw new HttpError(409,'Hành trình đã thay đổi ở tab khác. Sao chép nội dung đang nhập rồi tải bản đã lưu.');}
 const source=await db().prepare('SELECT data FROM content_versions WHERE id=?').bind(s.contentVersion).first<{data:string}>();
 if(!source)throw new HttpError(409,'Không tìm thấy học liệu.');
 const unit=JSON.parse(source.data), at=now();
 if(b.operation==='listen'){
  if(!b.answers || b.answers.length!==unit.answerKey.length || b.answers.some((n,i)=>n<0||n>=unit.listening.questions[i].options.length))throw new HttpError(400,'Hãy trả lời đủ các câu nghe.');
  const result={answers:b.answers,correct:b.answers.map((n,i)=>n===unit.answerKey[i]),answerKey:unit.answerKey,at,transcriptViewed:!!b.transcriptViewed,audioPlayed:!!b.audioPlayed,attempt:(s.listening?.attempt || 0)+1};
  s.firstListening ||= result;s.listening=result;
 }else if(b.operation==='draft'){s.writing=b.text || '';}
 else {
  const checks=b.checks, expected=b.operation==='write'?unit.writing.criteria.length:unit.speaking.criteria.length;
  if(checks?.length!==expected || !b.text?.trim())throw new HttpError(400,'Hãy nhập nội dung và đối chiếu các tiêu chí.');
  if(b.operation==='write'){
   if(b.text.trim().split(/\s+/).length<20)throw new HttpError(400,'Hãy viết ít nhất 20 từ trước khi tự đối chiếu. Mục tiêu bài là 100–140 từ.');
   s.writing=b.text;s.writingReview={checks,at,text:b.text,contentVersion:s.contentVersion,adapter:'self-review',revision:s.revision+1};
  }else{s.speaking=b.text;s.speakingReview={checks,at,adapter:'self-review'};}
 }
 s.revision++;s.updated=at;
 const ledger={input:signature,operation:b.operation,response:s};
 try {
  const result=await db().batch([
   db().prepare("INSERT INTO records (owner,kind,id,data,updated) SELECT ?,'skill_path_event',?,?,? WHERE EXISTS (SELECT 1 FROM records WHERE owner=? AND kind='skill_path' AND id=? AND data=?)").bind(owner,b.requestId,JSON.stringify(ledger),at,owner,key,row.data),
   db().prepare("UPDATE records SET data=?,updated=? WHERE owner=? AND kind='skill_path' AND id=? AND data=?").bind(JSON.stringify(s),at,owner,key,row.data)
  ]);
  if(result[0].meta.changes)return s;
 }catch(e){const old=await replay();if(old)return old;throw e;}
 const old=await replay();if(old)return old;
 throw new HttpError(409,'Dữ liệu vừa đổi ở nơi khác. Nội dung đang nhập vẫn được giữ.');
}
