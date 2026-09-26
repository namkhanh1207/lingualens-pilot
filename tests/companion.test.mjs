import assert from 'node:assert/strict';
import {initialPosition,readPosition,positionBounds,normalizedPosition,pageGuide} from '../app/lib/companion-model.ts';
assert.deepEqual(readPosition('{broken'),initialPosition);
assert.deepEqual(readPosition(JSON.stringify({...initialPosition,version:9})),initialPosition);
assert.deepEqual(readPosition(JSON.stringify({...initialPosition,x:'0.5'})),initialPosition);
assert.deepEqual(readPosition(JSON.stringify({...initialPosition,x:-10,y:100})),{...initialPosition,x:0,y:1});
for(const [w,h,ox,oy] of [[1440,900,0,0],[390,844,0,0],[320,220,0,180],[220,160,50,90]]){
 const b=positionBounds(w,h,ox,oy);
 assert.ok(b.left>=ox && b.top>=oy && b.left+b.width+80<=ox+w && b.top+b.height+98<=oy+h,'avatar within visual viewport including keyboard offset');
 assert.deepEqual(normalizedPosition(-100,-100,b,false),{x:0,y:0});
 assert.deepEqual(normalizedPosition(10000,10000,b,false),{x:b.width?1:0,y:b.height?1:0});
 const n=normalizedPosition(b.left+b.width*.3,b.top+b.height*.5,b,true);
 assert.equal(n.x,0);
}
for(const page of ['reading','vocabulary','dashboard','voice','privacy']){
 const steps=pageGuide(page);assert.ok(steps.length>=3 && steps.length<=5);
 assert.ok(steps.every(s=>s.title && s.text));
}
console.log('Companion: storage validation, viewport bounds, docking and guides passed.');
