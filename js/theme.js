import { showToast } from './utils.js';
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const body = document.body;
  const toggleBtn = document.getElementById('toggle-theme');
  const iconEl = document.getElementById('theme-icon');
  const spanText = toggleBtn?.querySelector('span');
  const colorContainer = document.getElementById('colorContainer');

  const colors = [
    "#0067c7", "#011f80", "#32309f", "#c4022c", "#811594",
    "#ff5722", "#ff9800", "#355666", "#127016", "#5ea110"
  ];

  // Crear botones de color
  colors.forEach((color, index) => {
    const btn = document.createElement("button");
    btn.classList.add("btn", "theme-picker");
    btn.style.backgroundColor = color;
    btn.dataset.color = color;
    btn.title = `Color ${index + 1}`;
    btn.addEventListener('click', () => {
      root.style.setProperty('--theme', color);
      localStorage.setItem('themeColor', color);
      document.querySelectorAll('.theme-picker').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
    colorContainer?.appendChild(btn);
  });

  // Recuperar modo de tema
  let themeMode = localStorage.getItem('themeMode');
  if (!themeMode) {
    themeMode = 'auto';
    localStorage.setItem('themeMode', themeMode); // <- guarda por defecto
  }
  applyTheme(localStorage.getItem('themeMode') || 'auto');

  applyTheme(themeMode);


  // Aplicar color guardado
  const savedColor = localStorage.getItem('themeColor');
  if (savedColor) {
    root.style.setProperty('--theme', savedColor);
    document.querySelectorAll('.theme-picker').forEach(btn => {
      if (btn.dataset.color === savedColor) btn.classList.add('selected');
    });
  }

  // Botón para alternar entre modos
  toggleBtn?.addEventListener('click', () => {
    const nextMode = getNextMode(themeMode);
    localStorage.setItem('themeMode', nextMode);
    applyTheme(nextMode);
    themeMode = nextMode;
  });

  // Obtener el siguiente modo
  function getNextMode(current) {
    return current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
  }

  // Aplicar el tema
  function applyTheme(mode) {
    body.classList.remove('light-mode', 'dark-mode');
    if (mode === 'light') {
      body.classList.add('light-mode');
      updateThemeUI(false, 'Modo claro', 'moon.svg');
    } else if (mode === 'dark') {
      body.classList.add('dark-mode');
      updateThemeUI(true, 'Modo oscuro', 'sun.svg');
    } else {
      // modo automático
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      body.classList.add(prefersDark ? 'dark-mode' : 'light-mode');
      updateThemeUI(prefersDark, 'Automático', 'eclipse.svg');
    }
  }

  // Actualizar ícono y texto
  function updateThemeUI(isDark, text, icon) {
    if (iconEl) iconEl.src = `assets/icons/${icon}`;
    if (spanText) spanText.textContent = text;
  }

  // Cambios del sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const themeMode = localStorage.getItem('themeMode') || 'auto';
    if (themeMode === 'auto') {
      applyTheme('auto');
    }
  });

  // Botón de restaurar
  const resetBtn = document.getElementById('reset-theme');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.removeItem('themeColor');
      localStorage.setItem('themeMode', 'auto');
      localStorage.setItem('fontSize', 'normal');
      // 🚀 Disparar evento para que render.js lo escuche
      window.dispatchEvent(new CustomEvent('restaurar-fuente'));

      currentFontIndex = fontSizes.indexOf('normal');
      aplicarTamanoFuente();



      const defaultColor = "#0067c7";
      document.documentElement.style.setProperty('--theme', defaultColor);

      applyTheme('auto'); // Asegúrate que esta func esté disponible
      document.querySelectorAll('.theme-picker').forEach(btn => btn.classList.remove('selected'));
      document.querySelector(`.theme-picker[data-color="${defaultColor}"]`)?.classList.add('selected');

      showToast("Preferencias restauradas a automático", 'info');
    });
  }

  // Controlar tamaño de fuente
  const fontSizes = ['small', 'normal', 'large', 'xlarge'];
  const fontLabels = {
    small: 'Pequeña',
    normal: 'Normal',
    large: 'Grande',
    xlarge: 'Muy Grande'
  };

  let savedSize = localStorage.getItem('fontSize');
  let currentFontIndex = fontSizes.indexOf(savedSize);
  if (currentFontIndex === -1) currentFontIndex = 1; // por defecto: 'normal'

  const fontSizeLabel = document.getElementById('fontSizeLabel');

  function aplicarTamanoFuente() {
    const size = fontSizes[currentFontIndex];
    document.body.setAttribute('data-font-size', size);
    localStorage.setItem('fontSize', size);

    // Actualizar el texto visible
    if (fontSizeLabel) {
      fontSizeLabel.textContent = `Fuente: ${fontLabels[size]}`;
    }
  }

  // Inicializar al cargar
  aplicarTamanoFuente();

  document.getElementById('btn-increase-font').addEventListener('click', () => {
    if (currentFontIndex < fontSizes.length - 1) {
      currentFontIndex++;
      aplicarTamanoFuente();
    }
  });

  document.getElementById('btn-decrease-font').addEventListener('click', () => {
    if (currentFontIndex > 0) {
      currentFontIndex--;
      aplicarTamanoFuente();
    }
  });

  // Escuchar el evento de restaurar fuente (disparado por el botón de restaurar preferencias)
  window.addEventListener('restaurar-fuente', () => {
    currentFontIndex = fontSizes.indexOf('normal');
    aplicarTamanoFuente();
  });
});
