const fs=require('fs');
let files=fs.readdirSync('dev-theme-peri/sections').filter(f=> /^hp(6[5-9]|7[0-9]|8[0-9]|9[0-9]|100)-/.test(f));
let fixed=0;
for(let f of files){
  let p='dev-theme-peri/sections/'+f;
  let c=fs.readFileSync(p,'utf8');
  let orig=c;
  // fix broken padding syntax
  c=c.replace(/\{\{"\{\{ /g,'{{ ').replace(/ \}\}"\}\}/g,' }}');
  // also fix container_width broken
  // fix any remaining double-brace quote pattern
  c=c.replace(/\{\{"\{\{/g,'{{').replace(/\}\}"\}\}/g,'}}');
  // fix icon corruption? keep
  if(c!==orig){ fs.writeFileSync(p,c); fixed++; }
}
console.log('fixed',fixed,'of',files.length);
// also check templates: verify json valid
let tfiles=fs.readdirSync('dev-theme-peri/templates').filter(f=>/^index\.hp-v(6[5-9]|[7-9][0-9]|100)\.json$/.test(f));
console.log('templates',tfiles.length);
for(let t of tfiles){ try{ JSON.parse(fs.readFileSync('dev-theme-peri/templates/'+t,'utf8')); } catch(e){ console.log('bad json',t,e.message)} }
