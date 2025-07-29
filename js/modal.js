let currentTaskId = null;

function ajustarAlturaTextarea() {
    const textarea = document.getElementById('task-desc');
    if (textarea) {
        // Agrega el listener solo una vez
        if (!textarea.dataset.listenerAdded) {
            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            });
            textarea.dataset.listenerAdded = 'true';
        }

        // Ajusta altura inicial
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
}


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

        setTimeout(ajustarAlturaTextarea, 50);

    };

    



    const closeModal = () => {
        modalBox.classList.remove('scale-100', 'opacity-100');
        modalBox.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            form.reset();
        }, 200);
    };

    // 🔽 Mueve esto aquí después de declarar closeModal
    const btnClose = modal.querySelector('#btn-close-modal');
    btnClose?.addEventListener('click', closeModal);

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

    // ✨ Auto-resize al abrir con datos
    setTimeout(ajustarAlturaTextarea, 100);


}

export function getCurrentTaskId() {
    return currentTaskId;
}

export function clearCurrentTaskId() {
    currentTaskId = null;
}
