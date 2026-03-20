import { db, collection, getDocs, query, where } from "./firebase-config.js";

async function verifyMemberIdentity() {
    const targetName = "정혜숙 (아네스)";
    console.log(`--- Verifying Identity for: ${targetName} ---`);

    // 1. users 컬렉션에서 찾기
    const userSnap = await getDocs(query(collection(db, 'users'), where('name', '==', targetName)));
    userSnap.forEach(doc => {
        const data = doc.data();
        console.log(`User Doc: ${doc.id}`);
        console.log(`- Role: ${data.role}`);
        console.log(`- MemberId: ${data.memberId}`); // Usually stores UID or link
    });

    // 2. officers_list에서 찾기
    const offSnap = await getDocs(query(collection(db, 'officers_list'), where('name', '==', targetName)));
    offSnap.forEach(doc => {
        const data = doc.data();
        console.log(`Officer List Doc: ${doc.id}`);
        console.log(`- Role: ${data.role}`);
        console.log(`- memberId field: ${data.memberId}`); // Should match UID
    });

    // 3. members_list에서 찾기
    const memSnap = await getDocs(query(collection(db, 'members_list'), where('name', '==', targetName)));
    memSnap.forEach(doc => {
        const data = doc.data();
        console.log(`Member List Doc: ${doc.id}`); // This should be UID
        console.log(`- Status: ${data.status}`);
    });
}

verifyMemberIdentity();
