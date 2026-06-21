const fs = require('fs');
const path = require('path');
const lunr = require('lunr');

function walk(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const fp = path.join(dir, file);
    if (fs.statSync(fp).isDirectory()) walk(fp, filelist);
    else if (fp.endsWith('.md')) filelist.push(fp);
  });
  return filelist;
}

const base = path.join(__dirname, '..', 'public', 'knowledge', 'data');
const docs = walk(base).map(fp => ({
  id: path.relative(base, fp).replace(/\\/g, '/'),
  content: fs.readFileSync(fp, 'utf8')
}));

const idx = lunr(function () {
  this.ref('id');
  this.field('content');
  docs.forEach(doc => this.add(doc));
});

fs.mkdirSync(base, { recursive: true });
fs.writeFileSync(path.join(base, 'search-index.json'), JSON.stringify(idx));
console.log('Index created, docs:', docs.length);
