const STORAGE_KEY = 'agenda_tareas';

export function getTasks() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
}

export function loadTasks() {
  return getTasks(); // opcional, puedes simplemente usar getTasks directamente
}


export function deleteTask(id) {
  const tasks = getTasks().filter(task => task.id !== id);
  saveTasks(tasks); // ✅ usa la función centralizada
  
  updateTaskCounts();

}




