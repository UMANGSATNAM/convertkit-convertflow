import fs from 'fs';

const data = JSON.parse(fs.readFileSync('tmp-introspection.json', 'utf8'));

const stagedUploadsCreateMutation = data.data.mutationType.fields ? data.data.mutationType.fields.find((f: any) => f.name === 'stagedUploadsCreate') : data.data.mutationType.mutationType.fields.find((f: any) => f.name === 'stagedUploadsCreate');
console.log(JSON.stringify(stagedUploadsCreateMutation, null, 2));

