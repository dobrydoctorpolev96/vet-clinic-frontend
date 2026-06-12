export function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    const staffCards = document.querySelectorAll('.staff-card');
    const patientCards = document.querySelectorAll('.patient-card');
    const privacyLink = document.getElementById('privacyLink');
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }
    function closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    staffCards.forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.getAttribute('data-modal');
            if (modalId)
                openModal(modalId);
        });
    });
    patientCards.forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.getAttribute('data-modal');
            if (modalId)
                openModal(modalId);
        });
    });
    privacyLink?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('privacyModal');
    });
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal)
                closeModal(modal);
        });
    });
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal)
                closeModal(modal);
        });
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('show'))
                    closeModal(modal);
            });
        }
    });
}
