// js/login.js

import {
  getUsuariosGuardados,
  guardarUsuario,
  setUsuarioActual,
  validarClave,
  existeUsuario,
  eliminarUsuario, // Importar la nueva función
  getUsuarioActual // Importar para verificar si el usuario actual es eliminado
} from "./usuarios.js";

export function mostrarPantallaLogin(callbackPostLogin) {
  const anterior = document.getElementById("login-overlay");
  if (anterior) anterior.remove();

  const usuarios = getUsuariosGuardados();

  const overlay = document.createElement("div");
  overlay.id = "login-overlay";
  overlay.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

  // Modificar el innerHTML para que coincida con el estilo de la imagen proporcionada, incluyendo el campo de contraseña
  overlay.innerHTML = `
    <div id="login-overlay"> <!-- Outer overlay, already styled -->
      <div class="login-container-simple"> <!-- New class for this specific style -->
        <h2 class="login-title-simple">Iniciar Sesión</h2>
        
        <!-- Username Input -->
        <div class="form-group">
          <label for="input-username" class="form-label-simple">Usuario</label>
          <input type="text" id="input-username" class="form-input-simple" placeholder="Nuevo o existente">
        </div>

        <!-- Existing Users Dropdown -->
        <div class="form-group">
          <label for="select-existing-users" class="form-label-simple">Usuarios existentes</label>
          <div class="input-group-simple">
            <select id="select-existing-users" class="form-input-simple select-user-simple">
              <option value="">-- Usuarios existentes --</option>
              ${usuarios.map(u => `
                <option value="${u.nombre}">${u.nombre}</option>
              `).join("")}
            </select>
            <button id="btn-delete-user-simple" class="action-button-simple delete-button-simple">
              🗑️
            </button>
          </div>
        </div>

        <!-- Password Input -->
        <div class="form-group">
          <label for="input-password" class="form-label-simple">Contraseña</label>
          <input type="password" id="input-password" class="form-input-simple" placeholder="Contraseña">
        </div>

        <!-- Buttons -->
        <div class="button-group-simple">
          <button id="btn-clear-input" class="form-button-simple clear-button-simple">Limpiar</button>
          <button id="btn-enter" class="form-button-simple enter-button-simple">Entrar</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // --- Event Listeners ---

  // Update username input when selecting from dropdown
  const selectExistingUsers = overlay.querySelector("#select-existing-users");
  const inputUsername = overlay.querySelector("#input-username");
  if (selectExistingUsers && inputUsername) {
    selectExistingUsers.addEventListener("change", () => {
      inputUsername.value = selectExistingUsers.value;
    });
  }

  // Delete user functionality
  const btnDeleteUserSimple = overlay.querySelector("#btn-delete-user-simple");
  if (btnDeleteUserSimple && selectExistingUsers) {
    btnDeleteUserSimple.addEventListener("click", () => {
      const selectedUserName = selectExistingUsers.value;
      if (!selectedUserName) {
        alert("Por favor, selecciona un usuario para eliminar.");
        return;
      }

      if (confirm(`¿Estás seguro de que deseas eliminar al usuario "${selectedUserName}" y todas sus tareas?`)) {
        const deleted = eliminarUsuario(selectedUserName); // Call deletion function

        if (deleted) {
          alert(`Usuario "${selectedUserName}" eliminado exitosamente.`);
          // Re-render the login modal to update the user list
          mostrarPantallaLogin(callbackPostLogin);
        } else {
          alert("Error al eliminar el usuario.");
        }
      }
    });
  }

  // Login functionality
  const btnEnter = overlay.querySelector("#btn-enter");
  const inputPassword = overlay.querySelector("#input-password"); // Get the password input
  if (btnEnter && inputUsername && inputPassword) {
    btnEnter.addEventListener("click", () => {
      const nombre = inputUsername.value.trim();
      const clave = inputPassword.value.trim(); // Use the password input value

      if (!nombre || !clave) {
        alert("Debes ingresar nombre y contraseña.");
        return;
      }

      if (existeUsuario(nombre)) {
        if (validarClave(nombre, clave)) {
          setUsuarioActual(nombre);
          overlay.remove();
          callbackPostLogin();
        } else {
          alert("Contraseña incorrecta.");
        }
      } else {
        if (confirm(`¿Deseas registrar el usuario "${nombre}"?`)) {
          guardarUsuario(nombre, clave);
          setUsuarioActual(nombre);
          overlay.remove();
          callbackPostLogin();
        }
      }
    });
  }


  // Limpiar inputs de nombre y contraseña
const btnClear = overlay.querySelector("#btn-clear-input");
if (btnClear && inputUsername && inputPassword) {
  btnClear.addEventListener("click", () => {
    inputUsername.value = "";
    inputPassword.value = "";
  });
}


}
