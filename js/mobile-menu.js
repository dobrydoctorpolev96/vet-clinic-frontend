export function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.querySelector('.nav');
    if (!mobileMenuBtn || !nav)
        return;
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('show');
    });
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('show');
        });
    });
}
