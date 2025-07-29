let currentDateFilter = '';
let currentPriorityFilter = '';
let currentCategoryFilter = '';
let currentStatusFilter = '';
let currentSearch = '';

export function initFilters(updateCallback) {
    const dateSelect = document.getElementById('filter-date');
    const prioritySelect = document.getElementById('filter-priority');
    const categorySelect = document.getElementById('filter-category');
    const statusSelect = document.getElementById('filter-status');

    if (dateSelect) {
        dateSelect.addEventListener('change', () => {
            currentDateFilter = dateSelect.value;
            updateCallback();
        });
    }

    if (prioritySelect) {
        prioritySelect.addEventListener('change', () => {
            currentPriorityFilter = prioritySelect.value;

            const formInputs = document.querySelectorAll('input, select, textarea');
            formInputs.forEach(input => {
                input.classList.remove('borde-urgente', 'borde-normal', 'borde-leve');
                if (currentPriorityFilter !== '') {
                    input.classList.add(`borde-${currentPriorityFilter}`);
                }
            });

            updateCallback();
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', () => {
            currentCategoryFilter = categorySelect.value;
            updateCallback();
        });
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            updateCallback();
        });
    }

    if (statusSelect) {
        statusSelect.addEventListener('change', () => {
            currentStatusFilter = statusSelect.value;
            updateCallback();
        });
    }

    const clearBtn = document.getElementById('btn-clear-filters');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            currentDateFilter = '';
            currentPriorityFilter = '';
            currentCategoryFilter = '';
            currentSearch = '';
            currentStatusFilter = '';

            if (searchInput) searchInput.value = '';
            if (dateSelect) dateSelect.value = '';
            if (prioritySelect) prioritySelect.value = '';
            if (categorySelect) categorySelect.value = '';
            if (statusSelect) statusSelect.value = '';

            updateCallback();
        });
    }
}

export function applyFilters() {
    const groups = document.querySelectorAll('.task-date-group');

    groups.forEach(group => {
        const status = group.classList.contains('past') ? 'past' :
            group.classList.contains('today') ? 'today' :
            group.classList.contains('future') ? 'future' : 'unknown';

        const showByDate = (currentDateFilter === '' || status === currentDateFilter);

        const tasks = group.querySelectorAll('.task-item');
        let hasVisibleTasks = false;

        tasks.forEach(task => {
            const priority = task.classList.contains('priority-alta') ? 'alta' :
                task.classList.contains('priority-media') ? 'media' :
                task.classList.contains('priority-baja') ? 'baja' : 'otro';

            const category = task.dataset.category?.toLowerCase() || '';
            const content = task.textContent.toLowerCase();

            const isCompleted = task.classList.contains('completed');
            const matchesStatus = (currentStatusFilter === '' ||
                (currentStatusFilter === 'completed' && isCompleted) ||
                (currentStatusFilter === 'pending' && !isCompleted));

            const matchesPriority = (currentPriorityFilter === '' || currentPriorityFilter === priority);
            const matchesSearch = content.includes(currentSearch);
            const matchesCategory = (currentCategoryFilter === '' || category === currentCategoryFilter);

            const visible = showByDate && matchesPriority && matchesSearch && matchesCategory && matchesStatus;

            task.style.display = visible ? '' : 'none';
            if (visible) hasVisibleTasks = true;
        });

        group.style.display = hasVisibleTasks ? '' : 'none';
    });
}





export function getTasksByMonthWithNoDate(year, month) {
  const allTasks = getTasks();
  const byDate = [];
  const noDate = [];

  allTasks.forEach(task => {
    if (task.date) {
      const taskDate = new Date(task.date);
      if (taskDate.getFullYear() === year && taskDate.getMonth() === month) {
        byDate.push(task);
      }
    } else {
      noDate.push(task);
    }
  });

  return { byDate, noDate };
}
