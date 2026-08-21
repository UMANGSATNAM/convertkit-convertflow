const fs=require('fs'),path=require('path');
let base='dev-theme-peri/sections';
let files=fs.readdirSync(base).filter(f=>/^hp(6[5-9]|7[0-9]|8[0-9]|9[0-9]|100)-/.test(f));
let cnt=0;
for(let f of files){
 let p=path.join(base,f);
 let c=fs.readFileSync(p,'utf8');
 let o=c;
 c=c.replaceAll('View All ->→','View All →');
 c=c.replaceAll('View All ->','View All →'); // unify to unicode arrow, keep one
 // fix double arrow leftover
 // keep single arrow
 // fix float rating if still broken
 c=c.replaceAll('4.8 •~. rating','4.8 ★ rating');
 c=c.replaceAll('4.8 ★ rating','4.8 ★ rating');
 if(c!==o){fs.writeFileSync(p,c,'utf8'); cnt++;}
}
console.log('arrow fixed',cnt);
// verify template json validity and count
let tfiles=fs.readdirSync('dev-theme-peri/templates').filter(f=>/^index\.hp-v/.test(f));
console.log('total index templates',tfiles.length);
let vlist=tfiles.map(f=>parseInt(f.match(/v(\d+)/)[1])).sort((a,b)=>a-b);
console.log('min',vlist[0],'max',vlist[vlist.length-1], 'missing', [...Array(100).keys()].map(i=>i+1).filter(n=> n>=52 && n<=100 && !vlist.includes(n)));
