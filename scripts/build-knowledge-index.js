const fs = require('fs');
const path = require('path');
const lunr = require('lunr');

const DATA_DIR = path.join(__dirname, '..', 'public', 'knowledge', 'data');
const INDEX_PATH = path.join(DATA_DIR, 'search-index.json');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (full.endsWith('.md')) out.push(full);
  }
  return out;
}

const docs = walk(DATA_DIR).map((filePath) => {
  const rel = path.relative(DATA_DIR, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : rel;
  return {
    path: '/knowledge/data/' + rel,
    title,
    body: content,
  };
});

const idx = lunr(function () {
  this.ref('path');
  this.field('title', { boost: 10 });
  this.field('body');
  docs.forEach((d) => this.add(d));
});

fs.writeFileSync(INDEX_PATH, JSON.stringify({ docs, index: idx }), 'utf8');
console.log('Wrote', INDEX_PATH, '(' + Buffer.byteLength(fs.readFileSync(INDEX_PATH), 'utf8') + ' bytes)');
