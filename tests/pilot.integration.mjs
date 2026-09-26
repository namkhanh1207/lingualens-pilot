import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { nextReview,roleForEmail } from '../app/lib/learning.ts';

const base = process.env.PILOT_TEST_URL || 'http://127.0.0.1:8787';
assert.ok(['localhost','127.0.0.1'].includes(new URL(base).hostname), 'Tests may only write to local instances.');
const stamp = crypto.randomUUID();
const people = { a: 'qa-a-'+stamp, b: 'qa-b-'+stamp, admin: 'qa-admin-'+stamp };
let checks=0;
function check(condition,message){assert.ok(condition,message);checks++;console.log('PASS',message);}
async function api(user,body,view='',extra={}) {
 if(body && ['answer','hint','event'].includes(body.op)) body={requestId:crypto.randomUUID(),...body};
 const headers={...extra};
 if(user){headers['oai-authenticated-user-id']=people[user];headers['oai-authenticated-user-email']=user==='admin'?'test-admin@sites.test':user+'@sites.test';}
 if(body)headers['Content-Type']='application/json';
 const response=await fetch(base+'/api/pilot'+(view?'?view='+view:''),{method:body?'POST':'GET',headers,body:body?JSON.stringify(body):undefined});
 const data=await response.json();return {status:response.status,data};
}
try {
 check((await api(null)).status===401,'anonymous private-data request rejected');
 const catalog=(await api(null,null,'readings')).data;
 check(catalog.readings.length===5 && catalog.readings.every(r=>r.questions.every(q=>!('correct_index' in q)&&!('evidence_quote' in q))),'public catalog does not reveal answer keys');
 await Promise.all([api('a'),api('b'),api('admin')]);
 check((await api('a',null,'admin')).status===403,'learner cannot load moderation console');
 check((await api('b',null,'research')).status===403,'learner cannot export research data');
 check((await api('a',{op:'bookmark',reading:'campus-cups'},'',{Origin:'https://untrusted.example'})).status===403,'cross-origin mutation rejected');
 check((await api('a',{op:'profile',name:'',cefr:'B1',goal:'Reading',research:true,aiConsent:false})).status===400,'invalid profile rejected');
 const started=(await api('a',{op:'start',reading:'campus-cups'})).data;
 check(!!started.id,'reading session created');
 check((await api('a',{op:'start',reading:'campus-cups'})).data.id===started.id,'unfinished session resumes');
 check((await api('b',{op:'draft',session:started.id,answers:{},note:'intrusion',highlights:[]})).status===404,'second account cannot write first account session');
 check((await api('a',{op:'finish',session:started.id})).status===400,'incomplete session cannot finish');
 check((await api('a',{op:'event',session:started.id,type:'dwell',value:1000})).data.stored===false,'research tracking off by default');
 const profile={op:'profile',name:'QA participant',cefr:'B1',goal:'Reading',research:true,aiConsent:false};
 await api('a',profile);
 check((await api('a',{op:'event',session:started.id,type:'dwell',value:15000})).data.stored===true,'tracking records only after explicit consent');
 const hint=(await api('a',{op:'hint',session:started.id,question:'cups-1'})).data;
 check(hint.level===1&&!hint.paragraph,'first hint does not expose evidence');
 const wrong=(await api('a',{op:'answer',session:started.id,question:'cups-1',answer:'0'})).data;
 check(wrong.correct===false&&!!wrong.evidence,'wrong answer receives source evidence');
 const right=(await api('a',{op:'answer',session:started.id,question:'cups-1',answer:'1'})).data;
 check(right.correct===true&&right.attempts===2,'resubmission records correct outcome and attempt count');
 await api('a',{op:'draft',session:started.id,answers:{'cups-1':'1'},note:'QA note',highlights:[0]});
 let exported=(await api('a',null,'export')).data;
 check(exported.records.find(r=>r.id===started.id).data.results['cups-1'].correct===true,'draft save preserves graded answer');
 await api('a',{op:'answer',session:started.id,question:'cups-2',answer:'2'});
 await api('a',{op:'answer',session:started.id,question:'cups-3',answer:'0'});
 const open=(await api('a',{op:'answer',session:started.id,question:'cups-4',answer:'Washing takes staff time and some cups are missing.'})).data;
 check(open.correct===null&&open.adapter==='self-review','open answer does not fabricate an AI grade');
 check((await api('a',{op:'finish',session:started.id})).status===200,'complete reading session finishes');
 check((await api('a',{op:'draft',session:started.id,answers:{},note:'late',highlights:[]})).status===409,'finished session protected from stale drafts');
 const card = (await api('a',{op:'vocab',word:'deposit',meaning:'money returned when an item is returned',reading:'campus-cups'})).data;
 await api('a',{op:'review',id:card.id,rating:'good'});
 const saved=(await api('a')).data.records;
 check(saved.some(r=>r.kind==='vocab'&&r.data.level===1&&r.data.reviews===1),'flashcard review and next date persisted');
 check(!(await api('b')).data.records.some(r=>r.kind==='vocab'),'vocabulary isolated across accounts');
 const chat=(await api('a',{op:'chat',id:stamp,mode:'voice',reading:'campus-cups',persona:'Job interviewer',message:'Hello'})).data;
 check(chat.adapter==='prepared'&&!!chat.reason,'unconfigured AI transparently falls back to prepared practice');
 await api('a',{op:'post',title:'QA test post',body:'Testing the forum.'});
 const post=(await api('a')).data.posts.find(p=>p.title==='QA test post');
 check((await api('b',{op:'delete_post',id:post.id})).status===403,'second account cannot delete another post');
 await api('b',{op:'comment',post:post.id,body:'Test comment'});
 check((await api('a')).data.comments.some(c=>c.post===post.id),'forum comments shared');
 check((await api('a',{op:'moderate',id:post.id,hidden:true})).status===403,'learner cannot moderate');
 await api('admin',{op:'moderate',id:post.id,hidden:true});
 check(!(await api('b')).data.posts.some(p=>p.id===post.id),'hidden post excluded from learner feed');
 await api('a',{op:'feedback',ease:4,helpful:4,again:3,comment:'QA feedback',features:['Đọc hiểu']});
 await api('a',{op:'ticket',subject:'QA help',body:'Please test support reply.'});
 const admin=(await api('admin',null,'admin')).data;
 const ticket=admin.items.find(r=>r.owner===people.a&&r.kind==='ticket');
 await api('admin',{op:'reply',owner:people.a,id:ticket.id,reply:'QA resolved',status:'resolved'});
 check((await api('a')).data.records.some(r=>r.kind==='ticket'&&r.data.reply==='QA resolved'),'support reply visible only to ticket owner');
 let research=(await api('admin',null,'research')).data;
 check(research.events.some(e=>e.session===started.id)&&!JSON.stringify(research).includes(people.a)&&!JSON.stringify(research).includes('QA feedback'),'research export omits identity and free-text feedback');
 await api('a',{...profile,research:false});
 check((await api('a',{op:'event',session:started.id,type:'scroll',value:120})).data.stored===false,'withdrawal stops new event collection');
 research=(await api('admin',null,'research')).data;
 check(!research.events.some(e=>e.session===started.id),'withdrawn participant excluded from future research exports');
 check(roleForEmail('OWNER@example.com',{admin:'owner@example.com'})==='admin'&&roleForEmail('other@example.com',{admin:'owner@example.com'})==='learner','server role allowlist exact and case insensitive');
 check(nextReview(3,'again',0).due===new Date(600000).toISOString()&&nextReview(0,'good',0).level===1,'review scheduling handles lapse and successful recall');
 const seed=JSON.parse(readFileSync(new URL('../app/readings.json',import.meta.url),'utf8'));
 check(seed.readings.every(r=>r.questions.every(q=>r.paragraphs[q.evidence_paragraph-1].includes(q.evidence_quote))),'all curated answer evidence is grounded in the passage');

 for (const reading of seed.readings.filter(r => ['bus-notebook','repair-weekend'].includes(r.id))) {
  const session=(await api('b',{op:'start',reading:reading.id})).data;
  for (const q of reading.questions) {
   const result=await api('b',{op:'answer',session:session.id,question:q.id,answer:q.type==='mcq'?String(q.correct_index):q.sample_answer});
   check(result.status===200 && result.data.correct===(q.type==='mcq'?true:null) && reading.paragraphs[result.data.paragraph-1].includes(result.data.evidence),reading.id+' '+q.id+' graded with matching evidence');
  }
  check((await api('b',{op:'finish',session:session.id})).status===200,reading.id+' can complete a full session');
 }
 console.log('SUCCESS: '+checks+' checks passed.');
} finally {
 for(const user of ['a','b','admin'])await api(user,{op:'delete_data',confirmation:'DELETE'});
}
