import fs from 'fs';

const data = JSON.parse(fs.readFileSync('tmp-introspection.json', 'utf8'));

console.log("=== Types ===");
console.log(JSON.stringify(data.data.__type2, null, 2));
console.log(JSON.stringify(data.data.__type3, null, 2));

console.log("\n=== Mutations ===");
const fields = data.data.mutationType.mutationType ? data.data.mutationType.mutationType.fields : data.data.mutationType.fields;
fields.forEach((f: any) => {
  console.log(f.name);
  console.log(JSON.stringify(f.args, null, 2));
});

console.log("\n=== Cost ===");
console.log(JSON.stringify(data.extensions.cost, null, 2));
