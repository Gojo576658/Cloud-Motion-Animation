const fs=require('fs'),path=require('path');
const {getIconData}=require('@iconify/utils');
const sets={ph:'ph',tabler:'tabler',lucide:'lucide',mdi:'mdi',carbon:'carbon','material-symbols':'material-symbols',fluent:'fluent',hugeicons:'hugeicons'};
const load={};for(const k in sets) load[k]=require(`@iconify-json/${sets[k]}/icons.json`);
const files=process.argv.slice(2);let bad=0;
for(const f of files){const s=fs.readFileSync(f,'utf8');for(const m of s.matchAll(/['"]((?:ph|tabler|lucide|mdi|carbon|material-symbols|fluent|hugeicons):[a-z0-9-]+)['"]/g)){const [p,n]=m[1].split(':');if(!getIconData(load[p],n)){console.log('MISSING',f,m[1]);bad++;}}}
console.log('missing',bad);
