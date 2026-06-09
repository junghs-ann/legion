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
    updateDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- Role Standardization (New) ---
export function convertToStdRole(role) {
    if (!role) return '단원';
    const r = String(role).toLowerCase().trim();
    
    // [강화] '전(임)', '역대', '퇴임' 등 과거 직책 키워드가 있으면 '단원'으로 간주
    const pastKeywords = ['전', '전임', '퇴임', '역대', 'past', 'former', 'ex-'];
    if (pastKeywords.some(k => r.includes(k))) return '단원';
    
    if (r.indexOf('단장') !== -1 && r.indexOf('부단장') === -1) return '단장';
    if (r.indexOf('president') !== -1 && r.indexOf('vice') === -1) return '단장';
    if (r.indexOf('leader') !== -1 || r.indexOf('head') !== -1) return '단장';
    
    if (r.indexOf('부단장') !== -1 || r.indexOf('vice') !== -1) return '부단장';
    if (r.indexOf('서기') !== -1 || r.indexOf('secretary') !== -1) return '서기';
    if (r.indexOf('회계') !== -1 || r.indexOf('treasurer') !== -1) return '회계';
    if (r.indexOf('관리자') !== -1 || r.indexOf('admin') !== -1) return '관리자';
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
        try {
            // 1. Firebase Auth 비밀번호 변경
            await firebaseUpdatePassword(user, newPassword);
            
            // 2. Firestore 프로필의 비밀번호 필드 동기화 (암호화하지 않는 시스템 특성 반영)
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, { password: newPassword });
            
            return true;
        } catch (error) {
            console.error("Firebase Password Update Error:", error);
            if (error.code === 'auth/requires-recent-login') {
                throw new Error("보안을 위해 다시 로그인한 직후에만 비밀번호 변경이 가능합니다. 로그아웃 후 다시 로그인하여 시도해 주세요.");
            }
            throw error;
        }
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
                // [시니어 개발자 패치] 30분 로컬 캐시를 이용한 오늘 날짜 기준 꾸리아 소속 동적 보정
                let curiaName = profile.curiaName || '';
                const todayStr = new Date().toISOString().split('T')[0];

                if (profile.presidiumName && profile.churchName) {
                    try {
                        const now = Date.now();
                        const cacheKey = `curiaCache_${user.uid}`;
                        const cachedDataStr = localStorage.getItem(cacheKey);
                        let useCache = false;

                        if (cachedDataStr) {
                            const cache = JSON.parse(cachedDataStr);
                            // 캐시된 쁘레시디움명이 현재와 같고, 만료시간(expiry)이 지나지 않았으면 캐시를 그대로 사용
                            if (cache.presidiumName === profile.presidiumName && cache.expiry > now) {
                                curiaName = cache.curiaName;
                                useCache = true;
                                console.log("[Auth Cache] Using cached curia:", curiaName);
                            }
                        }

                        if (!useCache) {
                            // 캐시가 없거나 만료된 경우 Firestore 조회 실행
                            // 1. presidia_list에서 쁘레시디움 고유 ID 조회
                            const prQuery = query(
                                collection(db, "presidia_list"),
                                where("churchName", "==", profile.churchName),
                                where("presidiumName", "==", profile.presidiumName)
                            );
                            const prSnap = await getDocs(prQuery);
                            if (!prSnap.empty) {
                                const prDoc = prSnap.docs[0];
                                const prId = prDoc.id;
                                const prData = prDoc.data();
                                
                                // 2. presidium_history에서 오늘 날짜에 소속되었던 역사 소속 조회
                                const histQuery = query(
                                    collection(db, "presidium_history"),
                                    where("presidiumId", "==", prId),
                                    where("startDate", "<=", todayStr),
                                    where("endDate", ">=", todayStr)
                                );
                                const histSnap = await getDocs(histQuery);
                                if (!histSnap.empty) {
                                    curiaName = histSnap.docs[0].data().curiaName || prData.curiaName || curiaName;
                                } else {
                                    curiaName = prData.curiaName || curiaName;
                                }

                                // 30분 유효 캐시 저장 (30분 = 30 * 60 * 1000 ms)
                                const expiry = now + (30 * 60 * 1000);
                                localStorage.setItem(cacheKey, JSON.stringify({
                                    curiaName: curiaName,
                                    presidiumName: profile.presidiumName,
                                    expiry: expiry
                                }));
                                console.log("[Auth Cache] Firestore loaded & cached curia:", curiaName);
                            }
                        }
                    } catch (err) {
                        console.error("[Auth] 동적 꾸리아 갱신 중 오류:", err);
                    }
                }

                // [V17.0] 표준 필드명 및 식별자(ID) 동기화 보강
                const standardizedProfile = {
                    ...profile,
                    uid: user.uid, // Auth UID 보존
                    churchName: profile.churchName || '',
                    presidiumName: profile.presidiumName || '',
                    curiaName: curiaName, // 동적으로 보정된 실시간 꾸리아명 적용
                    role: profile.role || 'member'
                };

                // [핵심] 단원 명부 ID(memberId)가 있으면 이를 기본 식별자(id)로 사용
                if (profile.memberId) {
                    standardizedProfile.id = profile.memberId;
                } else {
                    standardizedProfile.id = profile.id || user.uid;
                }
                
                localStorage.setItem('currentUser', JSON.stringify(standardizedProfile));
                onUserAuthenticated(user, standardizedProfile);
            } else {
                if (onUserNotAuthenticated) onUserNotAuthenticated();
            }
        } else {
            localStorage.removeItem('currentUser');
            // 캐시 데이터도 함께 제거하여 로그아웃 시 깔끔하게 청소
            for (let key in localStorage) {
                if (key.startsWith("curiaCache_")) {
                    localStorage.removeItem(key);
                }
            }
            if (onUserNotAuthenticated) onUserNotAuthenticated();
        }
    });
}
