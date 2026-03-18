
import { db, doc, setDoc } from "./firebase-config.js";

async function fix() {
    const data = {
        name: "정혜숙",
        churchName: "관평동 성당",
        presidiumName: "천사의 모후",
        role: "단장",
        updatedAt: new Date().toISOString()
    };
    await setDoc(doc(db, "users", "jhs0121"), data, { merge: true });
    console.log("jhs0121 Profile Fixed with presidiumName");
    process.exit(0);
}

fix();
