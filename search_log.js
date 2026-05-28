const fs = require('fs');

const logPath = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\b9115066-eada-487a-9a57-a04da27a21f3\\.system_generated\\logs\\transcript.jsonl';

try {
    const data = fs.readFileSync(logPath, 'utf8');
    const lines = data.split('\n');
    const matches = [];
    
    lines.forEach((line, index) => {
        if (!line.trim()) return;
        try {
            const json = JSON.parse(line);
            const content = json.content || '';
            const text = JSON.stringify(content);
            const thinking = json.thinking || '';
            const fullText = text + ' ' + JSON.stringify(thinking);
            
            if (fullText.includes("장명주") || fullText.includes("성종식") || fullText.includes("하늘의 문")) {
                matches.push({ index, type: json.type, source: json.source, json });
            }
        } catch (e) {
            // ignore
        }
    });

    console.log(`🔍 총 매칭 횟수: ${matches.length}번`);
    
    // 최초 5개 매치만 출력하여 버퍼가 잘리지 않게 함
    const printCount = Math.min(matches.length, 5);
    for (let i = 0; i < printCount; i++) {
        const m = matches[i];
        console.log(`\n=== [최초 매치 #${i+1}] Line ${m.index} [Type ${m.type}] [Source ${m.source}] ===`);
        console.log("Content:", JSON.stringify(m.json.content, null, 2));
        if (m.json.thinking) {
            console.log("Thinking:", m.json.thinking);
        }
        console.log("==================================================");
    }
} catch (e) {
    console.error(e);
}
process.exit(0);




