import fs from 'fs';

const data = JSON.parse(fs.readFileSync('tmp-introspection.json', 'utf8'));

console.log("=== Types ===");
console.log(JSON.stringify(data.data.__type1, null, 2));
console.log(JSON.stringify(data.data.__type2, null, 2));
console.log(JSON.stringify(data.data.__type3, null, 2));

console.log("\n=== Mutations ===");
const fields = data.data.mutationType.mutationType ? data.data.mutationType.mutationType.fields : data.data.mutationType.fields;
const targets = ['themeCreate', 'themeFilesUpsert', 'stagedUploadsCreate'];
fields.forEach((f: any) => {
  if (targets.includes(f.name)) {
    console.log(`\nMutation: ${f.name}`);
    console.log(JSON.stringify(f.args, null, 2));
  }
});

console.log("\n=== Cost ===");
console.log(JSON.stringify(data.extensions?.cost || data.data.extensions?.cost || data.cost, null, 2));
