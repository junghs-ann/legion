const fs = require('fs');
try {
    const backup = JSON.parse(fs.readFileSync('backup_data.json', 'utf8'));
    const members = JSON.parse(backup.members_list);
    const results = members.filter(m => m.name === '이미희' || m.name === 'dlalgl');
    console.log(JSON.stringify(results, null, 2));
} catch (e) {
    console.error(e);
}
