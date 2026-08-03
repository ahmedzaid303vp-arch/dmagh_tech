// ==========================================
// تبديل الوضع الفاتح (Light Mode) فقط
// الموقع غامق افتراضيًا، والزرار ده بيفعّل وضع فاتح اختياري
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    const icon = toggleBtn.querySelector('i');

    function updateIcon() {
        const isLight = document.documentElement.classList.contains('light-mode');
        if (icon) {
            icon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
        }
        toggleBtn.title = isLight ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح';
    }

    updateIcon();

    toggleBtn.addEventListener('click', function () {
        document.documentElement.classList.toggle('light-mode');
        const isLight = document.documentElement.classList.contains('light-mode');
        localStorage.setItem('site-theme', isLight ? 'light' : 'dark');
        updateIcon();
    });
});
