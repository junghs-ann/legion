
const admin = require('firebase-admin');

const serviceAccount = require('C:\\Users\\user\\Downloads\\legion-f319a-firebase-adminsdk-m8v8k-86f7b98f26.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function checkDualNameTags() {
  const collections = ['users', 'members_list', 'officers_list', 'attendance_list', 'council_attendance_list', 'events_list'];
  const legacyFields = ['church', 'curia', 'presidium', 'memberUid', 'member'];
  const newFields = ['churchName', 'curiaName', 'presidiumName', 'memberId'];

  const report = [];

  for (const collName of collections) {
    console.log(`Checking collection: ${collName}`);
    const snapshot = await db.collection(collName).get();
    let dualCount = 0;
    let legacyOnlyCount = 0;
    let missingNewCount = 0;
    let sampleDuals = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      const hasLegacy = legacyFields.some(f => data[f] !== undefined);
      const hasNew = newFields.some(f => data[f] !== undefined);

      let isDual = false;
      if ((data.church !== undefined && data.churchName !== undefined) ||
          (data.curia !== undefined && data.curiaName !== undefined) ||
          (data.presidium !== undefined && data.presidiumName !== undefined)) {
        isDual = true;
        dualCount++;
        if (sampleDuals.length < 3) sampleDuals.push({ id: doc.id, ...data });
      }

      if (hasLegacy && !hasNew) {
        legacyOnlyCount++;
      }

      if (collName === 'users' && data.role !== 'admin' && data.role !== '관리자') {
        if (!data.churchName || !data.curiaName || !data.presidiumName) {
            missingNewCount++;
        }
      }
    });

    report.push({
      collection: collName,
      total: snapshot.size,
      dualNameTags: dualCount,
      legacyOnly: legacyOnlyCount,
      missingNewFields: missingNewCount
    });

    if (sampleDuals.length > 0) {
        console.log(`Sample Duals for ${collName}:`, JSON.stringify(sampleDuals, null, 2));
    }
  }

  console.table(report);
}

checkDualNameTags().catch(console.error);
