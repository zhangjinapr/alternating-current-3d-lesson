const fs=require('fs'),assert=require('assert');
const html=fs.readFileSync('index.html','utf8');
const fn=html.match(/function physics\(deg,dir=1\)\{[^\n]+\}/)[0];
const physics=Function('const clean=x=>Math.abs(x)<1e-8?0:x;'+fn+';return physics;')();
for(let d=0;d<=360;d++)for(const direction of [1,-1]){
 const p=physics(d,direction),[x,y]=p.q,[vx,vy]=p.v;
 assert(Math.abs(x*vx+y*vy)<1e-12,'v tangent to orbit');
 assert(Math.abs(vx*vx+vy*vy-1)<1e-12,'fixed speed magnitude');
 assert(Math.abs(p.current+vy)<1e-12,'v cross B current direction on AB');
}
[0,180,360].forEach(d=>assert.strictEqual(physics(d).current,0));
assert.strictEqual(physics(90).current,1);assert.strictEqual(physics(270).current,-1);
assert(!/<script[^>]+src=/.test(html),'offline scripts embedded');
console.log('PASS: 722 angle/direction states; tangential velocity, current sign, neutral/max positions, offline bundle.');
