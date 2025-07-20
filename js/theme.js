document.addEventListener('DOMContentLoaded', () => { 
  const body = document.body;
  const toggleBtn = document.getElementById('toggle-theme');
  const iconEl = document.getElementById('theme-icon');

  // Función para actualizar ícono
  const updateIcon = (isDark) => {
    if (iconEl) {
      iconEl.src = isDark ? 'assets/icons/sun.svg' : 'assets/icons/moon.svg';
    }
  };

  // Verifica tema guardado
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme === 'dark';

  body.classList.add(isDark ? 'dark-mode' : 'light-mode');
  updateIcon(isDark);

  // Cambiar tema al hacer clic
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      body.classList.toggle('light-mode');

      const nowDark = body.classList.contains('dark-mode');
      localStorage.setItem('theme', nowDark ? 'dark' : 'light');
      updateIcon(nowDark);
    });
  }
});
