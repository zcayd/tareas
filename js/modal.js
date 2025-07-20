let currentTaskId = null;

export function initModal(modalId, formId, openBtnId, cancelBtnId) {
    const modal = document.getElementById(modalId);
    const form = document.getElementById(formId);
    const btnOpen = document.getElementById(openBtnId);
    const btnCancel = document.getElementById(cancelBtnId);
    const modalBox = modal.querySelector('.modal-content');
    const modalTitle = modal.querySelector('#modal-title');
    const saveBtn = modal.querySelector('#btn-save');

    const openModal = () => {
        modal.classList.remove('hidden');
        modalBox.classList.remove('scale-95', 'opacity-0');
        modalBox.classList.add('scale-100', 'opacity-100');

        modalTitle.textContent = 'Nueva Tarea';
        saveBtn.textContent = 'Guardar';
    };

    const closeModal = () => {
        modalBox.classList.remove('scale-100', 'opacity-100');
        modalBox.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            form.reset();
        }, 200);
    };

    btnOpen?.addEventListener('click', openModal);
    btnCancel?.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

export function openModalWithData(task, modalId, formId) {
    const modal = document.getElementById(modalId);
    const form = document.getElementById(formId);
    const modalBox = modal.querySelector('.modal-content');
    const modalTitle = modal.querySelector('#modal-title');
    const saveBtn = modal.querySelector('#btn-save');

    modal.classList.remove('hidden');
    modalBox.classList.remove('scale-95', 'opacity-0');
    modalBox.classList.add('scale-100', 'opacity-100');

    document.getElementById('task-title').value = task.title;
    document.getElementById('task-desc').value = task.description || '';
    document.getElementById('task-category').value = task.category || '';
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-date').value = task.date;
    document.getElementById('task-time').value = task.time;

    // Cambiar título y botones
    modalTitle.textContent = 'Editar Tarea';
    saveBtn.textContent = 'Actualizar';

    currentTaskId = task.id;
}

export function getCurrentTaskId() {
    return currentTaskId;
}

export function clearCurrentTaskId() {
    currentTaskId = null;
}


