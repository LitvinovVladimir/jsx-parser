const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const inputFilePath = path.join(__dirname, 'input.jsx');
const outputFilePath = path.join(__dirname, 'output.js');

fs.readFile(inputFilePath, 'utf8', (err, jsxCode) => {
  if (err) {
    console.error('Ошибка при чтении файла:', err);
    return;
  }

  babel.transform(jsxCode, {
    presets: ['@babel/preset-react']
  }, (err, result) => {
    if (err) {
      console.error('Ошибка при трансформации кода:', err);
      return;
    }

    // Добавляем объявление глобальных переменных React и ReactDOM
    const finalCode = `
          const React = window.React;
          const ReactDOM = window.ReactDOM;
          ${result.code.replace(/const ReactDOM = require\('react-dom'\);/, '')}
        `;

    fs.writeFile(outputFilePath, finalCode, err => {
      if (err) {
        console.error('Ошибка при записи файла:', err);
        return;
      }
      console.log('Файл успешно преобразован и сохранен как output.js');
    });
  });
});
    