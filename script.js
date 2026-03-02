// === Global State for Unsaved Changes ===
window.isDirty = false;
window.setDirty = (dirty) => {
    window.isDirty = dirty;
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
    const handleNavigation = (e) => {
        if (window.isDirty) {
            if (!confirm('저장하지 않은 변경 사항이 있습니다. 이동하시겠습니까?')) {
                e.preventDefault();
                return false;
            }
            window.setDirty(false); // Reset if user confirms
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
            navMenu.classList.toggle('active');
        });

        // Mobile Submenu Accordion
        if (window.innerWidth <= 768) {
            navItems.forEach(item => {
                const link = item.querySelector('.nav-link');
                const subMenu = item.querySelector('.sub-menu');

                if (subMenu) {
                    link.addEventListener('click', (e) => {
                        // If it's just a toggle link (has '#' or no real href), prevent default
                        const href = link.getAttribute('href');
                        if (!href || href === '#') {
                            e.preventDefault();
                        }

                        // Close other open menus
                        navItems.forEach(otherItem => {
                            if (otherItem !== item) {
                                const otherSub = otherItem.querySelector('.sub-menu');
                                if (otherSub) otherSub.classList.remove('open');
                            }
                        });

                        subMenu.classList.toggle('open');
                    });
                }
            });
        }
    }
});

/**
 * [Common Navigation] 
 * "내 정보" 및 "로그아웃" 메뉴를 동적으로 추가하고 권한 처리를 통합합니다.
 * @param {Object} profile - 사용자 프로필 객체
 * @param {Function} logoutUser - auth.js의 로그아웃 함수
 */
// === Global Logout Handler ===
window.handleLogout = () => {
    if (window.isDirty) {
        if (!confirm('저장하지 않은 데이터가 있습니다. 로그아웃 하시겠습니까?')) return;
    }
    // auth.js의 logoutUser가 전역에 노출되지 않으므로, 
    // 실제 로그아웃 처리는 auth.js를 임포트한 곳에서 주입해주거나 직접 이동 처리
    localStorage.removeItem('currentUser');
    window.location.href = "index.html";
};

window.initCommonMenus = (profile, logoutUser) => {
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
