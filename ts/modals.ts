// Логика модальных окон
export function initModals(): void {
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close');
  const staffCards = document.querySelectorAll('.staff-card');
  const patientCards = document.querySelectorAll('.patient-card');
  const privacyLink = document.getElementById('privacyLink');

  // Функция открытия модалки
  function openModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
    }
  }

  // Функция закрытия модалки
  function closeModal(modal: Element): void {
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Восстанавливаем прокрутку
  }

  // Клик по карточке сотрудника
  staffCards.forEach(card => {
    card.addEventListener('click', () => {
      const modalId = card.getAttribute('data-modal');
      if (modalId) openModal(modalId);
    });
  });

  // Клик по карточке пациента (раздел "Пациентам")
  patientCards.forEach(card => {
    card.addEventListener('click', () => {
      const modalId = card.getAttribute('data-modal');
      if (modalId) openModal(modalId);
    });
  });

  // Клик по ссылке политики конфиденциальности
  privacyLink?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('privacyModal');
  });

  // Закрытие по кнопке "×"
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) closeModal(modal);
    });
  });

  // Закрытие по клику вне модалки
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Закрытие по клавише ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('show')) closeModal(modal);
      });
    }
  });
}