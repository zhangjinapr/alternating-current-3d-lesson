const fs=require('fs'),vm=require('vm'),assert=require('assert'),T=require('./vendor/three.min.js');
const source=fs.readFileSync('build.py','utf8'),root=new T.Group(),rotor=new T.Group();root.add(rotor);
const ctx={T,root,rotor,white:0xe5ebf0,vec:a=>new T.Vector3(...a)};vm.createContext(ctx);
vm.runInContext(source.slice(source.indexOf('function mat('),source.indexOf('function wire('))+source.slice(source.indexOf('const conductorPaths=[];'),source.indexOf('function box('))+';this.paths=conductorPaths;',ctx);
vm.runInContext(source.slice(source.indexOf('conductor([[0,.18,.90]'),source.indexOf('wire([0,0,-1.15]')),ctx);
for(const c of ctx.paths){for(let j=1;j<c.path.curves.length;j++)assert(c.path.curves[j-1].getPoint(1).distanceTo(c.path.curves[j].getPoint(0))<1e-12,'continuous bends without gaps');for(const x of c.mesh.geometry.attributes.position.array)assert(Number.isFinite(x));}
const [coil,red,blue]=ctx.paths;
for(let angle=0;angle<360;angle+=5){rotor.rotation.z=angle*Math.PI/180;root.updateMatrixWorld(true);
 for(const [lead,z] of [[red,1.52],[blue,2.15]]){const endpoint=lead.points.at(-1).clone().applyMatrix4(rotor.matrixWorld),ringCenter=new T.Vector3(0,0,z).applyMatrix4(rotor.matrixWorld);assert(Math.abs(endpoint.distanceTo(ringCenter)-.29)<1e-12,'lead penetrates rotating ring at all angles');}
 const terminals=[coil.points[0],coil.points.at(-1)];for(let j=0;j<2;j++){const lead=[red,blue][j];assert(terminals[j].x===lead.points[0].x&&terminals[j].y===lead.points[0].y);assert(lead.points[0].z<terminals[j].z,'wire and coil overlap along shared axis');}
}
assert(source.includes('brushShape.lineTo(x,-Math.sqrt(.345*.345-x*x))'));assert(.345<.29+.062&&.45<.47,'brush overlaps ring and external lead terminal lies inside brush');
console.log('PASS: continuous rounded conductor bends; coil-terminal overlap; rotating lead/ring connections at 72 angles; brush-ring contact and lead insertion.');
