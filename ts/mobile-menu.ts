// Мобильное меню (бургер)
export function initMobileMenu(): void {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const nav = document.querySelector('.nav');

  if (!mobileMenuBtn || !nav) return;

  mobileMenuBtn.addEventListener('click', () => {
    nav.classList.toggle('show');
  });

  // Закрываем меню при клике на ссылку
  const navLinks = nav.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('show');
    });
  });
}