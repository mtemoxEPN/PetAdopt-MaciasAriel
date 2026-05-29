const fs = require('fs');
const path = require('path');

let count = 0;

function searchDir(dir, depth) {
  if (depth > 4) return;
  if (!fs.existsSync(dir)) return;
  let items;
  try { items = fs.readdirSync(dir); } catch(e) { return; }
  
  items.forEach(item => {
    const full = path.join(dir, item);
    try {
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        searchDir(full, depth + 1);
      } else if (full.endsWith('.js')) {
        const content = fs.readFileSync(full, 'utf8');
        if (content.includes('OTEL_PKG')) {
          console.log('FOUND:', full);
          count++;
          const fixed = content.replace(/import\([^)]*OTEL_PKG[^)]*\)/g, 'Promise.resolve({})');
          fs.writeFileSync(full, fixed);
          console.log('PATCHED!');
        }
      }
    } catch(e) {}
  });
}

searchDir('node_modules', 0);
console.log('Done. Found:', count, 'files');