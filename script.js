// === Version: 20260315_V16_CLEAN_DUAL ===
console.log("Legion Script Loaded: 20260315_V16_CLEAN_DUAL");

// === Global Custom Modal CSS Injection ===
// === Global Custom Modal & Toast CSS Injection ===
(function injectGlobalUI_CSS() {
    const css = `
        /* --- Modal Styles --- */
        .global-custom-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 20000;
            justify-content: center;
            align-items: center;
            padding: 20px;
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
            border-radius: 16px;
            max-width: 400px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            animation: modalPopUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes modalPopUp {
            from { transform: scale(0.85) translateY(30px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .global-custom-modal-header-line {
            height: 6px;
            width: 100%;
            background: linear-gradient(90deg, #2e7d32, #D4AF37);
        }
        .global-custom-modal-body {
            padding: 40px 30px 20px;
        }
        .global-custom-modal-icon {
            font-size: 3.5rem;
            margin-bottom: 20px;
            display: block;
        }
        .icon-success { color: #2e7d32; }
        .icon-error { color: #d32f2f; }
        .icon-warning { color: #ffa000; }
        .icon-info { color: #1976d2; }

        .global-custom-modal-message {
            margin-bottom: 25px;
            font-size: 1.15rem;
            color: #333;
            font-weight: 600;
            line-height: 1.5;
            word-break: keep-all;
        }
        .global-custom-modal-buttons {
            display: flex;
            justify-content: center;
            gap: 12px;
            padding: 0 30px 35px;
        }
        .global-custom-modal-btn {
            padding: 14px 24px;
            border-radius: 10px;
            border: none;
            cursor: pointer;
            font-weight: 700;
            font-size: 1rem;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            flex: 1;
        }
        .global-custom-modal-btn-confirm {
            background-color: #2e7d32;
            color: white;
            box-shadow: 0 4px 12px rgba(46, 125, 50, 0.2);
        }
        .global-custom-modal-btn-confirm:hover {
            background-color: #1b5e20;
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(46, 125, 50, 0.3);
        }
        .global-custom-modal-btn-cancel {
            background-color: #f5f5f5;
            color: #666;
            border: 1px solid #eee;
        }
        .global-custom-modal-btn-cancel:hover {
            background-color: #e0e0e0;
        }

        /* --- Toast Styles --- */
        .global-toast-container {
            position: fixed;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 21000;
            pointer-events: none;
            width: 90%;
            max-width: 400px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .global-toast {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: #333;
            padding: 15px 25px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 600;
            font-size: 1rem;
            border-left: 5px solid #2e7d32;
            animation: toastSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            opacity: 1;
            transition: all 0.3s ease;
        }
        .global-toast.toast-error { border-left-color: #d32f2f; }
        .global-toast.toast-warning { border-left-color: #ffa000; }
        .global-toast.toast-info { border-left-color: #1976d2; }
        
        .global-toast.hide {
            transform: translate(-50%, -100px);
            opacity: 0;
        }
        @keyframes toastSlideIn {
            from { transform: translateY(-30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();


// === Global UI Enhancement Functions ===

/**
 * [Senior Helper] Toast 알림 표시
 * @param {string} message 
 * @param {string} type - 'success', 'error', 'warning', 'info'
 */
window.showToast = function(message, type = 'success') {
    let container = document.getElementById('globalToastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'globalToastContainer';
        container.className = 'global-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `global-toast toast-${type}`;
    
    let iconClass = 'fa-check-circle icon-success';
    if (type === 'error') iconClass = 'fa-times-circle icon-error';
    else if (type === 'warning') iconClass = 'fa-exclamation-triangle icon-warning';
    else if (type === 'info') iconClass = 'fa-info-circle icon-info';

    toast.innerHTML = `
        <i class="fas ${iconClass}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

window.showGlobalAlert = function (message, type = 'info') {
    return new Promise((resolve) => {
        let modal = document.getElementById('globalCustomModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'globalCustomModal';
            modal.className = 'global-custom-modal';
            modal.innerHTML = `
                <div class="global-custom-modal-content">
                    <div class="global-custom-modal-header-line"></div>
                    <div class="global-custom-modal-body">
                        <i id="globalCustomModalIcon" class="fas global-custom-modal-icon"></i>
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
        const iconEl = document.getElementById('globalCustomModalIcon');
        const confirmBtn = document.getElementById('globalCustomModalConfirm');
        const cancelBtn = document.getElementById('globalCustomModalCancel');

        // Set Icon based on type
        iconEl.className = 'fas global-custom-modal-icon';
        if (type === 'success') {
            iconEl.classList.add('fa-check-circle', 'icon-success');
        } else if (type === 'error') {
            iconEl.classList.add('fa-exclamation-circle', 'icon-error');
        } else if (type === 'warning') {
            iconEl.classList.add('fa-exclamation-triangle', 'icon-warning');
        } else {
            iconEl.classList.add('fa-info-circle', 'icon-info');
        }

        msgEl.innerHTML = message.replace(/\n/g, '<br>');
        cancelBtn.style.display = 'none';
        modal.style.display = 'flex';
        document.body.classList.add('no-scroll');

        confirmBtn.onclick = () => {
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
            resolve();
        };
    });
};

window.showGlobalConfirm = function (message, type = 'warning') {
    return new Promise((resolve) => {
        let modal = document.getElementById('globalCustomModal');
        if (!modal) {
            // Re-use logic to create if not exists
            showGlobalAlert('');
            modal = document.getElementById('globalCustomModal');
        }

        const msgEl = document.getElementById('globalCustomModalMessage');
        const iconEl = document.getElementById('globalCustomModalIcon');
        const confirmBtn = document.getElementById('globalCustomModalConfirm');
        const cancelBtn = document.getElementById('globalCustomModalCancel');

        iconEl.className = 'fas global-custom-modal-icon';
        if (type === 'warning') iconEl.classList.add('fa-question-circle', 'icon-warning');
        else if (type === 'error') iconEl.classList.add('fa-trash-alt', 'icon-error');
        else iconEl.classList.add('fa-question-circle', 'icon-info');

        msgEl.innerHTML = message.replace(/\n/g, '<br>');
        cancelBtn.style.display = 'inline-block';
        modal.style.display = 'flex';
        document.body.classList.add('no-scroll');

        confirmBtn.onclick = () => {
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
            resolve(true);
        };
        cancelBtn.onclick = () => {
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
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
        const iconEl = document.getElementById('globalCustomModalIcon');
        const confirmBtn = document.getElementById('globalCustomModalConfirm');
        const cancelBtn = document.getElementById('globalCustomModalCancel');

        iconEl.className = 'fas fa-edit global-custom-modal-icon icon-info';

        // Input field injection
        msgEl.innerHTML = `<div>${message.replace(/\n/g, '<br>')}</div>
            <input type="text" id="globalCustomModalInput" 
            style="width: 100%; padding: 12px; margin-top: 15px; border: 2px solid #eee; border-radius: 8px; box-sizing: border-box; font-size: 1rem; text-align: center; outline: none; transition: border-color 0.2s;" 
            value="${defaultValue}" autocomplete="off">`;

        const inputEl = document.getElementById('globalCustomModalInput');
        inputEl.onfocus = () => inputEl.style.borderColor = '#2e7d32';
        inputEl.onblur = () => inputEl.style.borderColor = '#eee';

        cancelBtn.style.display = 'inline-block';
        modal.style.display = 'flex';
        document.body.classList.add('no-scroll');

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
        const targetUrl = e.currentTarget.href;
        if (!targetUrl || targetUrl === '#' || targetUrl.includes('javascript:void(0)')) return;

        if (window.isDirty) {
            e.preventDefault();
            await window.safeNavigate(targetUrl);
        }
    };

    // Attach to all navigation links
    document.querySelectorAll('.nav-menu a, .brand-logo, .sub-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            // 1. Unsaved changes check
            handleNavigation(e);

            // 2. [UX Improvement] Auto-close mobile menu on link click
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu && navMenu.classList.contains('active')) {
                // 서브메뉴가 있는 항목(부모)을 클릭했을 때는 닫지 않음
                if (e.currentTarget.parentElement.classList.contains('has-submenu') && (!e.currentTarget.href || e.currentTarget.href.endsWith('#'))) {
                    return;
                }
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

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
                
                // [시니어 개발자 패치] 관리자 서브메뉴에 '데이터 표준화 진단' 링크 동적 주입
                const subMenu = item.querySelector('.sub-menu');
                if (subMenu && isAdmin && !subMenu.querySelector('a[href*="diagnose_data"]')) {
                    const li = document.createElement('li');
                    li.innerHTML = '<a href="diagnose_data.html" style="color: #2e7d32; font-weight: bold; border-top: 1px solid #eee; margin-top: 5px; padding-top: 8px;">🔍 데이터 표준화 진단</a>';
                    subMenu.appendChild(li);
                }
                // 기존 데이터 일괄 정리가 있다면 유지하되 아래에 배치 (필요시)
                if (subMenu && isAdmin && !subMenu.querySelector('a[href*="data_cleanup"]')) {
                    const li = document.createElement('li');
                    li.innerHTML = '<a href="data_cleanup.html" style="color: #ef4444; font-size: 0.85rem;">⚠️ 데이터 일괄 정리(구)</a>';
                    subMenu.appendChild(li);
                }

                // [새 기능] 행사 종류 관리 메뉴 추가 (v16.88)
                if (subMenu && isAdmin && !subMenu.querySelector('a[href*="event_type_register"]')) {
                    const li = document.createElement('li');
                    li.innerHTML = '<a href="event_type_register.html" style="color: #6a1b9a; font-weight: bold; border-top: 1px solid #eee; margin-top: 5px; padding-top: 8px;">📋 행사 종류 관리</a>';
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

// === Password Toggle Logic ===
window.togglePassword = function(btn) {
    const targetId = btn.getAttribute('data-target');
    const input = document.getElementById(targetId);
    if (!input) return;

    const isPwd = input.type === 'password';
    input.type = isPwd ? 'text' : 'password';
    
    const icon = btn.querySelector('i');
    if (icon) {
        icon.className = isPwd ? 'fas fa-eye' : 'fas fa-eye-slash';
    }
};
