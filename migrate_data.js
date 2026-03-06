/**
 * Firebase Firestore Data Migration Script
 * This script reads data from backup_data.json and uploads it to Firestore.
 */

import { db } from './firebase-config.js';
import { collection, doc, setDoc, writeBatch } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function migrateData() {
    console.log("🚀 Starting migration...");

    try {
        const response = await fetch('./backup_data.json');
        const backupData = await response.json();

        const keys = Object.keys(backupData);
        console.log(`📦 Found ${keys.length} data categories to migrate.`);

        for (const key of keys) {
            let data = backupData[key];

            // Many values are stored as double-encoded JSON strings in the backup file
            try {
                if (typeof data === 'string' && (data.startsWith('[') || data.startsWith('{'))) {
                    data = JSON.parse(data);
                }
            } catch (e) {
                console.warn(`⚠️ Failed to parse JSON string for key: ${key}, uploading as raw string.`);
            }

            console.log(`📤 Uploading '${key}'...`);

            if (Array.isArray(data)) {
                // For arrays, we'll try to use 'id' as document ID if it exists, otherwise auto-ID is tricky with setDoc
                // Using a sub-collection approach: collection(db, key)
                const batchSize = 400; // Firestore batch limit is 500
                for (let i = 0; i < data.length; i += batchSize) {
                    const batch = writeBatch(db);
                    const chunk = data.slice(i, i + batchSize);

                    chunk.forEach((item, index) => {
                        const docId = item.id || item.uid || `item_${i + index}`;
                        const docRef = doc(collection(db, key), docId.toString());

                        // Ensure data is an object (Firestore requirement)
                        const dataToSet = (typeof item === 'object' && item !== null) ? item : { value: item };
                        batch.set(docRef, dataToSet);
                    });

                    await batch.commit();
                    console.log(`   ✅ Processed ${i + chunk.length}/${data.length} items for ${key}`);
                }
            } else if (typeof data === 'object' && data !== null) {
                // For objects, upload as a single document or multiple?
                // Given the app structure, these are likely global configs or single-item maps
                // We'll store them in a special 'app_data' collection or as-is
                await setDoc(doc(db, 'global_configs', key), data);
                console.log(`   ✅ Uploaded ${key} as a global config document.`);
            } else {
                // Primitive values
                await setDoc(doc(db, 'app_metadata', key), { value: data });
                console.log(`   ✅ Uploaded ${key} as metadata.`);
            }
        }

        console.log("🎉 Migration completed successfully!");
        alert("데이터 마이그레이션이 완료되었습니다! Firestore에서 확인해 주세요.");

    } catch (error) {
        console.error("❌ Migration failed:", error);
        alert("마이그레이션 중 오류가 발생했습니다: " + error.message);
    }
}

// Test function to check write permissions
async function testWrite() {
    console.log("🧪 testing Firestore write...");
    try {
        const testRef = doc(collection(db, 'test_collection'), 'test_doc');
        await setDoc(testRef, { timestamp: new Date().toISOString(), message: "Connection test" });
        console.log("✅ Test write successful! Permissions are OK.");
        return true;
    } catch (error) {
        console.error("❌ Test write failed:", error);
        return false;
    }
}

// Attach to window for easy access from console
window.migrateData = migrateData;
window.testWrite = testWrite;
console.log("💡 Type 'await testWrite()' to check permissions, or 'await migrateData()' to start.");
