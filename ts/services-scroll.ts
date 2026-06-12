// Горизонтальная прокрутка услуг
export function initServicesScroll(): void {
  const scrollContainer = document.getElementById('servicesScrollContainer');
  const scrollLeftBtn = document.getElementById('scrollLeftBtn');
  const scrollRightBtn = document.getElementById('scrollRightBtn');

  if (!scrollContainer || !scrollLeftBtn || !scrollRightBtn) return;

  // Прокрутка влево
  scrollLeftBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({
      left: -280,
      behavior: 'smooth'
    });
  });

  // Прокрутка вправо
  scrollRightBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({
      left: 280,
      behavior: 'smooth'
    });
  });

  // Скрытие кнопок, если прокрутка не нужна
  const checkScrollButtons = () => {
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    if (maxScroll <= 0) {
      scrollLeftBtn.style.display = 'none';
      scrollRightBtn.style.display = 'none';
    } else {
      scrollLeftBtn.style.display = 'flex';
      scrollRightBtn.style.display = 'flex';
    }
  };

  checkScrollButtons();
  window.addEventListener('resize', checkScrollButtons);
}