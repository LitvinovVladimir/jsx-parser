const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, 'src/index.jsx'); // Укажите путь к вашему исходному файлу

const outputFilePath = path.join(__dirname, 'input.jsx'); // Укажите путь к выходному файлу

function processFile(filePath) {
  let fileContent = fs.readFileSync(filePath, 'utf-8');
  const importRegex = /import\s+(\w+)\s+from\s+['"](\.\/[^'"]+)['"]/g;
  let match;

  while ((match = importRegex.exec(fileContent)) !== null) {
    const [importStatement, importVar, importPath] = match;
    const absoluteImportPath = path.resolve(path.dirname(filePath), importPath + '.jsx');

    if (fs.existsSync(absoluteImportPath)) {
      const importedFileContent = fs.readFileSync(absoluteImportPath, 'utf-8');
      fileContent = fileContent.replace(importStatement, importedFileContent);
    } else {
      console.error(`File not found: ${absoluteImportPath}`);
    }
  }
  fileContent = fileContent.split('\n').filter(line => !line.trim().startsWith('export default')).join('\n');
  fileContent = fileContent.replace(/export/g, '');

  const lines = fileContent.split('\n');
  const seenImports = new Set();
  const uniqueLines = lines.filter(line => {
    if (line.startsWith('import')) {
      const lineWithSeparators = line.split(';');
      const newLine = lineWithSeparators[0] + ';';
      if (seenImports.has(newLine)) {
        return false;
      }
      seenImports.add(newLine);
    }
    return true;
  });
  console.log(seenImports);
  return uniqueLines.join('\n');
}

const processedContent = processFile(inputFilePath);
fs.writeFileSync(outputFilePath, processedContent, 'utf-8');
console.log(`Processed file saved to ${outputFilePath}`);