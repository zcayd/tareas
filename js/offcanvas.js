const abrirBtn = document.getElementById('abrirOffcanvas');
const cerrarBtn = document.getElementById('cerrarOffcanvas');
const offcanvas = document.getElementById('offcanvas');

abrirBtn.addEventListener('click', () => {
  offcanvas.classList.add('abierto');
});

cerrarBtn.addEventListener('click', () => {
  offcanvas.classList.remove('abierto');
});

document.addEventListener('click', (e) => {
  if (!offcanvas.contains(e.target) && !abrirBtn.contains(e.target)) {
    offcanvas.classList.remove('abierto');
  }
});

// Cerrar con tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    offcanvas.classList.remove('abierto');
  }
});
