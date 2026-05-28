const fs = require('fs');

const content = fs.readFileSync('d:/jhs/legion/member_status.html', 'utf8');
const lines = content.split('\n');

console.log("Searching for 'presidiumInput' or 'presidiumDropdown' in member_status.html:");
lines.forEach((line, idx) => {
    if (line.toLowerCase().includes('presidiuminput') || line.toLowerCase().includes('presidiumdropdown')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
