const fs=require('fs'),path=require('path');
const base='dev-theme-peri/sections';
let files=fs.readdirSync(base).filter(f=> /^hp(6[5-9]|7[0-9]|8[0-9]|9[0-9]|100)-/.test(f));
let fixes=0;
for(let f of files){
 let p=path.join(base,f);
 let c=fs.readFileSync(p,'utf8');
 let o=c;
 // fix heading default broken
 if(c.includes(`'+title+'`)){
   let title='Featured';
   if(f.includes('featured-collection')) title='Featured Collection';
   else if(f.includes('bestsellers')) title='Bestsellers';
   else if(f.includes('ugc-reels')) title='As Seen On You';
   else title='Featured';
   c=c.replaceAll(`{{ section.settings.heading | default: '+title+' }}`, `{{ section.settings.heading | default: '${title}' }}`);
   c=c.replaceAll(`'+title+'`, `'${title}'`);
   c=c.replaceAll(`"'+title+'"`, `'${title}'`);
   // also the outer pattern
   c=c.replaceAll(`default: '"+title+"'`, `default: '${title}'`);
 }
 // generic remaining '+title+'
 c=c.replaceAll(`'+title+'`, `'Featured Collection'`);
 // fix View All arrow corrupted
 c=c.replaceAll(`View All \u001a`, `View All ->`);
 c=c.replaceAll(`View All \uFFFD`, `View All ->`);
 c=c.replaceAll(`View All `, `View All ->`);
 c=c.replaceAll(`default: 'View All `, `default: 'View All ->`);
 // fix price symbol ?1,999 -> ₹1,999
 c=c.replaceAll(`?1,999`, `₹1,999`);
 c=c.replaceAll(`�,11,999`, `₹1,999`);
 c=c.replaceAll(`�~.`, `★`);
 c=c.replaceAll(`�-�`, `●`);
 c=c.replaceAll(`�`, `•`);
 // fix double arrow in marquee etc
 // fix schema link_text default corrupted
 c=c.replaceAll(`"default":"View All `, `"default":"View All ->`);
 c=c.replaceAll(`View All ->'`, `View All ->`);
 if(c!==o){ fs.writeFileSync(p,c,'utf8'); fixes++; }
}
console.log('patched',fixes);
// verify one
console.log(fs.readFileSync('dev-theme-peri/sections/hp65-featured-collection.liquid','utf8').slice(600,900));
