const fs=require('fs'),path=require('path');
let base='dev-theme-peri/sections';
let files=fs.readdirSync(base).filter(f=>/^hp(6[5-9]|7[0-9]|8[0-9]|9[0-9]|100)-/.test(f));
let cnt=0;
for(let f of files){
 let p=path.join(base,f);
 let c=fs.readFileSync(p,'utf8');
 if(c.includes('+title+')){
   let title='Featured Collection';
   if(f.includes('featured-collection')) title='Featured Collection';
   else if(f.includes('bestsellers')) title='Bestsellers';
   else if(f.includes('ugc-reels')) title='Customer Reels';
   else title='Featured Collection';
   // brute replace all variants containing +title+
   // replace literal string "+title+" with title
   // using split join to avoid escaping issues
   c = c.split('"+title+"').join(title);
   c = c.split("'+title+'").join("'"+title+"'");
   c = c.split('"+title+"').join(title);
   c = c.split('+title+').join(title);
   if(c.includes('default: \'"')){ c=c.replaceAll("default: '\"","default: '"); c=c.replaceAll("\"'","'"); }
   fs.writeFileSync(p,c,'utf8'); cnt++; console.log('fixed '+f)
 }
}
console.log('done',cnt);
