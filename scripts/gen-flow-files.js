const fs = require('fs');
const path = require('path');

// We need to generate flow files from the model files.

console.log('Reading model files...');
const modelFiles = fs.readdirSync(path.join(__dirname, '../src/models'));

console.log('Writing model files...');

for (let file of modelFiles) {
  const oldFile = path.join(__dirname, '../src/models', file);
  const newFile = path.join(__dirname, '../lib/models', `${file}.flow`);
  const buffer = fs.readFileSync(oldFile);
  fs.writeFileSync(newFile, buffer);
}
