export const CookieManager = {
    set(name, value, days = 365) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
    },
    get(name) {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key === name)
                return value;
        }
        return null;
    },
    hasConsent() {
        return this.get('cookieConsent') === 'true';
    },
    accept() {
        this.set('cookieConsent', 'true', 365);
    }
};
export function initCookieNotice() {
    const cookieNotice = document.getElementById('cookieNotice');
    const cookieAgreeBtn = document.getElementById('cookieAgree');
    if (!cookieNotice)
        return;
    if (CookieManager.hasConsent()) {
        cookieNotice.classList.remove('show');
        return;
    }
    setTimeout(() => {
        cookieNotice.classList.add('show');
    }, 500);
    cookieAgreeBtn?.addEventListener('click', () => {
        CookieManager.accept();
        cookieNotice.classList.remove('show');
        console.log('Cookie согласие принято');
    });
}
