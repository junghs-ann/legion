
import { db, doc, getDoc, updateDoc, deleteField } from "./firebase-config.js";

async function migrate() {
    const userId = "jhs0121";
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    
    if (snap.exists()) {
        const data = snap.data();
        console.log("Current data:", JSON.stringify(data, null, 2));
        
        const updates = {};
        // 1. 새로운 필드명으로 데이터 복사
        if (data.church && !data.churchName) updates.churchName = data.church;
        if (data.presidium && !data.presidiumName) updates.presidiumName = data.presidium;
        
        // 2. 만약 이미 새로운 필드명이 있고 데이터가 같다면 업데이트 준비 완료
        
        // 3. 레거시 필드 삭제 (강제)
        updates.church = deleteField();
        updates.presidium = deleteField();
        
        console.log("Applying updates:", JSON.stringify(updates, null, 2));
        await updateDoc(userRef, updates);
        console.log("Migration successful for", userId);
    } else {
        console.log("User not found:", userId);
    }
    process.exit(0);
}

migrate();
