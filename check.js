const fs = require('fs');
const parser = require('@babel/parser');

try {
  const code = fs.readFileSync('src/app/MenuClient.tsx', 'utf8');
  parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
  console.log("No syntax error found by Babel.");
} catch (e) {
  console.log("Babel parse error:", e.message);
  console.log("Line:", e.loc?.line);
  console.log("Column:", e.loc?.column);
}
