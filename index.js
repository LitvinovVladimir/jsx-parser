const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const inputFilePath = path.join(__dirname, 'input.jsx');
const outputFilePath = path.join(__dirname, 'output.js');

function readAndTransformFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, code) => {
      if (err) return reject(err);

      babel.transform(code, {
        presets: ['@babel/preset-react', '@babel/preset-env']
      }, (err, result) => {
        if (err) return reject(err);
        resolve(result.code);
      });
    });
  });
}

async function bundleFile(entryFile) {
  const filesToProcess = [entryFile];
  const processedFiles = new Map();
  let bundledCode = '';

  while (filesToProcess.length > 0) {
    const currentFile = filesToProcess.pop();
    if (processedFiles.has(currentFile)) continue;

    const code = await readAndTransformFile(currentFile);
    let transformedCode = code;

    // Простая обработка импортов
    const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
    let match;
    while ((match = importRegex.exec(code)) !== null) {
      const importedFilePath = path.resolve(path.dirname(currentFile), match[1]);
      filesToProcess.push(importedFilePath + '.js'); // Предполагаем, что импортируемый файл имеет расширение .js
      transformedCode = transformedCode.replace(match[0], `// ${match[0]}`);
    }

    // Простая обработка экспорта
    const exportRegex = /export\s+(default\s+)?(const|let|var|class|function|{)/g;
    transformedCode = transformedCode.replace(exportRegex, '/* export */ $2');

    processedFiles.set(currentFile, transformedCode);
  }

  // Объединение всех файлов в один
  for (const [file, code] of processedFiles) {
    bundledCode += `\n\n// ${file}\n${code}`;
  }

  let finalCode = `
          const _react = window.React;
          const _client = window.ReactDOM;
          const _logo = {};
          ${bundledCode.replace('var _react = _interopRequireDefault(require("react"));\n' +
      'var _client = _interopRequireDefault(require("react-dom/client"));\n' +
      'require("./index.css");\n' +
      'var _logo = _interopRequireDefault(require("./logo.svg"));\n' +
      'require("./App.css");\n' +
      'function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }\n', '')}
        `;
  finalCode = finalCode.replace(/\["default"\]/g, '');
  return finalCode;
}

bundleFile(inputFilePath)
    .then(bundledCode => {
      fs.writeFile(outputFilePath, bundledCode, err => {
        if (err) {
          console.error('Ошибка при записи файла:', err);
          return;
        }
        console.log('Файл успешно преобразован и сохранен как output.js');
      });
    })
    .catch(err => {
      console.error('Ошибка при бандлинге файлов:', err);
    });