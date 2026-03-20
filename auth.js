import { auth, db } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updatePassword as firebaseUpdatePassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    doc,
    setDoc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- Role Standardization (New) ---
export function convertToStdRole(role) {
    if (!role) return '단원';
    const r = String(role).toLowerCase().trim();
    if (r.includes('단장') && !r.includes('부단장')) return '단장';
    if (r.includes('president') && !r.includes('vice')) return '단장';
    if (r.includes('부단장') || r.includes('vice')) return '부단장';
    if (r.includes('서기') || r.includes('secretary')) return '서기';
    if (r.includes('회계') || r.includes('treasurer')) return '회계';
    if (r.includes('관리자') || r.includes('admin')) return '관리자';
    return '단원';
}

// --- Register User (Firebase) ---
export async function registerUser(email, password, userData) {
    console.log("Firebase Register:", email);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const newUser = {
            ...userData,
            uid: user.uid,
            email: email,
            status: 'active',
            createdAt: new Date().toISOString()
        };

        // Save profile to Firestore
        await setDoc(doc(db, "users", user.uid), newUser);

        // Session Sync (Local storage still used for fast access)
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return userCredential;
    } catch (error) {
        console.error("Firebase Register Error:", error);
        if (error.code === 'auth/email-already-in-use') throw new Error("이미 사용 중인 아이디입니다.");
        throw error;
    }
}

// --- Login User (Firebase) ---
export async function loginUser(email, password) {
    console.log("Firebase Login:", email);
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get profile from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
            throw new Error("사용자 정보를 찾을 수 없습니다.");
        }

        const profile = userDoc.data();
        if (profile.status === 'retire') {
            await signOut(auth);
            throw new Error("퇴단 처리된 계정입니다. 관리자에게 문의하세요.");
        }

        // Role Sync - Roles are now managed directly in Firestore.

        localStorage.setItem('currentUser', JSON.stringify(profile));
        return user;
    } catch (error) {
        console.error("Firebase Login Error:", error);
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            throw new Error("아이디 또는 비밀번호가 잘못되었습니다.");
        }
        throw error;
    }
}

// --- Logout User (Firebase) ---
export async function logoutUser() {
    await signOut(auth);
    localStorage.removeItem('currentUser');
    window.location.href = "index.html";
}

// --- Update Password (Firebase) ---
export async function updatePassword(uid, newPassword) {
    const user = auth.currentUser;
    if (user && user.uid === uid) {
        await firebaseUpdatePassword(user, newPassword);
        return true;
    }
    throw new Error("비밀번호 변경 권한이 없거나 다시 로그인해야 합니다.");
}

// --- Get User Profile (Firebase) ---
export async function getUserProfile(uid) {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? userDoc.data() : null;
}

// --- Update User Profile (Firebase) ---
export async function updateUserProfile(uid, data) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data);
    
    // 세션 동기화 (로컬 캐시 업데이트)
    const current = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (current.uid === uid) {
        const updated = { ...current, ...data };
        localStorage.setItem('currentUser', JSON.stringify(updated));
    }
    return true;
}

// --- Auth State Observer (Firebase) ---
export function initAuthObserver(onUserAuthenticated, onUserNotAuthenticated) {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Get most recent profile from Firestore
            const profile = await getUserProfile(user.uid);
            if (profile) {
                // 표준 필드명만 사용 (구 필드명 제거)
                const standardizedProfile = {
                    ...profile,
                    churchName: profile.churchName || '',
                    presidiumName: profile.presidiumName || '',
                    curiaName: profile.curiaName || '',
                    role: profile.role || 'member'
                };
                // Assuming onAuthChanged is a new callback or a typo for onUserAuthenticated
                // If onAuthChanged is not defined elsewhere, this line might cause an error.
                // For now, I'm adding it as per the instruction.
                // onAuthChanged(user, standardizedProfile); 
                
                localStorage.setItem('currentUser', JSON.stringify(standardizedProfile));
                onUserAuthenticated(user, standardizedProfile);
            } else {
                if (onUserNotAuthenticated) onUserNotAuthenticated();
            }
        } else {
            localStorage.removeItem('currentUser');
            if (onUserNotAuthenticated) onUserNotAuthenticated();
        }
    });
}
