const fs=require('fs');
let txt=fs.readFileSync('app/pagekit/pages.ts','utf8');
const ids=["peri-beauty","rawblox-streetwear","volt-streetwear-active","maison-couture","nordic-minimal-apparel","vintage-denim-co","urban-monochrome-drop","d2c-archetype","atelier-luxury","caratlane-jewellery","editorial-brutalist","bento-modern","tech-flagship","lookbook-lifestyle","organic-botanica","wellness-clinical","hpv6-conversion"];
for(const id of ids){
  // header
  const reH=new RegExp(`(id:\\s*"${id}"[\\s\\S]{0,800}?header:\\s*)"[^"]*"`);
  if(reH.test(txt)){
    txt=txt.replace(reH, `$1"header-${id}"`);
    console.log('fixed header',id);
  } else {
    // if no header, add one
    const reId=new RegExp(`(id:\\s*"${id}"[^\\n]*\\n)`);
    txt=txt.replace(reId, `$1    header: "header-${id}",\n`);
    console.log('added header',id);
  }
  const reF=new RegExp(`(id:\\s*"${id}"[\\s\\S]{0,1000}?footer:\\s*)"[^"]*"`);
  if(reF.test(txt)){
    txt=txt.replace(reF, `$1"footer-${id}"`);
    console.log('fixed footer',id);
  } else {
    const reH2=new RegExp(`(header:\\s*"header-${id}"[^\\n]*\\n)`);
    if(reH2.test(txt)){
      txt=txt.replace(reH2, `$1    footer: "footer-${id}",\n`);
      console.log('added footer',id);
    }
  }
}
fs.writeFileSync('app/pagekit/pages.ts',txt);
console.log('done');
