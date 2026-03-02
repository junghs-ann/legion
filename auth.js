// --- Mock Auth System (LocalStorage Based) ---
// Firebase Auth has been replaced with this mock system for testing purposes.
// No external API keys are required.

// --- Register User (Mock) ---
export async function registerUser(email, password, userData) {
    console.log("Mock Register:", email, userData);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Save to localStorage to simulate DB
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    // Check for duplicate username/email among ACTIVE members
    const existingActive = Object.values(users).find(u => u.email === email && u.status === 'active');
    if (existingActive) {
        console.error("Signup Failed: Duplicate ID", email);
        throw new Error("이미 사용 중인 아이디입니다.");
    }

    // Create random UID
    const uid = 'user_' + Math.random().toString(36).substr(2, 9);

    // Role Logic: 15년 차 시위에서 승인 없이 즉시 활성화 (단원 명부 대조 후 가입하므로)
    const status = 'active';

    const newUser = {
        ...userData,
        uid: uid,
        email: email,
        password: password, // In real app, never store raw password!
        status: status,
        createdAt: new Date().toISOString()
    };

    try {
        // [IMPORTANT] Use UID as the KEY for history management
        users[uid] = newUser;
        localStorage.setItem('users', JSON.stringify(users));

        // Auto-login after register
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        console.log("User registered and logged in:", newUser);
        return { user: { uid: uid, email: email } };
    } catch (e) {
        console.error("Database Error (Mock):", e);
        throw new Error("데이터 저장 중 오류가 발생했습니다.");
    }
}

// --- Login User (Mock) ---
export async function loginUser(email, password) {
    console.log("Mock Login:", email);
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = JSON.parse(localStorage.getItem('users') || '{}');

    // Find candidate users (by email/username)
    // History management: Get the most recent active or latest record
    const candidates = Object.values(users)
        .filter(u => u.email === email && u.password === password)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (candidates.length === 0) {
        throw new Error("아이디 또는 비밀번호가 잘못되었습니다.");
    }

    // Prefer 'active' status if multiple records exist
    const user = candidates.find(u => u.status === 'active') || candidates[0];

    if (user.status === 'retire') {
        throw new Error("퇴단 처리된 계정입니다. 관리자에게 문의하세요.");
    }

    // Role Sync: 간부 명단과 대조하여 직책 자동 업데이트 (Robust Match)
    if (user.role !== 'admin') {
        const officers = JSON.parse(localStorage.getItem('officers_list') || '[]');
        const today = new Date().toISOString().split('T')[0];

        // 필터링 및 정렬: 활동 중인 기록 우선 및 최신 임명일 순
        const matchedOfficers = officers
            .filter(o =>
                o.name === user.name &&
                (o.churchName === user.church || o.church === user.church) &&
                (o.presidiumName === user.presidiumName || o.presidium === user.presidiumName)
            )
            .sort((a, b) => {
                const isActiveA = !a.appointmentExpiryDate || a.appointmentExpiryDate >= today;
                const isActiveB = !b.appointmentExpiryDate || b.appointmentExpiryDate >= today;
                if (isActiveA && !isActiveB) return -1;
                if (!isActiveA && isActiveB) return 1;
                return String(b.appointmentDate || '').localeCompare(String(a.appointmentDate || ''));
            });

        const officialRecord = matchedOfficers[0];

        if (officialRecord) {
            console.log("간부 직책 동기화 실행:", officialRecord.role);
            user.role = officialRecord.role;
            user.id = officialRecord.memberId; // [Identity Sync] 간부명단 ID 동기화
        } else {
            // [Identity Sync] 일반 단원 명단 대조
            const members = JSON.parse(localStorage.getItem('members_list') || '[]');
            const matchedMember = members.find(m =>
                m.name === user.name &&
                (m.churchName === user.church || m.church === user.church) &&
                (m.presidiumName === user.presidiumName || m.presidium === user.presidiumName)
            );
            if (matchedMember) {
                user.id = matchedMember.id; // [Identity Sync] 단원명단 ID 동기화
            }
        }

        // [IMPORTANT] Use UID as the KEY for history management
        users[user.uid] = user;
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Set fake session
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { uid: user.uid, email: user.email };
}

// --- Logout User (Mock) ---
export async function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = "index.html";
}

// --- Update Password (New) ---
export async function updatePassword(uid, newPassword) {
    console.log("Mock Password Update:", uid);
    await new Promise(resolve => setTimeout(resolve, 300)); // Delay

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[uid]) {
        throw new Error("사용자를 찾을 수 없습니다.");
    }

    // Update password
    users[uid].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    // If current user is the one being updated, sync session
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.uid === uid) {
        currentUser.password = newPassword;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    return true;
}

// --- Get User Profile (Mock) ---
export async function getUserProfile(uid) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    return users[uid] || null;
}

// --- Auth State Observer (Mock) ---
export function initAuthObserver(onUserAuthenticated, onUserNotAuthenticated) {
    // Check local storage for session
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        onUserAuthenticated({ uid: currentUser.uid, email: currentUser.email }, currentUser);
    } else {
        if (onUserNotAuthenticated) onUserNotAuthenticated();
    }
}

// --- Default Admin Seeder (For Mobile/Dev Convenience) ---
(function seedDefaultAdmin() {
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    // Check if admin exists in any form
    const adminExists = Object.values(users).some(u => u.email === 'admin');

    if (!adminExists) {
        const uid = 'admin_seed';
        const adminUser = {
            uid: uid,
            email: 'admin@legion.app',
            password: '1234',
            name: '관리자',
            role: 'admin',
            status: 'active',
            churchName: '본부',
            presidiumName: '직속',
            createdAt: new Date().toISOString()
        };
        users[uid] = adminUser;
        localStorage.setItem('users', JSON.stringify(users));
        console.log("Default admin account created: admin / 1234");
    }
})();
