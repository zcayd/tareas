<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mis Tareas</title>
    <link rel="icon" href="assets/img/to-do.png" type="image/png">
    <link rel="stylesheet" href="style.css">
    <meta name="theme-color" content="#007bff">
    <link rel="manifest" href="manifest.json">


</head>

<body>
    <div id="splash-screen">
  <img src="assets/img/to-do.png" alt="Logo" class="splash-logo">
  <p id="splash-greeting">Cargando...</p>
</div>

    <header>
        <div class="header-top">
            <h1>
                <span id="task-total">0</span>
                <button id="btn-open" class="connection-indicator" title="Nueva tarea">
                    <span id="connection-status">＋</span>
                </button>
            </h1>
            <button id="toggle-theme">
                <img id="theme-icon" src="assets/icons/moon.svg" alt="Tema" />
            </button>
            <button id="btn-copy-selected"><img src="assets/icons/copy.svg" alt=""></button>
            <button id="btn-share-selected"><img src="assets/icons/share.svg" alt=""></button>
        </div>
        <div class="controls">
            <button id="toggle-filters" class="accordion accfiltrar">FILTRAR</button>
            <div class="panel filters-panel">
                <div class="filters-container">
                    <div class="search-bar">
                        <input type="text" id="search-input"
                            placeholder="Buscar título, descripción, categoría o fecha" />
                        <button id="btn-clear-filters"><img src="assets/icons/danger.svg" alt=""></button>
                    </div>
                    <div>
                        <select id="filter-category">
                            <option value="">📂 Categorías</option>
                            <option value="personal">🔸Personal</option>
                            <option value="trabajo">🔸Trabajo</option>
                            <option value="estudio">🔸Estudio</option>
                            <option value="compra">🔸Compra</option>
                            <option value="salud">🔸Salud</option>
                            <option value="iglesia">🔸Iglesia</option>
                            <option value="visita">🔸Visita</option>
                            <option value="otros">🔸Otros</option>
                        </select>
                        <select id="filter-priority">
                            <option value="">⚠️ Prioridad</option>
                            <option value="alta">🔸 Alta</option>
                            <option value="media">🔸 Media</option>
                            <option value="baja">🔸 Baja</option>
                        </select>
                        <select id="filter-date">
                            <option value="">📅 Fechas</option>
                            <option value="past">🔸 Pasadas</option>
                            <option value="today">🔸 Hoy</option>
                            <option value="future">🔸 Futuras</option>
                        </select>
                        <select id="filter-status">
                            <option value="">🕒 Estado</option>
                            <option value="completed">✅ Listos</option>
                            <option value="pending">⏳ Pendientes</option>
                        </select>

                    </div>
                </div>
            </div>
            <script>
                var acc = document.getElementsByClassName("accordion");
                var i;

                for (i = 0; i < acc.length; i++) {
                    acc[i].addEventListener("click", function () {
                        this.classList.toggle("active");
                        var panel = this.nextElementSibling;
                        if (panel.style.maxHeight) {
                            panel.style.maxHeight = null;
                        } else {
                            panel.style.maxHeight = panel.scrollHeight + "px";
                        }
                    });
                }
            </script>
        </div>
    </header>
    <!-- Modal -->
    <div id="task-modal" class="modal hidden">
        <div class="modal-content ">
            <h2 id="modal-title">Nueva Tarea</h2>
            <form id="task-form" class="form-task">
                <input type="text" id="task-title" name="titulo" placeholder="Título" required />
                <div class="row-group">
                    <select id="task-category" name="categoria">
                        <option value="">Categoría</option>
                        <option value="personal">Personal</option>
                        <option value="trabajo">Trabajo</option>
                        <option value="estudio">Estudio</option>
                        <option value="compra">Compra</option>
                        <option value="salud">Salud</option>
                        <option value="iglesia">Iglesia</option>
                        <option value="visita">Visita</option>
                        <option value="otras">Otras</option>
                    </select>

                    <select name="prioridad" id="task-priority">
                        <option class="borde-urgente" value="alta">Alta</option>
                        <option value="media">Media</option>
                        <option value="baja">Baja</option>
                    </select>
                </div>
                <div class="row-group">
                    <input type="date" id="task-date" name="fecha" />
                    <input type="time" id="task-time" name="hora" />
                </div>
                <textarea id="task-desc" name="descripcion" placeholder="Descripción"></textarea>
                <div class="row-group btn-group">
                    <button type="button" id="btn-cancel" class="btn-cancelar">Cancelar</button>
                    <button type="submit" id="btn-save" class="btn-guardar">Guardar</button>
                </div>
            </form>
        </div>
    </div>
    <main>
        <template id="task-template">
            <li class="task-item">
                <div class="task-action-row">
                    <div class="task-buttons"></div>
                    <button class="btn-delete-inline"></button>
                </div>
            </li>
        </template>
        <ul id="task-list"></ul>
    </main>
    <footer>
        <div class="footer-top">
            <div id="task-completed">Completadas: 0</div>|
            <div id="task-pending">Pendientes: 0</div>
        </div>
        <div class="footer-bottom">            
            <span>© 2025 ZCAYD & AZ. Todos los derechos reservados.</span>
            <br>
            <!-- Coloca esto en tu HTML principal -->
<button id="btn-install" style="display: none;"></button>


        </div>
    </footer>
    <div id="toast-container"></div>
    <script type="module" src="./js/utils.js"></script>
    <script type="module" src="./js/main.js"></script>
    <script src="js/theme.js"></script>
</body>

</html>