import { initCookieNotice } from './cookie.js';
import { initModals } from './modals.js';
import { initMobileMenu } from './mobile-menu.js';
import { initServicesScroll } from './services-scroll.js';
import { initChat } from './chat.js';

// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  // Инициализация уведомления о cookie
  initCookieNotice();

  // Инициализация модальных окон
  initModals();

  // Инициализация мобильного меню
  initMobileMenu();

  // Инициализация прокрутки услуг
  initServicesScroll();

  // Инициализация чат-бота
  initChat();

  console.log('Сайт готов!');
});