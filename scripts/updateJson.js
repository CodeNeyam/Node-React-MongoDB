const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const JSON_FILE_PATH = path.join(__dirname, '..', 'src', 'vms2.json');

async function updateJson() {
  try {
    const response = await fetch('http://localhost:3000/vms/api3/packages');
    const data = await response.json();
    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(data, null, 2));
    console.log('JSON file updated successfully.');
  } catch (error) {
    console.error('Error updating JSON file:', error);
  }
}

updateJson();
