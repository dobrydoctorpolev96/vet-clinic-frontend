import { initCookieNotice } from './cookie.js';
import { initModals } from './modals.js';
import { initMobileMenu } from './mobile-menu.js';
import { initServicesScroll } from './services-scroll.js';
import { initChat } from './chat.js';
document.addEventListener('DOMContentLoaded', () => {
    initCookieNotice();
    initModals();
    initMobileMenu();
    initServicesScroll();
    initChat();
    console.log('Сайт готов!');
});
