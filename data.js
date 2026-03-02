
// Helper to get Presidia List from LocalStorage
function getStoredPresidia() {
    return JSON.parse(localStorage.getItem('presidia_list') || '[]');
}

// Helper to get Churches
// Helper to get Churches
export function getChurches() {
    const data = getStoredPresidia();
    // Unique Church Names (Handle both churchName and church fields, trim whitespace)
    const churches = data.map(p => (p.churchName || p.church || '').toString().trim()).filter(Boolean);
    // Remove placeholders and duplicates
    return [...new Set(churches.filter(c => c !== '성당 선택' && c !== ''))].sort();
}

// Helper to get Curiae for a Church
// Helper to get Curiae for a Church
export function getCuriae(churchName) {
    const data = getStoredPresidia();
    const targetChurch = (churchName || '').toString().trim();

    // Filter by Church, then get Unique Curia Names
    const curiae = data
        .filter(p => {
            const cName = (p.churchName || p.church || '').toString().trim();
            return cName === targetChurch;
        })
        .map(p => (p.curiaName || p.curia || '').toString().trim())
        .filter(Boolean);
    return [...new Set(curiae.filter(c => c !== '꾸리아 선택' && c !== ''))].sort();
}

// Helper to get Presidia for a Church AND Curia
// Helper to get Presidia for a Church AND Curia
export function getPresidia(churchName, curiaName) {
    const data = getStoredPresidia();
    const today = new Date().toISOString().split('T')[0];
    const targetChurch = (churchName || '').toString().trim();
    const targetCuria = (curiaName || '').toString().trim();

    return data
        .filter(p => {
            const cName = (p.churchName || p.church || '').toString().trim();
            const cuName = (p.curiaName || p.curia || '').toString().trim();
            const isMatch = cName === targetChurch && cuName === targetCuria;
            const isNotDissolved = !p.dissolutionDate || p.dissolutionDate > today;
            return isMatch && isNotDissolved;
        })
        .map(p => ({
            id: p.id,
            name: (p.presidiumName || p.name || p.presidium || '').toString().trim()
        }))
        .filter(p => p.name && p.name !== '쁘레시디움 선택')
        .sort((a, b) => a.name.localeCompare(b.name));
}
