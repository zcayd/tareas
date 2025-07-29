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
refreshAllCalendars(); 
}




export function getTasksForMonthOrNoDate(year, month) {
  const tasks = getTasks();

  return tasks.filter(task => {
    if (!task.dueDate) return true;

    const date = new Date(task.dueDate);
    return date.getFullYear() === year && date.getMonth() === month;
  });
}



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
