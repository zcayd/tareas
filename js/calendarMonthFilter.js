// js/calendarMonthFilter.js
export function filterTasksByMonth(tasks, year, month) {
    return tasks.filter(task => {
        if (!task.date) return false; // Excluir tareas sin fecha al filtrar por mes
        const taskDate = new Date(task.date);
        return taskDate.getFullYear() === year && taskDate.getMonth() === month;
    });
}
