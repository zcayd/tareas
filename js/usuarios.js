// js/usuarios.js

const CLAVE_USUARIOS = "usuarios_guardados";
const CLAVE_USUARIO_ACTUAL = "usuario_activo";

// Obtener usuario actual
export function getUsuarioActual() {
  return localStorage.getItem(CLAVE_USUARIO_ACTUAL);
}

// Establecer usuario actual
export function setUsuarioActual(nombre) {
  localStorage.setItem(CLAVE_USUARIO_ACTUAL, nombre);
}

// Eliminar usuario actual (logout)
export function eliminarUsuarioActual() {
  localStorage.removeItem(CLAVE_USUARIO_ACTUAL);
}

// Obtener todos los usuarios como objetos { nombre, claveHash }
export function getUsuariosGuardados() {
  const data = localStorage.getItem(CLAVE_USUARIOS);
  return data ? JSON.parse(data) : [];
}

// Guardar usuario si no existe aún
export function guardarUsuario(nombre, clave) {
  const usuarios = getUsuariosGuardados();
  if (usuarios.find(u => u.nombre === nombre)) return;

  const claveHash = hashClave(clave);
  usuarios.push({ nombre, claveHash });
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

// Validar si un usuario existe
export function existeUsuario(nombre) {
  return getUsuariosGuardados().some(u => u.nombre === nombre);
}


// Validar clave
export function validarClave(nombre, clave) {
  const usuario = getUsuariosGuardados().find(u => u.nombre === nombre);
  return usuario && usuario.claveHash === hashClave(clave);
}

// Hashear clave (simple para demo)
function hashClave(texto) {
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = (hash << 5) - hash + texto.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}

export function cerrarSesion(callback) {
  eliminarUsuarioActual();
  if (typeof callback === 'function') {
    callback(); // ej: mostrarPantallaLogin()
  } else {
    window.location.reload();
  }
}

export function getClaveTareas() {
  const usuario = getUsuarioActual();
  return `tareas_${usuario}`;
}

export function eliminarUsuario(nombre) {
  if (!nombre) return false; // No se puede eliminar sin nombre

  // Eliminar tareas del usuario
  const claveTareasUsuario = `tareas_${nombre}`;
  localStorage.removeItem(claveTareasUsuario);

  // Eliminar al usuario de la lista de usuarios
  let usuarios = getUsuariosGuardados();
  const usuariosFiltrados = usuarios.filter(u => u.nombre !== nombre);

  if (usuarios.length === usuariosFiltrados.length) {
    return false; // Usuario no encontrado
  }

  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuariosFiltrados));

  // Si el usuario eliminado es el actual, cerrar sesión
  if (getUsuarioActual() === nombre) {
    eliminarUsuarioActual();
  }

  return true; // Eliminación exitosa
}
