import { getTasks, saveTasks, deleteTask } from './storage.js';
import { renderTasksGroupedByDate, formatDateTime, updateTaskCounts } from './render.js';
import { initModal, openModalWithData, getCurrentTaskId, clearCurrentTaskId } from './modal.js';
import { initFilters, applyFilters } from './filters.js';
import { showToast, showInstallToastOncePerDay } from './utils.js';
import { openCalendarModal, setupCalendarModal, renderCalendar, refreshAllCalendars } from './calendarModal.js';
import { initSpeechRecognition } from './speechRecognition.js';



import { mostrarPantallaLogin } from "./login.js";
import { getClaveTareas, cerrarSesion, getUsuarioActual } from "./usuarios.js";


window.cerrarSesion = () => cerrarSesion(mostrarPantallaLogin);



// === Función para cargar tareas ===
function cargarTareasUsuario() {
  const clave = getClaveTareas();
  const data = localStorage.getItem(clave);
  const tareas = data ? JSON.parse(data) : [];
  renderTasksGroupedByDate(tareas, undefined, undefined);
updateTaskCounts();
 // ← Reutiliza tu función actual
}

// === Función para guardar tareas ===
function guardarTareasUsuario(tareas) {
  const clave = getClaveTareas();
  localStorage.setItem(clave, JSON.stringify(tareas));
}





// 🛠 Inicializa tareas en pantalla
const tasks = getTasks();
renderTasksGroupedByDate(tasks, undefined, undefined);
updateTaskCounts();


document.addEventListener('DOMContentLoaded', () => {
  // Removed redundant call to mostrarPantallaLogin

  const tasks = getTasks();
  renderTasksGroupedByDate(tasks, undefined, undefined);
  updateTaskCounts();
  initModal('task-modal', 'task-form', 'btn-open', 'btn-cancel');

  const form = document.getElementById('task-form');
  const modal = document.getElementById('task-modal');

  let lastKnownTasks = getTasks();
  setInterval(() => {
    const updatedTasks = getTasks();
    const now = new Date().toISOString().split('T')[0];

    updatedTasks.forEach(task => {
      const oldTask = lastKnownTasks.find(t => t.id === task.id);
      if (!oldTask) return;

      const wasToday = oldTask.date === now;
      const isPast = task.date < now;

      if (wasToday && isPast) {
        showToast(`"${task.title}" pasó de hoy a vencida`, 'warning');
      }
    });
    lastKnownTasks = JSON.parse(JSON.stringify(updatedTasks)); // Clon profundo
  }, 60000);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskId = getCurrentTaskId();
    const tasks = getTasks();

    const task = {
      id: taskId || Date.now().toString(),
      title: document.getElementById('task-title').value.trim(),
      description: document.getElementById('task-desc').value.trim(),
      category: document.getElementById('task-category').value.trim(),
      priority: document.getElementById('task-priority').value,
      date: document.getElementById('task-date').value,
      time: document.getElementById('task-time').value,
      completed: false
    };

    const updatedTasks = taskId
      ? tasks.map(t => t.id === taskId ? task : t)
      : [...tasks, task];

    saveTasks(updatedTasks);
    renderTasksGroupedByDate(updatedTasks);
    updateTaskCounts();
    applyFilters();
    refreshAllCalendars();

    // ✅ Alerta toast
    showToast(
      `"${task.title}" ${taskId ? 'actualizada' : 'creada'}`,
      taskId ? 'info' : 'success'
    );

    form.reset();
    clearCurrentTaskId();
    modal.classList.add('hidden');
  });






  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-edit')) {
      const taskId = e.target.dataset.id;
      const task = getTasks().find(t => t.id === taskId);
      if (task) openModalWithData(task, 'task-modal', 'task-form');
    }
  });
  // Filtros
  initFilters(applyFilters);

  // Autoactualizar tareas cada minuto (solo si modal está cerrado)
  setInterval(() => {
    const modal = document.getElementById('task-modal');
    if (modal.classList.contains('hidden')) {
      const tasks = getTasks();
      renderTasksGroupedByDate(tasks);
      applyFilters();
    }
  }, 60000);



  document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');

      // Posición del click dentro del botón
      const rect = btn.getBoundingClientRect();
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;

      // Tamaño del ripple (opcional)
      ripple.style.width = ripple.style.height = Math.max(btn.offsetWidth, btn.offsetHeight) + 'px';

      // Agrega y elimina
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });







  function updateConnectionStatus() {
    const btn = document.getElementById('btn-open');
    const icon = document.getElementById('connection-status');

    if (navigator.onLine) {
      showToast("Conectado a Internet", "success");
      btn.classList.add('online');
      btn.classList.remove('offline');
      icon.textContent = '＋'; // ícono normal
      btn.title = "Nueva tarea (Conectado)";
    } else {
      showToast("Sin conexión a Internet", "danger");
      btn.classList.add('offline');
      btn.classList.remove('online');
      icon.textContent = '＋'; // o '✖', o mantener '＋'
      btn.title = "Sin conexión";
    }
  }



  // Detectar estado inicial
  window.addEventListener('load', updateConnectionStatus);

  // Detectar cambios de conexión
  window.addEventListener('online', updateConnectionStatus);
  window.addEventListener('offline', updateConnectionStatus);





  // copiar check box
  function getSelectedTaskTexts() {
    const checkboxes = document.querySelectorAll('.task-export-checkbox:checked');
    const tasks = getTasks();
    const selected = [];

    checkboxes.forEach(cb => {
      const id = cb.dataset.id;
      const task = tasks.find(t => t.id === id);
      if (task) {
        const text = `📌 ${task.title}\n📝 ${task.description || 'Sin descripción'}\n📅 ${formatDateTime(task.date, task.time)}\n📂 Categoría: ${task.category || 'Sin categoría'}\n🔴 Prioridad: ${task.priority}`;
        selected.push(text);
      }
    });

    return selected;
  }

  document.getElementById('btn-copy-selected')?.addEventListener('click', () => {
    const selectedTexts = getSelectedTaskTexts();
    if (selectedTexts.length === 0) {
      showToast('Selecciona al menos una tarea para copiar', 'warning');
      return;
    }

    const finalText = selectedTexts.join('\n\n');
    navigator.clipboard.writeText(finalText).then(() => {
      showToast('Tareas copiadas al portapapeles', 'success');
    }).catch(() => {
      showToast('No se pudo copiar', 'danger');
    });
  });

  document.getElementById('btn-share-selected')?.addEventListener('click', () => {
    const selectedTexts = getSelectedTaskTexts();
    if (selectedTexts.length === 0) {
      showToast('Selecciona al menos una tarea para compartir', 'warning');
      return;
    }

    const finalText = selectedTexts.join('\n\n');

    if (navigator.share) {
      navigator.share({ text: finalText }).catch(() => {
        showToast('Error al compartir', 'danger');
      });
    } else {
      showToast('Tu navegador no soporta compartir', 'warning');
    }
  });







  setupCalendarModal();

  document.getElementById('btn-calendar').addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      // Móvil: mostrar modal
      document.getElementById('calendar-modal').classList.remove('hidden');
      renderCalendar(new Date()); // ✅ solo 1 argumento
    } else {
      // Desktop: ya está visible a la derecha, solo actualizar
      renderCalendar(new Date()); // ✅ solo 1 argumento
    }
  });

  renderCalendar(new Date()); // ✅ OK
  renderCalendar(new Date(), '#aside-calendar-grid', '#aside-calendar-month-label');

  initSpeechRecognition('task-title', 'btn-speech-title');
  initSpeechRecognition('task-desc', 'btn-speech-desc');

  document.getElementById('btn-clear-title')?.addEventListener('click', () => {
    document.getElementById('task-title').value = '';
    document.getElementById('task-title').focus();
  });

  document.getElementById('btn-clear-desc')?.addEventListener('click', () => {
    document.getElementById('task-desc').value = '';
    document.getElementById('task-desc').focus();
  });







});


//SALUDO INICIAL
//window.addEventListener('load', () => {
//  const greetingEl = document.getElementById('splash-greeting');
//  const hour = new Date().getHours();
//  let greeting = '';
//
//  if (hour >= 5 && hour < 12) {
//    greeting = '¡Buenos días!';
//  } else if (hour >= 12 && hour < 18) {
//    greeting = '¡Buenas tardes!';
//  } else {
//    greeting = '¡Buenas noches!';
//  }
//
//  greetingEl.textContent = greeting;
//
//  // Opcional: remover splash después de animación
//  setTimeout(() => {
//    const splash = document.getElementById('splash-screen');
//    if (splash) splash.remove();
//  }, 4000); // duración total splash
//});



//Botón personalizado para instalar la app
window.deferredPrompt = null;

// Captura el evento de instalación
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  showInstallToastOncePerDay(); // Mostrar el toast personalizado
});

// Activar el botón oculto cuando se hace clic en el toast
document.addEventListener('DOMContentLoaded', () => {
  const installBtn = document.getElementById('btn-install');

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (window.deferredPrompt) {
        window.deferredPrompt.prompt();

        const { outcome } = await window.deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          console.log('✅ App instalada');
        } else {
          console.log('❌ Instalación cancelada');
        }

        window.deferredPrompt = null;
      }
    });
  }
});

















const textarea = document.getElementById('task-desc');
if (textarea) {
  const autoResize = (el) => {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  textarea.addEventListener('input', () => autoResize(textarea));
  autoResize(textarea); // ajuste inicial
}
