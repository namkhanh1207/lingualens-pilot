import assert from 'node:assert/strict';
const base=process.env.PILOT_TEST_URL || 'http://127.0.0.1:8787';
assert.ok(['127.0.0.1','localhost'].includes(new URL(base).hostname));
const headers={'Content-Type':'application/json','oai-authenticated-user-id':'qa-race-'+crypto.randomUUID(),'oai-authenticated-user-email':'race@sites.test'};
const post=async body=>{const r=await fetch(base+'/api/pilot',{method:'POST',headers,body:JSON.stringify(body)});assert.equal(r.status,200);return r.json();};
try {
 const sessions=await Promise.all(Array.from({length:6},()=>post({op:'start',reading:'campus-cups'})));
 assert.equal(new Set(sessions.map(s=>s.id)).size,1);
 const r=await fetch(base+'/api/pilot?view=export',{headers});
 const exported=await r.json();
 assert.equal(exported.records.filter(r=>r.kind==='session').length,1);
 console.log('PASS concurrent start returns one stored unfinished session');
} finally {await post({op:'delete_data',confirmation:'DELETE'});}
