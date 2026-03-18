// === Version: 20260315_V16_CLEAN_DUAL ===
console.log("Legion Script Loaded: 20260315_V16_CLEAN_DUAL");

// === Global Custom Modal CSS Injection ===
(function injectGlobalModalCSS() {
    const css = `
        .global-custom-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            z-index: 20000; /* 헤더(10005)보다 높게 설정 */
            justify-content: center;
            align-items: flex-start; /* 가로보기/작은 화면 대응: 상단부터 표시 */
            overflow-y: auto;        /* 스크롤 허용 */
            padding: 40px 20px;     /* 상하 여백 확보 */
            font-family: 'Noto Sans KR', sans-serif;
            animation: modalFadeIn 0.3s ease;
        }
        @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .global-custom-modal-content {
            background-color: white;
            padding: 0;
            border-radius: 8px;
            max-width: 420px;
            width: 90%;
            text-align: center;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
            word-break: keep-all;
            line-height: 1.6;
            overflow: hidden;
            animation: modalSlideUp 0.3s ease;
            margin: 40px auto; /* 상하 여백 확보하여 제목 가림 방지 */
        }
        /* [시니어 팁] 모달이 화면보다 클 경우 margin-top: 0으로 강제 조정 */
        @media (max-height: 500px) {
            .global-custom-modal-content { margin-top: 20px; }
        }
        @keyframes modalSlideUp {
            from { transform: translateY(20px); }
            to { transform: translateY(0); }
        }
        .global-custom-modal-header {
            background-color: #2e7d32;
            height: 6px;
            width: 100%;
            border-bottom: 2px solid #D4AF37;
        }
        .global-custom-modal-body {
            padding: 30px 25px 20px;
        }
        .global-custom-modal-message {
            margin-bottom: 25px;
            font-size: 1.05rem;
            color: #222;
            font-weight: 500;
        }
        .global-custom-modal-buttons {
            display: flex;
            justify-content: center;
            gap: 12px;
            padding: 0 25px 25px;
        }
        .global-custom-modal-btn {
            padding: 12px 30px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-weight: 700;
            font-size: 0.95rem;
            transition: all 0.2s;
        }
        .global-custom-modal-btn-confirm {
            background-color: #2e7d32;
            color: white;
        }
        .global-custom-modal-btn-confirm:hover {
            background-color: #1b5e20;
            transform: translateY(-1px);
        }
        .global-custom-modal-btn-cancel {
            background-color: #f5f5f5;
            color: #666;
            border: 1px solid #ddd;
        }
        .global-custom-modal-btn-cancel:hover {
            background-color: #eee;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();

// === Global Custom Modal Implementation ===
window.showGlobalAlert = function (message) {
    return new Promise((resolve) => {
        let modal = document.getElementById('globalCustomModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'globalCustomModal';
            modal.className = 'global-custom-modal';
            modal.innerHTML = `
                <div class="global-custom-modal-content">
                    <div class="global-custom-modal-header"></div>
                    <div class="global-custom-modal-body">
                        <div id="globalCustomModalMessage" class="global-custom-modal-message"></div>
                    </div>
                    <div class="global-custom-modal-buttons">
                        <button id="globalCustomModalCancel" class="global-custom-modal-btn global-custom-modal-btn-cancel" style="display: none;">취소</button>
                        <button id="globalCustomModalConfirm" class="global-custom-modal-btn global-custom-modal-btn-confirm">확인</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        const msgEl = document.getElementById('globalCustomModalMessage');
        const confirmBtn = document.getElementById('globalCustomModalConfirm');
        const cancelBtn = document.getElementById('globalCustomModalCancel');

        msgEl.innerHTML = message.replace(/\n/g, '<br>');
        cancelBtn.style.display = 'none';
        modal.style.display = 'flex';

        confirmBtn.onclick = () => {
            modal.style.display = 'none';
            resolve();
        };
    });
};

window.showGlobalConfirm = function (message) {
    return new Promise((resolve) => {
        let modal = document.getElementById('globalCustomModal');
        if (!modal) {
            // Re-use logic to create if not exists
            showGlobalAlert('');
            modal = document.getElementById('globalCustomModal');
        }

        const msgEl = document.getElementById('globalCustomModalMessage');
        const confirmBtn = document.getElementById('globalCustomModalConfirm');
        const cancelBtn = document.getElementById('globalCustomModalCancel');

        msgEl.innerHTML = message.replace(/\n/g, '<br>');
        cancelBtn.style.display = 'inline-block';
        modal.style.display = 'flex';

        confirmBtn.onclick = () => {
            modal.style.display = 'none';
            resolve(true);
        };
        cancelBtn.onclick = () => {
            modal.style.display = 'none';
            resolve(false);
        };
    });
};

window.showGlobalPrompt = function (message, defaultValue = '') {
    return new Promise((resolve) => {
        let modal = document.getElementById('globalCustomModal');
        if (!modal) {
            showGlobalAlert('');
            modal = document.getElementById('globalCustomModal');
        }

        const msgEl = document.getElementById('globalCustomModalMessage');
        const confirmBtn = document.getElementById('globalCustomModalConfirm');
        const cancelBtn = document.getElementById('globalCustomModalCancel');

        // Input field injection
        msgEl.innerHTML = `<div>${message.replace(/\n/g, '<br>')}</div>
            <input type="text" id="globalCustomModalInput" 
            style="width: 100%; padding: 10px; margin-top: 15px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 1rem;" 
            value="${defaultValue}" autocomplete="off">`;

        cancelBtn.style.display = 'inline-block';
        modal.style.display = 'flex';

        const inputEl = document.getElementById('globalCustomModalInput');
        inputEl.focus();
        inputEl.select();

        // Handle Enter key
        const handleEnter = (e) => {
            if (e.key === 'Enter') {
                confirmBtn.click();
            }
        };
        inputEl.addEventListener('keydown', handleEnter);

        confirmBtn.onclick = () => {
            const result = inputEl.value;
            inputEl.removeEventListener('keydown', handleEnter);
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
            resolve(result);
        };
        cancelBtn.onclick = () => {
            inputEl.removeEventListener('keydown', handleEnter);
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
            resolve(null);
        };
    });
};
window.isDirty = false;
window.setDirty = (dirty) => {
    window.isDirty = dirty;
};

/**
 * [Common Navigation Helper]
 * 변경 사항이 있는 경우 확인창을 띄우고 안전하게 이동합니다.
 */
window.safeNavigate = async (url) => {
    if (window.isDirty) {
        if (await window.showGlobalConfirm('저장하지 않은 변경 사항이 있습니다. 이동하시겠습니까?')) {
            window.setDirty(false);
            window.location.href = url;
        }
    } else {
        window.location.href = url;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Current Page Check
    const isLoginPage = document.querySelector('.login-container');
    const isDashboard = document.querySelector('.dashboard-header');

    // === Navigation Protection ===
    window.addEventListener('beforeunload', (e) => {
        if (window.isDirty) {
            e.preventDefault();
            e.returnValue = ''; // Standard way to show "Unsaved changes" dialog
        }
    });

    // Intercept menu clicks to check for unsaved data
    const handleNavigation = async (e) => {
        if (window.isDirty) {
            e.preventDefault();
            const targetUrl = e.currentTarget.href;
            await window.safeNavigate(targetUrl);
            return false;
        }
    };

    // Attach to all navigation links
    document.querySelectorAll('.nav-menu a, .brand-logo, .sub-menu a').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // === Login Page Logic ===
    // [Removed] Redundant login listener that was conflicting with auth.js

    // === Dashboard Logic ===
    if (isDashboard) {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navItems = document.querySelectorAll('.nav-item');

        // Mobile Menu Toggle
        menuToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            // Toggle body scroll
            if (isActive) {
                document.body.classList.add('no-scroll');
            } else {
                document.body.classList.remove('no-scroll');
            }
        });

        // Click-based Accordion Logic (Shared for Desktop & Mobile)
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            const subMenu = item.querySelector('.sub-menu');

            if (subMenu) {
                item.classList.add('has-submenu'); // 화살표 표시를 위한 클래스 추가
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (!href || href === '#' || subMenu) {
                        e.preventDefault(); // Submenu nodes are toggles
                    }

                    const isOpen = item.classList.contains('active-menu');
                    console.log(`[Menu] Toggle -> ${link.innerText.trim()}, Current Status: ${isOpen ? 'Open' : 'Closed'}`);

                    // 1. Close ALL other menus (Auto-close logic)
                    navItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active-menu');
                        }
                    });

                    // 2. Toggle current menu
                    if (isOpen) {
                        item.classList.remove('active-menu');
                    } else {
                        item.classList.add('active-menu');
                    }
                    
                    // Stop propagation to prevent document click from immediately closing it
                    e.stopPropagation();
                });
            }
        });

        // Close menu if clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navItems.forEach(item => item.classList.remove('active-menu'));
                if (window.innerWidth <= 1024) {
                    navMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            }
        });
    }
});

/**
 * [Common Navigation] 
 * "내 정보" 및 "로그아웃" 메뉴를 동적으로 추가하고 권한 처리를 통합합니다.
 * @param {Object} profile - 사용자 프로필 객체
 * @param {Function} logoutUser - auth.js의 로그아웃 함수
 */
// === Global Logout Handler ===
window.handleLogout = async () => {
    if (window.isDirty) {
        if (!(await window.showGlobalConfirm('저장하지 않은 데이터가 있습니다. 로그아웃 하시겠습니까?'))) return;
    }

    // Firebase 로그아웃 기능이 등록되어 있다면 호출, 아니면 로컬 정리만 수행
    if (typeof window.firebaseLogout === 'function') {
        await window.firebaseLogout();
    } else {
        localStorage.removeItem('currentUser');
        window.location.href = "index.html";
    }
};

// [Removed] Emergency Force Refresh Function - System is now fully Firestore-based.

// [Removed] Auto Data Initialization - System is now fully Firestore-based.

// Removed old definition
// (Cleared legacy block)

// === End of Global Initialization ===


// [시니어 패치] 데이터 입력 정화 함수 (줄바꿈/유령 공백 원천 차단)
window.sanitizeInput = (val) => {
    if (typeof val !== 'string') return val;
    // 줄바꿈, 탭을 공백으로 바꾸고 연속된 공백을 하나로 합친 뒤 앞뒤 공백 제거
    return val.replace(/[\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
};

window.initCommonMenus = (profile, logoutUser) => {
    // Firebase 로그아웃 함수를 전역 핸들러에서 쓸 수 있게 등록
    if (typeof logoutUser === 'function') {
        window.firebaseLogout = logoutUser;
    }

    // 약간의 지연을 주어 DOM 상태가 안정된 후 실행
    setTimeout(() => {
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu) return;

        // 1. 기존 동적 메뉴 아이템 삭제 (중복 방지)
        navMenu.querySelectorAll('.injected-nav-item, .dynamic-menu-item, .common-menu-item').forEach(el => el.remove());

        // 2. 관리자 메뉴 권한 제어
        const isAdmin = (profile && (profile.role || '')).toLowerCase().includes('admin') || (profile && (profile.role || '')).includes('관리자');
        const resourcesMenu = document.getElementById('menu-resources');
        if (resourcesMenu) {
            resourcesMenu.style.setProperty('display', isAdmin ? 'block' : 'none', 'important');
        }
        navMenu.querySelectorAll('.nav-item').forEach(item => {
            if (item.textContent.includes('관리자')) {
                item.style.setProperty('display', isAdmin ? 'block' : 'none', 'important');
                
                // [시니어 개발자 패치] 관리자 서브메뉴에 '데이터 일괄 정리' 링크 동적 주입
                const subMenu = item.querySelector('.sub-menu');
                if (subMenu && isAdmin && !subMenu.querySelector('a[href*="data_cleanup"]')) {
                    const li = document.createElement('li');
                    li.innerHTML = '<a href="data_cleanup.html" style="color: #ef4444; font-weight: bold;">⚠️ 데이터 일괄 정리</a>';
                    subMenu.appendChild(li);
                }
            }
        });

        // 3. 정적 로그아웃 버튼 (대시보드 등)
        const staticLogout = document.getElementById('static-logout-btn');
        if (staticLogout) {
            staticLogout.onclick = window.handleLogout;
        }

        // 4. "내 정보" 추가 (중복 체크 후 삽입)
        if (!navMenu.querySelector('a[href*="my_page"]')) {
            const li = document.createElement('li');
            li.className = 'nav-item injected-nav-item';
            li.innerHTML = '<a href="my_page.html" class="nav-link"><i class="fas fa-user-circle"></i> 내 정보</a>';
            li.style.setProperty('display', 'block', 'important');
            navMenu.appendChild(li);
        }

        // 5. "로그아웃" 추가
        const hasLogoutLink = Array.from(navMenu.querySelectorAll('.nav-link')).some(el => el.textContent.includes('로그아웃'));
        if (!staticLogout && !hasLogoutLink) {
            const li = document.createElement('li');
            li.className = 'nav-item injected-nav-item';
            li.innerHTML = '<span class="nav-link" style="cursor:pointer;" onclick="window.handleLogout()"><i class="fas fa-sign-out-alt"></i> 로그아웃</span>';
            li.style.setProperty('display', 'block', 'important');
            navMenu.appendChild(li);
        }
        console.log("Common menus initialized (vFinal with Global Handler).");
    }, 50);
};
