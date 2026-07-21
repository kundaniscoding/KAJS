const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk('./src/components/views');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Clean TableRow
  content = content.replace(/<TableRow className="[^"]*"/g, (match) => {
    let classes = match.match(/className="([^"]*)"/)[1].split(' ');
    let keep = classes.filter(c => !['bg-slate-50/40', 'backdrop-blur-sm', 'border-b', 'border-slate-100', 'hover:bg-slate-50/40', 'hover:bg-indigo-50/20', 'hover:bg-indigo-50/10', 'transition-colors', 'border-slate-100/65', 'border-slate-100/60', 'last:border-0', 'group', 'hover:bg-slate-50/30'].includes(c));
    if (keep.length > 0) return `<TableRow className="${keep.join(' ')}"`;
    return `<TableRow`;
  });

  // Clean TableHead
  content = content.replace(/<TableHead className="[^"]*"/g, (match) => {
    let classes = match.match(/className="([^"]*)"/)[1].split(' ');
    let keep = classes.filter(c => !['py-4', 'py-3', 'font-semibold', 'text-slate-700', 'text-slate-600', 'py-3.5'].includes(c));
    if (keep.length > 0) return `<TableHead className="${keep.join(' ')}"`;
    return `<TableHead`;
  });

  // Clean TableCell
  content = content.replace(/<TableCell className="[^"]*"/g, (match) => {
    let classes = match.match(/className="([^"]*)"/)[1].split(' ');
    let keep = classes.filter(c => !['py-4', 'py-3', 'py-3.5', 'py-2.5'].includes(c));
    if (keep.length > 0) return `<TableCell className="${keep.join(' ')}"`;
    return `<TableCell`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
