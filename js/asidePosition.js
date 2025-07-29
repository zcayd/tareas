import { getTasksByMonthWithNoDate } from './storage.js';
import { renderMonthlyTasksSeparate } from './monthlyRenderer.js';


document.addEventListener('DOMContentLoaded', () => {
    const aside = document.getElementById('calendar-sidebar');
    const header = document.getElementById('calendar-header');
    const toggleBtn = document.getElementById('toggle-aside-position');
    const layout = document.querySelector('.main-layout');
    let isDragging = false;
    let startX = 0;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;

        if (Math.abs(deltaX) > 50) {
            const newPosition = deltaX > 0 ? 'right' : 'left';
            moveAside(newPosition);
            localStorage.setItem('aside-position', newPosition);
            isDragging = false;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = '';
    });

    toggleBtn.addEventListener('click', () => {
        const current = localStorage.getItem('aside-position') || 'right';
        const newPosition = current === 'right' ? 'left' : 'right';
        moveAside(newPosition);
        localStorage.setItem('aside-position', newPosition);
    });

    function moveAside(position) {
        aside.classList.remove('slide-left', 'slide-right');

        if (position === 'left') {
            layout.insertBefore(aside, layout.firstChild);
            aside.classList.add('slide-left');
        } else {
            layout.appendChild(aside);
            aside.classList.add('slide-right');
        }
    }

    // Inicializar desde localStorage
    const savedPosition = localStorage.getItem('aside-position') || 'right';
    moveAside(savedPosition);
    
});



export function updateMonthlyAndNoDateTasks(year, month) {
  const data = getTasksByMonthWithNoDate(year, month);
  renderMonthlyTasksSeparate(data.byDate, data.noDate, year, month);
}
