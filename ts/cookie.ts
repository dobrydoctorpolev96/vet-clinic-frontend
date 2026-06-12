// Работа с cookie
export const CookieManager = {
  // Установить cookie
  set(name: string, value: string, days: number = 365): void {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
  },

  // Получить cookie
  get(name: string): string | null {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === name) return value;
    }
    return null;
  },

  // Проверить, есть ли согласие
  hasConsent(): boolean {
    return this.get('cookieConsent') === 'true';
  },

  // Сохранить согласие
  accept(): void {
    this.set('cookieConsent', 'true', 365);
  }
};

// Инициализация уведомления о cookie
export function initCookieNotice(): void {
  const cookieNotice = document.getElementById('cookieNotice');
  const cookieAgreeBtn = document.getElementById('cookieAgree');

  if (!cookieNotice) return;

  // Если согласие уже было — скрываем уведомление
  if (CookieManager.hasConsent()) {
    cookieNotice.classList.remove('show');
    return;
  }

  // Показываем уведомление
  setTimeout(() => {
    cookieNotice.classList.add('show');
  }, 500);

  // Обработчик кнопки "Принять"
  cookieAgreeBtn?.addEventListener('click', () => {
    CookieManager.accept();
    cookieNotice.classList.remove('show');
    console.log('Cookie согласие принято');
  });
}