import { getTasks, saveTasks, deleteTask } from './storage.js';
import { showToast, showDeleteToast } from './utils.js';
import { openModalWithData } from './modal.js';
import { filterTasksByMonth } from './calendarMonthFilter.js';


export function renderTasksGroupedByDate(tasks, year, month) {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

  if (year !== undefined && month !== undefined) {
    tasks = filterTasksByMonth(tasks, year, month);
  }

  if (tasks.length === 0) {
    taskList.innerHTML = '<p>No hay tareas aún.</p>';
    return;
  }

  const grouped = tasks.reduce((acc, task) => {
    const date = task.date || 'Sin fecha 💤';
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => {
    if (a === 'Sin fecha 💤') return 1;
    if (b === 'Sin fecha 💤') return -1;
    return getEarliestDateTime(grouped[a]) - getEarliestDateTime(grouped[b]);
  });

  sortedDates.forEach(date => {
    const dateGroup = document.createElement('div');
    const firstTask = grouped[date][0];
    const status = getDateGroupStatus(date, firstTask.time || '00:00');

    dateGroup.className = `task-date-group ${status}`;

    const title = document.createElement('h3');
    title.textContent = formatDate(date);
    dateGroup.appendChild(title);

    grouped[date].sort((a, b) => {
      const timeA = a.time || '00:00';
      const timeB = b.time || '00:00';
      return timeA.localeCompare(timeB);
    });

    grouped[date].forEach(task => {
      const template = document.getElementById('task-template');
      const clone = template.content.cloneNode(true);
      const li = clone.querySelector('li');
      li.classList.add(`priority-${task.priority}`, `border-priority-${task.priority}`);
      if (task.completed) li.classList.add('completed');
      li.dataset.id = task.id;
      li.dataset.category = (task.category || 'sin categoría').toLowerCase();


      const topRow = document.createElement('div');
      topRow.classList.add('task-top-row');

      // NUEVO: contenedor para el lado izquierdo
      const leftSide = document.createElement('div');
      leftSide.classList.add('task-left');


      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('task-export-checkbox');
      checkbox.dataset.id = task.id;
      checkbox.name = `task-${task.id}`;


      // Título y hora
      const titleContainer = document.createElement('div');
      titleContainer.classList.add('task-title-container');

      const titleSpan = document.createElement('span');
      titleSpan.classList.add('task-title-inline');
      titleSpan.textContent = task.title;

      titleContainer.appendChild(titleSpan);

      if (task.time) {
        const timeSpan = document.createElement('span');
        timeSpan.classList.add('task-time-inline');
        timeSpan.textContent = `- ${convertirHoraAMPM(task.time)}`;
        titleContainer.appendChild(timeSpan);
      }




      // Estructura izquierda: [checkbox] [título + hora]
      leftSide.appendChild(checkbox);
      leftSide.appendChild(titleContainer);

      // Botón de estado a la derecha
      const completeBtn = document.createElement('button');
      completeBtn.classList.add('btn-complete');
      if (task.completed) {
        completeBtn.innerHTML = '✅';
        completeBtn.classList.add('done');
      } else {
        completeBtn.innerHTML = '❌';
        completeBtn.classList.add('pending');
      }
      completeBtn.addEventListener('click', () => {
        task.completed = !task.completed;
        const updated = getTasks().map(t => t.id === task.id ? task : t);
        saveTasks(updated);
        renderTasksGroupedByDate(updated);
        updateTaskCounts();
        showToast(`"${task.title}" - ${task.completed ? 'Completada' : 'Pendiente'}`,
          task.completed ? 'success' : 'info');
      });

      // Armar fila final
      topRow.appendChild(leftSide);
      topRow.appendChild(completeBtn);
      li.appendChild(topRow);


      if (task.description) {
        const desc = document.createElement('div');
        desc.classList.add('task-desc');
        desc.textContent = task.description;
        li.appendChild(desc);
      }


      const meta = document.createElement('div');
      meta.classList.add('task-meta');
      meta.innerHTML = `
        <span class="meta-priority ${task.priority.toLowerCase()}">${capitalize(task.priority)}</span>
        <span class="meta-category ${task.category?.toLowerCase() || 'sin-categoria'}">${capitalize(task.category || 'Sin categoría')}</span>
      `;
      li.appendChild(meta);




      const buttonRow = document.createElement('div');
      buttonRow.classList.add('task-action-row');

      const copyBtn = document.createElement('button');
      copyBtn.innerHTML = '<img src="./assets/icons/copy.svg" alt="Copiar" class="icon">';

      copyBtn.classList.add('btn-copy');
      copyBtn.addEventListener('click', () => {
        const text = `📌 ${task.title}\n📝 ${task.description || 'Sin descripción'}\n📅 ${formatDateTime(task.date, task.time)}\n📂 Categoría: ${task.category || 'Sin categoría'}\n⚠️ Prioridad: ${task.priority}`;
        navigator.clipboard.writeText(text).then(() => {
          showToast('Tarea copiada al portapapeles', 'info');
        }).catch(() => {
          showToast('No se pudo copiar la tarea', 'danger');
        });
      });

      const shareBtn = document.createElement('button');
      shareBtn.innerHTML = '<img src="./assets/icons/share.svg" alt="Compartir" class="icon">';
      shareBtn.classList.add('btn-share');
      shareBtn.addEventListener('click', () => {
        const shareData = {
          text: `📌 ${task.title}\n📝 ${task.description || 'Sin descripción'}\n📅 ${formatDateTime(task.date, task.time)}\n📂 Categoría: ${task.category || 'Sin categoría'}\n⚠️ Prioridad: ${task.priority}`
        };
        if (navigator.share) {
          navigator.share(shareData).catch(err => {
            console.error('Error al compartir:', err);
            showToast('Error al compartir', 'danger');
          });
        } else {
          showToast('Tu navegador no soporta compartir', 'warning');
        }
      });

      const editBtn = document.createElement('button');
      editBtn.className = 'btn-edit';
      editBtn.dataset.id = task.id;
      editBtn.innerHTML = `<img src="assets/icons/edit.png" alt="Editar" class="icon-btn">`;



      const deleteBtn = clone.querySelector('.btn-delete-inline');
      deleteBtn.innerHTML = '<img src="./assets/icons/trash.svg" alt="Eliminar" class="icon">';
      deleteBtn.addEventListener('click', () => {
        showDeleteToast(task);
      });

      buttonRow.appendChild(copyBtn);
      buttonRow.appendChild(shareBtn);
      buttonRow.appendChild(editBtn);
      buttonRow.appendChild(deleteBtn);
      li.appendChild(buttonRow);

      dateGroup.appendChild(clone);
    });

    taskList.appendChild(dateGroup);
  });
  updateTaskCounts(); // 
renderTasksWithoutDate();

}

function getEarliestDateTime(taskArray) {
  return taskArray.reduce((min, t) => {
    if (!t.date) return min;
    const [y, m, d] = t.date.split('-').map(Number);
    const [hh, mm] = (t.time || '00:00').split(':').map(Number);
    const localDate = new Date(y, m - 1, d, hh, mm);
    return localDate < min ? localDate : min;
  }, new Date(3000, 0, 1));
}

function formatDate(dateStr) {
  if (dateStr === 'Sin fecha 💤') return dateStr;
  const [year, month, day] = dateStr.split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatDateTime(dateStr, timeStr) {
  if (!dateStr) return 'Sin fecha 💤';
  const [year, month, day] = dateStr.split('-');
  const [hour, minute] = (timeStr || '00:00').split(':');
  const date = new Date(year, month - 1, day, hour, minute);
  return date.toLocaleString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getDateGroupStatus(dateStr, timeStr = '00:00') {
  if (dateStr === 'Sin fecha 💤') return 'sdate';

  const now = new Date();
  const [year, month, day] = dateStr.split('-');
  const [hour, minute] = timeStr.split(':');
  const taskDate = new Date(year, month - 1, day, hour, minute);

  if (taskDate < now) return 'past';

  const today = new Date();
  if (
    taskDate.getFullYear() === today.getFullYear() &&
    taskDate.getMonth() === today.getMonth() &&
    taskDate.getDate() === today.getDate()
  ) return 'today';

  return 'future';
}


function pluralizar(cantidad, singular, plural) {
  return cantidad === 1 ? singular : plural;
}

export function updateTaskCounts() {
  const tasks = getTasks();

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  const totalEl = document.getElementById('task-total');
  const completedEl = document.getElementById('task-completed');
  const pendingEl = document.getElementById('task-pending');

  if (totalEl)
    totalEl.textContent = `${total.toString().padStart(2, '0')} ${pluralizar(total, 'Tarea', 'Tareas')}`;

  if (completedEl)
    completedEl.textContent = `${completed.toString().padStart(2, '0')} ${pluralizar(completed, 'Completada', 'Completadas')}`;

  if (pendingEl)
    pendingEl.textContent = `${pending.toString().padStart(2, '0')} ${pluralizar(pending, 'Pendiente', 'Pendientes')}`;
}


function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}



function convertirHoraAMPM(hora24) {
  const [hora, minutos] = hora24.split(':');
  const h = parseInt(hora, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hora12 = h % 12 || 12;
  return `${hora12}:${minutos.padStart(2, '0')} ${ampm}`;
}



export function renderTasksWithoutDate() {
  const tasks = getTasks();
  const tasksWithoutDate = tasks.filter(t => !t.date);
  const container = document.getElementById('aside-tasks-without-date-list');

  if (!container) return;

  const ul = document.createElement('ul');
  ul.style.paddingLeft = '1em';

  tasksWithoutDate.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.title;
    li.classList.add('task-without-date-item');
    ul.appendChild(li);
  });

  container.innerHTML = '<h3>📌 Tareas sin fecha:</h3>';
  container.appendChild(ul);
}
