
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('backup_data.json', 'utf8'));
const officers = JSON.parse(data.officers_list);
console.log(JSON.stringify(officers, null, 2));
