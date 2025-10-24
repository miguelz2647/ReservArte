// dashboard.js
// =====================
// Dashboard Admin - actualización total y automática
// =====================

/*
  Este script:
  - Se asegura de que existan arrays en localStorage.
  - Lee eventos, ventas (historialCompras) y usuarios.
  - Calcula y reemplaza los contadores del HTML aunque tengan valores estáticos.
  - Ordena y rellena la tabla "Eventos Mas Vendidos" (de mayor a menor).
  - Vuelve a actualizar periódicamente (interval configurable).
*/

(function () {
  const AUTO_UPDATE_MS = 2000; // ajuste automático; 0 para desactivar

  function ensureLocalStorageArrays() {
    if (!localStorage.getItem("eventos")) localStorage.setItem("eventos", JSON.stringify([]));
    if (!localStorage.getItem("historialCompras")) localStorage.setItem("historialCompras", JSON.stringify([]));
    if (!localStorage.getItem("usuarios")) localStorage.setItem("usuarios", JSON.stringify([]));
  }

  function parseJSON(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
      console.error("Error parseando", key, e);
      return [];
    }
  }

  function actualizarContadores() {
    const eventos = parseJSON("eventos");
    const ventas = parseJSON("historialCompras");
    const usuarios = parseJSON("usuarios");

    // Buscar los elementos de contador de forma robusta
    const contadores = Array.from(document.querySelectorAll(".cards .card .numero"));

    // Fallbacks si estructura diferente
    const eventosActivosEl = contadores[0] || document.querySelector(".card-eventos .numero");
    const ventasTotalesEl = contadores[1] || document.querySelector(".card-ventas .numero");
    const usuariosEl = contadores[2] || document.querySelector(".card-usuarios .numero");
    const satisfEl = contadores[3] || document.querySelector(".card-satisf .numero");

    const eventosActivos = eventos.filter(e => (e.estado || "").toString().toLowerCase() === "activo").length;
    const totalVentas = ventas.reduce((sum, v) => sum + (Number(v.total) || 0), 0);
    const usuariosCount = usuarios.length;
    const satisf = calcularSatisfaccion(ventas, usuarios); // placeholder

    if (eventosActivosEl) eventosActivosEl.textContent = eventosActivos;
    if (ventasTotalesEl) ventasTotalesEl.textContent = `$${totalVentas.toLocaleString('en-US')}`;
    if (usuariosEl) usuariosEl.textContent = usuariosCount;
    if (satisfEl) satisfEl.textContent = satisf;
  }

  // Ejemplo simple: satisfacción = 0% si no hay datos
  function calcularSatisfaccion(ventas, usuarios) {
    // Si tienes valoraciones, cámbialo por promedio real.
    return ventas.length === 0 ? "0%" : "92%"; // mantén lógica real si la agregas
  }

  function llenarTablaEventos() {
    const eventos = parseJSON("eventos");
    const ventas = parseJSON("historialCompras");

    const tbody = document.querySelector(".tabla-dashboard tbody");
    if (!tbody) return;

    // Construir array con ventas por evento
    const eventosConVentas = eventos.map(evento => {
      // identificar por id o por nombre; preferible idEvento en ventas
      const id = evento.id !== undefined ? evento.id : evento.nombre;
      const vendidos = ventas
        .filter(v => {
          if (v.idEvento !== undefined && evento.id !== undefined) return v.idEvento === evento.id;
          // fallback por nombre si no hay id
          return String(v.evento || "").trim() === String(evento.nombre || "").trim();
        })
        .reduce((s, x) => s + (Number(x.cantidad) || 0), 0);
      return { ...evento, vendidos };
    });

    // Orden descendente por vendidos
    eventosConVentas.sort((a, b) => (b.vendidos || 0) - (a.vendidos || 0));

    // Limpiar y renderizar
    tbody.innerHTML = "";
    if (eventosConVentas.length === 0) {
      // Opcional: fila vacía
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="7" style="text-align:center; opacity:0.6;">No hay eventos registrados.</td>`;
      tbody.appendChild(tr);
      return;
    }

    eventosConVentas.forEach(evento => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${evento.nombre || ""}</td>
        <td>${evento.categoria || ""}</td>
        <td>${evento.fechaEvento || ""}</td>
        <td>${evento.fechaCierre || ""}</td>
        <td>${evento.preventa ? "Sí" : "No"}</td>
        <td>${evento.vendidos || 0}</td>
        <td><span class="estado ${String(evento.estado || "pendiente").toLowerCase()}">${evento.estado || "Pendiente"}</span></td>
      `;
      tbody.appendChild(fila);
    });
  }

  function actualizarDashboard() {
    ensureLocalStorageArrays();
    actualizarContadores();
    llenarTablaEventos();
  }

  document.addEventListener("DOMContentLoaded", () => {
    actualizarDashboard();
    if (AUTO_UPDATE_MS > 0) setInterval(actualizarDashboard, AUTO_UPDATE_MS);
  });
})();


document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener una referencia al botón de cerrar sesión
    const cerrarSesionBtn = document.getElementById('cerrar-sesion');

    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', () => {
            // --- Lógica para CERRAR SESIÓN (Sin confirmación) ---

            // 2. Limpiar los datos de la sesión del almacenamiento local (localStorage)
            // Estas claves deben coincidir con las que usas al iniciar sesión
            // (basado en el patrón de tu 'inicio.html' para manejar datos).
            localStorage.removeItem('usuarioLoggeado'); 
            localStorage.removeItem('esAdmin');         
            
            // Si usas otras claves de sesión, añádelas aquí:
            // localStorage.removeItem('otraClaveDeSesion');

            // 3. Redirigir al usuario inmediatamente a la página de inicio de sesión
            window.location.href = '../inicio.html';
        });
    }
});