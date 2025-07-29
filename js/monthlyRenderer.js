export function renderMonthlyTasksSeparate(tasksWithDate, tasksWithoutDate, year, month) {
  const container = document.getElementById('monthly-task-container');
  if (!container) return;

  container.innerHTML = ''; // limpiar

  const sectionTitle = document.createElement('h2');
  sectionTitle.textContent = `📅 Tareas de ${new Date(year, month).toLocaleString('default', { month: 'long' })}`;
  container.appendChild(sectionTitle);

  if (tasksWithDate.length === 0) {
    container.appendChild(document.createTextNode('Sin tareas con fecha este mes.'));
  } else {
    tasksWithDate.forEach(task => {
      const el = document.createElement('div');
      el.className = 'task-card';
      el.textContent = `🗓️ ${task.title}`;
      container.appendChild(el);
    });
  }

  const separator = document.createElement('hr');
  container.appendChild(separator);

  const noDateTitle = document.createElement('h3');
  noDateTitle.textContent = '📌 Tareas sin fecha';
  container.appendChild(noDateTitle);

  if (tasksWithoutDate.length === 0) {
    container.appendChild(document.createTextNode('No hay tareas sin fecha.'));
  } else {
    tasksWithoutDate.forEach(task => {
      const el = document.createElement('div');
      el.className = 'task-card no-date';
      el.textContent = `📝 ${task.title}`;
      container.appendChild(el);
    });
  }
}


