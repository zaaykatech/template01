const ts = require('typescript');
const fs = require('fs');

const file = 'src/app/MenuClient.tsx';
const content = fs.readFileSync(file, 'utf8');

const sourceFile = ts.createSourceFile(
  file,
  content,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX
);

const diagnostics = sourceFile.parseDiagnostics;
if (diagnostics && diagnostics.length > 0) {
  diagnostics.forEach(diag => {
    if (diag.start !== undefined) {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(diag.start);
      console.log(`Error at line ${line + 1}, char ${character + 1}: ${ts.flattenDiagnosticMessageText(diag.messageText, '\n')}`);
    } else {
      console.log(`Error: ${ts.flattenDiagnosticMessageText(diag.messageText, '\n')}`);
    }
  });
} else {
  console.log("No parse diagnostics from TS");
}
