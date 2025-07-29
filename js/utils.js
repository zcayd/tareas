import { getTasks, saveTasks } from './storage.js';
import { renderTasksGroupedByDate } from './render.js';
import { updateTaskCounts } from './render.js';
import { refreshAllCalendars } from './calendarModal.js';

export function getPriorityColor(priority) {
  switch (priority) {
    case 'alta': return '#e74c3c';
    case 'media': return '#f39c12';
    case 'baja': return '#2ecc71';
    default: return '#bdc3c7';
  }
}

export function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icons = {
    success: `<img src="assets/icons/success.svg" alt="success" class="toast-icon-img">`,
    warning: `<img src="assets/icons/warning.svg" alt="warning" class="toast-icon-img">`,
    danger: `<img src="assets/icons/danger.svg" alt="danger" class="toast-icon-img">`,
    info: `<img src="assets/icons/info.svg" alt="info" class="toast-icon-img">`
  };

  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || ''}</span>
    <span class="toast-message">${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.style.position = 'fixed';
  container.style.top = '1rem';
  container.style.right = '1rem';
  container.style.zIndex = '10000';
  document.body.appendChild(container);
  return container;
}

export function showDeleteToast(task) {
  const toastContainer = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-black`;

  toast.innerHTML = `
    <div class="toast-header">
    <span class="toast-title"><button class="close-toast" title="Cerrar">❌</button><strong>"${task.title}"</strong></span>
    </div>
    <div class="toast-body">      
      <div class="toast-actions">
        <button class="btn-toast-confirm">Eliminar</button>
        <button class="btn-toast-cancel">Cancelar</button>
      </div>
    </div>
  `;

  toastContainer.appendChild(toast);

  // Evento: Confirmar eliminación
  toast.querySelector('.btn-toast-confirm').addEventListener('click', () => {
    const updatedTasks = getTasks().filter(t => t.id !== task.id);
    saveTasks(updatedTasks);
    renderTasksGroupedByDate(updatedTasks);
    updateTaskCounts();
    refreshAllCalendars();
    toast.remove();
    showToast(`"${task.title}" -Eliminada`, 'danger');
  });

  // Evento: Cancelar
  toast.querySelector('.btn-toast-cancel').addEventListener('click', () => {
    toast.remove();
  });

  // Evento: Cerrar manual con botón (×)
  toast.querySelector('.close-toast').addEventListener('click', () => {
    toast.remove();
  });

  // Auto eliminar después de cierto tiempo
  setTimeout(() => {
    toast.remove();
  }, 8000);


}







// Detecta si la app ya está instalada como PWA
function isPWAInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// Muestra toast de instalación solo 1 vez por día
export function showInstallToastOncePerDay() {
  if (isPWAInstalled() || !window.deferredPrompt) {
    console.log("PWA ya instalada o deferredPrompt no disponible");
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  const lastShown = localStorage.getItem('installToastShown');

  if (lastShown === today) return;
  localStorage.setItem('installToastShown', today);

  const toastContainer = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-info`;
  toast.innerHTML = `
    <span class="toast-message">¿Deseas instalar la app?</span>
    <button id="btn-install-toast" class="btn-toast-install" style="background: none; border: none;">📲 Instalar App</button>
    <button class="btn-toast-close" style="background: none; border: none;">❌</button>
  `;

  toastContainer.appendChild(toast);

  // 👉 Evento: Instalar app desde botón
  const installButton = toast.querySelector('#btn-install-toast');
  const hiddenInstallBtn = document.getElementById('btn-install');

  if (installButton && hiddenInstallBtn) {
    installButton.addEventListener('click', () => {
      hiddenInstallBtn.click();
      toast.remove();
    });
  }

  // 👉 Evento: Cerrar manualmente
  const closeBtn = toast.querySelector('.btn-toast-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      toast.remove();
    });
  }

  // 👉 Eliminación automática (respaldo)
  setTimeout(() => {
    console.log('Cerrando automáticamente el toast');
    toast.remove();
  }, 20000); // ← 20 segundos por ahora
}
