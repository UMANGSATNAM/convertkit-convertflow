const fs = require('fs');

const en = JSON.parse(fs.readFileSync('app/data/templates/theme-engine/base-theme/locales/en.default.json', 'utf8'));
const hi = JSON.parse(fs.readFileSync('app/data/templates/theme-engine/base-theme/locales/hi.json', 'utf8'));

const untranslated = [];

function flattenObject(ob) {
  var toReturn = {};
  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if ((typeof ob[i]) == 'object' && ob[i] !== null) {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}

const flatEn = flattenObject(en);
const flatHi = flattenObject(hi);

for (const key in flatEn) {
  if (flatEn[key] === flatHi[key]) {
    untranslated.push({ key, value: flatEn[key] });
  }
}

let md = '# Hindi Untranslated Keys\n\nThe following keys in `hi.json` have values identical to `en.default.json` and represent scheduled translation backlog.\n\n';
md += '| Key | Value |\n|---|---|\n';
untranslated.forEach(item => {
  md += `| \`${item.key}\` | ${item.value} |\n`;
});

fs.writeFileSync('hi-untranslated.md', md);
console.log(`Generated hi-untranslated.md with ${untranslated.length} keys.`);
