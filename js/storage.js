const STORAGE_KEY = 'agenda_tareas';


import { getUsuarioActual } from './usuarios.js';

// 🔑 Clave dinámica según usuario activo
function getClaveTareas() {
  const usuario = getUsuarioActual() || 'invitado';
  return `tareas_${usuario}`;
}

// ✅ Obtener tareas del usuario actual
export function getTasks() {
  const data = localStorage.getItem(getClaveTareas());
  return data ? JSON.parse(data) : [];
}

// ✅ Guardar todas las tareas del usuario actual
export function saveTasks(tasks) {
  localStorage.setItem(getClaveTareas(), JSON.stringify(tasks));
}

// ✅ Guardar una sola tarea nueva
export function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
}

// ✅ Eliminar tarea por ID
export function deleteTask(id) {
  const tasks = getTasks().filter(task => task.id !== id);
  saveTasks(tasks);

  // Llama tus funciones auxiliares si están definidas globalmente
  if (typeof updateTaskCounts === 'function') updateTaskCounts();
  if (typeof refreshAllCalendars === 'function') refreshAllCalendars();
}

// ✅ Obtener tareas con o sin fecha de un mes
export function getTasksForMonthOrNoDate(year, month) {
  const tasks = getTasks();
  return tasks.filter(task => {
    if (!task.dueDate) return true;
    const date = new Date(task.dueDate);
    return date.getFullYear() === year && date.getMonth() === month;
  });
}

// ✅ Separar tareas con fecha y sin fecha para un mes
export function getTasksByMonthWithNoDate(year, month) {
  const tasks = getTasks();
  const filtered = {
    byDate: [],
    noDate: []
  };

  for (const task of tasks) {
    if (!task.dueDate) {
      filtered.noDate.push(task);
    } else {
      const date = new Date(task.dueDate);
      if (date.getFullYear() === year && date.getMonth() === month) {
        filtered.byDate.push(task);
      }
    }
  }

  return filtered;
}

// ✅ Alias opcional para usar como "cargar"
export function loadTasks() {
  return getTasks();
}
