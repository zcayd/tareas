import { getTasks } from './storage.js';
import { filterTasksByMonth } from './calendarMonthFilter.js';
import { renderMonthlyTasksSeparate } from './monthlyRenderer.js';
import { renderTasksGroupedByDate } from './render.js';

let allTasks = []; // Esto debe llenarse desde el almacenamiento o fuente original


let currentDate = new Date();

export function openCalendarModal() {
  const modal = document.getElementById('calendar-modal');
  modal.classList.remove('hidden');
  renderCalendar(currentDate);
}

export function setupCalendarModal() {
  document.querySelector('.calendar-close-btn')?.addEventListener('click', () => {
    document.getElementById('calendar-modal').classList.add('hidden');
  });

  // Modal
  document.getElementById('prev-month')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
    updateCalendarView(currentDate.getFullYear(), currentDate.getMonth());
  });

  document.getElementById('next-month')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
    updateCalendarView(currentDate.getFullYear(), currentDate.getMonth());
  });

  // Aside (nuevo)
  document.getElementById('aside-prev-month')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate, '#aside-calendar-grid', '#aside-calendar-month-label');
    updateCalendarView(currentDate.getFullYear(), currentDate.getMonth());
  });

  document.getElementById('aside-next-month')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate, '#aside-calendar-grid', '#aside-calendar-month-label');
    updateCalendarView(currentDate.getFullYear(), currentDate.getMonth());
  });

  // Botón "Hoy" para volver al mes actual
  document.getElementById('modal-today-btn').addEventListener('click', () => {
    currentDate = new Date();
    renderCalendar(currentDate, '#calendar-grid', '#calendar-month-label');
    const allTasks = getTasks();
    renderTasksGroupedByDate(allTasks);
  });

  document.getElementById('aside-today-btn').addEventListener('click', () => {
    currentDate = new Date();
    renderCalendar(currentDate, '#aside-calendar-grid', '#aside-calendar-month-label');
    const allTasks = getTasks();
    renderTasksGroupedByDate(allTasks);
  });

  // Cerrar con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('calendar-modal');
      if (!modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
      }

      updateCalendarView(year, month);
    }
  });

  // Cerrar al hacer clic fuera del contenido del modal
  document.getElementById('calendar-modal').addEventListener('click', (e) => {
    if (e.target.id === 'calendar-modal') {
      e.currentTarget.classList.add('hidden');
    }
  });

  // Renderizar la lista de tareas sin fecha para el aside
  renderAsideTasksWithoutDateList();


}





export function renderCalendar(date = new Date(), gridSelector = '#calendar-grid', labelSelector = '#calendar-month-label') {
  const grid = document.querySelector(gridSelector);
  const label = document.querySelector(labelSelector);
  const year = date.getFullYear();
  const month = date.getMonth();
  const tasks = getTasks();

  // 1. Mostrar "Mes - Año" en vez de "mes de año"
  const formattedMonth = date.toLocaleDateString('es-PE', { month: 'long' });
  label.textContent = `${capitalize(formattedMonth)} - ${year}`;

  grid.innerHTML = '';

  // 2. Agregar títulos de los días (Lun, Mar, ...)
  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  dayNames.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.classList.add('day-header');
    dayHeader.textContent = day;
    grid.appendChild(dayHeader);
  });

  // 3. Agregar espacios en blanco antes del primer día del mes
  const firstDay = new Date(year, month, 1).getDay();
  const startIndex = firstDay === 0 ? 6 : firstDay - 1; // Ajustar para que la semana empiece en lunes

  for (let i = 0; i < startIndex; i++) {
    const empty = document.createElement('div');
    empty.classList.add('empty-day');
    grid.appendChild(empty);
  }

  // 4. Rellenar los días del mes
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    cell.classList.add('calendar-day');
    cell.textContent = d;

    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const hasTask = tasks.some(t => t.date === dateStr);

    if (hasTask) {
      cell.classList.add('has-task');
      cell.title = 'Tareas para este día';
    }

    // Día actual
    const today = new Date();
    const isToday =
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    if (isToday) {
      cell.classList.add('today-highlight');
    }

    grid.appendChild(cell);
  }





}

// Capitaliza la primera letra de un string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}




export function refreshAllCalendars(date = new Date()) {
  renderCalendar(date, '#calendar-grid', '#calendar-month-label'); // modal
  renderCalendar(date, '#aside-calendar-grid', '#aside-calendar-month-label'); // aside
}



function hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function applyDynamicBoxShadow(element) {
  const theme = getComputedStyle(document.documentElement).getPropertyValue('--theme').trim();
  const rgba = hexToRgba(theme, 0.4); // 0.4 es tu opacidad deseada
  element.style.boxShadow = `0 0 0 10px ${rgba}`;
}



// calendarModal.js

export function updateCalendarView(year, month) {
  const tasks = getTasks(); // Asegurarse de cargar las tareas
  const filtered = filterTasksByMonth(tasks, year, month);
  const withDate = filtered.filter(t => t.date);
  const noDate = filtered.filter(t => !t.date);
  renderMonthlyTasksSeparate(withDate, noDate, year, month); // Renders the tasks for that month
  // Pass the already filtered tasks to renderTasksGroupedByDate, and do not re-filter
  renderTasksGroupedByDate(filtered);

  // Also update the list of tasks without dates in the aside
  renderAsideTasksWithoutDateList();
}

// Nueva función para renderizar la lista de tareas sin fecha en el aside
function renderAsideTasksWithoutDateList() {
  const tasksWithoutDate = getTasks().filter(task => !task.date);

  const container = document.getElementById('aside-tasks-without-date-list');
  if (!container) return;

  container.innerHTML = ''; // Limpiar anterior

  const title = document.createElement('h3');
  title.textContent = '📌 Tareas sin fecha:';
  container.appendChild(title);

  if (tasksWithoutDate.length === 0) {
    container.appendChild(document.createTextNode('No hay tareas sin fecha.'));
  } else {
    const list = document.createElement('ul');
    tasksWithoutDate.forEach(task => {
      const li = document.createElement('li');
      li.textContent = task.title;
      list.appendChild(li);
    });
    container.appendChild(list);
  }
}
