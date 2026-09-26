import assert from 'node:assert/strict';
const base=process.env.PILOT_TEST_URL || 'http://127.0.0.1:8787';assert.ok(['localhost','127.0.0.1'].includes(new URL(base).hostname));
const id=crypto.randomUUID(),users={a:'completion-a-'+id,admin:'completion-admin-'+id};let n=0;
const check=(v,label)=>{assert.ok(v,label);n++;console.log('PASS',label);};
async function api(user,body,query='view=bootstrap'){const r=await fetch(base+'/api/pilot?'+query,{method:body?'POST':'GET',headers:{'oai-authenticated-user-id':users[user],'oai-authenticated-user-email':user==='admin'?'test-admin@sites.test':'test@example.test','Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json()};}
const profile=research=>({op:'profile',name:'Private learner',cefr:'B1',goal:'Reading',research,aiConsent:false});
async function research(){let cursor,data;do{const r=await api('admin',null,'view=research&pageSize=1'+(cursor?'&cursor='+encodeURIComponent(cursor):''));assert.equal(r.status,200);if(!data)data=r.data;else data.responses.push(...r.data.responses);cursor=r.data.pagination.nextCursor;}while(cursor);return data;}
try{
 await api('admin');await api('a',profile(true));await api('a',{op:'path_start'});
 const text='SECRET_FREE_TEXT I recommend continuing this useful cup trial because it reduces waste although washing cups takes time and missing cups should be counted carefully.';
 await api('a',{op:'path_update',requestId:crypto.randomUUID(),expectedRevision:0,operation:'write',text,checks:[true,true,false,false]});
 const card=(await api('a',{op:'vocab',word:'SECRET_WORD',meaning:'SECRET_MEANING',reading:''})).data.id;
 await api('a',{op:'review',id:card,rating:'good',requestId:crypto.randomUUID(),expectedReviews:0});
 let r=await research(),own=r.responses.filter(x=>x.kind==='skill_path'&&x.data.revision===1);
 check(r.schema==='pilot-research-v3','export declares expanded schema');
 check(own.length===1 && own[0].data.writingSelfReview.current,'path self-review summary exported without text');
 check(r.responses.some(x=>x.kind==='vocab_review'&&x.data.rating==='good'),'vocabulary review included');
 check(!JSON.stringify(r).includes('SECRET_') && !JSON.stringify(r).includes('Private learner'),'no private writing, vocabulary or name in research export');
 const page=(await api('admin',null,'view=research&pageSize=1')).data;
 assert.ok(page.pagination.nextCursor);
 await api('a',{op:'path_update',requestId:crypto.randomUUID(),expectedRevision:1,operation:'draft',text:text+' Changed.'});
 check((await api('admin',null,'view=research&pageSize=1&cursor='+encodeURIComponent(page.pagination.nextCursor))).status===409,'path update invalidates research pagination');
 r=await research();check(r.responses.find(x=>x.kind==='skill_path'&&x.data.revision===2).data.writingSelfReview.current===false,'stale writing self-review clearly marked');
 const next=(await api('admin',null,'view=research&pageSize=1')).data;
 await api('a',{op:'review',id:card,rating:'easy',requestId:crypto.randomUUID(),expectedReviews:1});
 check((await api('admin',null,'view=research&pageSize=1&cursor='+encodeURIComponent(next.pagination.nextCursor))).status===409,'review update invalidates research pagination');
 const participant=own[0].participant;await api('a',profile(false));r=await research();
 check(!r.responses.some(x=>x.participant===participant),'consent withdrawal excludes path and vocabulary data');
 check((await api('a',null,'view=research')).status===403,'learner still cannot export research');
 console.log(n+' completion checks passed.');
}finally{for(const user of Object.keys(users))await api(user,{op:'delete_data',confirmation:'DELETE'});}
