import assert from 'node:assert/strict';

const base = process.env.PILOT_TEST_URL || 'http://127.0.0.1:8787';
assert.ok(['localhost','127.0.0.1'].includes(new URL(base).hostname), 'Local test instances only.');
const stamp = crypto.randomUUID();
const users = { a: 'p1-a-'+stamp, b: 'p1-b-'+stamp, admin: 'p1-admin-'+stamp };
let checks = 0;
const check = (condition, label) => { assert.ok(condition, label); checks++; console.log('PASS', label); };
async function api(user, body, query='') {
    const headers = { 'oai-authenticated-user-id': users[user], 'oai-authenticated-user-email': user === 'admin' ? 'test-admin@sites.test' : user+'@sites.test' };
    if (body) headers['Content-Type'] = 'application/json';
    const r = await fetch(base+'/api/pilot'+(query ? '?'+query : ''), { method: body ? 'POST' : 'GET', headers, body: body ? JSON.stringify(body) : undefined });
    return { status: r.status, data: await r.json() };
}
const profile = (research=true) => ({ op:'profile', name:'Phase one test', cefr:'B1', goal:'Reading', research, aiConsent:false });
const action = (op, session, question, extra={}) => ({ op, session, question, requestId:crypto.randomUUID(), ...extra });
async function fullResearch(size=2) {
    let cursor, data, pages = 0;
    const keys = ['participants','events','responses','history','experiments','contentVersions'];
    do {
        const r = await api('admin', null, 'view=research&pageSize='+size+(cursor ? '&cursor='+encodeURIComponent(cursor) : ''));
        assert.equal(r.status,200,JSON.stringify(r.data));
        if (!data) data = r.data;
        else for (const k of keys) data[k].push(...r.data[k]);
        cursor = r.data.pagination.nextCursor; pages++;
        assert.ok(pages<1000);
    } while (cursor);
    for (const k of keys) assert.equal(data[k].length, data.pagination.totals[k], k+' complete');
    return { ...data, pages };
}
try {
    await api('admin'); await api('a',profile()); await api('b',profile());
    const start = (await api('a',{op:'start',reading:'campus-cups'})).data;
    check(start.data.historyVersion === 2 && start.data.contentVersion.length === 64, 'new session has immutable content version and history coverage');
    check(!JSON.stringify(start.data.readingContent).includes('correct_index'), 'saved public reading snapshot hides answer key');
    const sid = start.id;
    const answer = action('answer',sid,'cups-1',{answer:'0'});
    const duplicates = await Promise.all([api('a',answer),api('a',answer)]);
    check(duplicates.every(r=>r.status===200&&r.data.attempts===1), 'concurrent duplicate request records one attempt');
    check((await api('a',{...answer,answer:'1'})).status===409,'reusing request ID with different content rejected');
    const next = await api('a',action('answer',sid,'cups-1',{answer:'1'}));
    check(next.data.attempts===2 && next.data.answerAlreadyShown, 'resubmission tracks prior answer exposure');
    let session = (await api('a')).data.records.find(r=>r.id===sid).data;
    check(session.firstResults['cups-1'].correct===false && session.results['cups-1'].correct===true,'first result retained separately from corrected result');
    const hint = action('hint',sid,'cups-2');
    const hints = await Promise.all([api('a',hint),api('a',hint)]);
    check(hints.every(r=>r.status===200&&r.data.level===1), 'duplicate hint does not advance support level');
    await api('a',action('hint',sid,'cups-2'));
    const afterHint = await api('a',action('answer',sid,'cups-2',{answer:'2'}));
    check(afterHint.data.hintLevelBefore===2 && !afterHint.data.answerAlreadyShown,'attempt retains exact pre-submission hint level');
    const concurrent = await Promise.all([
        api('a',action('answer',sid,'cups-3',{answer:'0'})),
        api('a',action('answer',sid,'cups-4',{answer:'Private answer should not appear in research export.'})),
        api('a',{op:'draft',session:sid,answers:{},note:'Private note',highlights:[0]})
    ]);
    check(concurrent.every(r=>r.status===200), 'concurrent distinct answers and draft accepted without lost updates');
    session = (await api('a')).data.records.find(r=>r.id===sid).data;
    check(Object.keys(session.results).length===4 && session.note==='Private note' && session.firstResults['cups-1'].correct===false, 'draft preserves results and immutable first result');
    check((await api('b',null,'view=history&session='+sid)).status===404, 'history isolated by session owner');
    let history = (await api('a',null,'view=history&session='+sid)).data.items;
    check(history.filter(r=>r.operation==='answer').length===5 && history.filter(r=>r.operation==='hint').length===2, 'all distinct attempts and hint exposures retained');
    check(history[0].data.isFirstAttempt && history[0].data.hintLevelBefore===0 && !history[0].data.answerAlreadyShown, 'first unassisted attempt is identifiable');
    check((await api('a',null,'view=export')).data.history.length===7, 'personal data export includes history');
    const event = {op:'event',requestId:crypto.randomUUID(),session:sid,type:'scroll',value:25};
    await Promise.all([api('a',event),api('a',event)]);
    check((await api('a',{...event,value:30})).status===409, 'event key cannot be reused with different payload');
    let research = await fullResearch();
    check(research.pages>1 && research.history.filter(r=>r.session===sid).length===7,'all export pages assembled without truncation');
    check(research.events.filter(r=>r.session===sid).length===1,'retry event stored once');
    const alias = research.responses.find(r=>r.id===sid).participant;
    check(/^P-/.test(alias)&&!JSON.stringify(research).includes(users.a)&&!JSON.stringify(research).includes('Private answer')&&!JSON.stringify(research).includes('Private note'), 'research removes identity and free-text answers');
    check(research.contentVersions.some(v=>v.id===start.data.contentVersion),'export includes reproducible source content version');
    const page = await api('admin',null,'view=research&pageSize=1');
    await api('b',profile(false));
    check((await api('admin',null,'view=research&pageSize=1&cursor='+encodeURIComponent(page.data.pagination.nextCursor))).status===409,'consent change invalidates in-flight export');
    research = await fullResearch();
    check(research.responses.find(r=>r.id===sid).participant===alias,'remaining participant code stable after another withdrawal');
    await api('a',profile(false));
    research = await fullResearch();
    check(!research.history.some(r=>r.session===sid)&&!research.events.some(r=>r.session===sid),'withdrawal excludes history and events from new exports');
    check(!(await api('a',{...event,requestId:crypto.randomUUID()})).data.stored,'withdrawn consent prevents new event storage');
    await api('a',profile());
    research = await fullResearch();
    check(research.responses.find(r=>r.id===sid).participant===alias,'reconsenting preserves participant code');
    check((await api('admin',null,'view=research&cursor=broken')).status===400,'malformed export cursor rejected');
    check((await api('admin',null,'view=research&pageSize=201')).status===400,'oversized export page rejected');
    check((await api('b',null,'view=research&pageSize=1')).status===403,'pagination does not bypass researcher role');
    check((await api('a',{op:'finish',session:sid})).status===200,'session completes after history capture');
    check((await api('a',answer)).data.attempts===1,'retry returns original response even after session finished');
    check((await api('a',action('hint',sid,'cups-1'))).status===409,'finished session rejects new hint exposure');
    const beforeDelete = await fullResearch();
    await api('a',{op:'delete_data',confirmation:'DELETE'});
    const afterDelete = await fullResearch();
    check(!afterDelete.participants.some(p=>p.participant===alias)&&!afterDelete.history.some(r=>r.session===sid), 'deletion removes identity mapping and learning history');
    check(afterDelete.pagination.totals.history<beforeDelete.pagination.totals.history,'export totals reflect deletion');
    console.log('SUCCESS: '+checks+' phase 1 checks passed.');
} finally {
    for(const user of ['a','b','admin']) await api(user,{op:'delete_data',confirmation:'DELETE'});
}
