// =====================
// PERFIL VENDEDOR - Dashboard Personal
// =====================
document.addEventListener("DOMContentLoaded", () => {
const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
  const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
  const ventas = JSON.parse(localStorage.getItem("historialCompras")) || [];

  const nombreEl = document.querySelector("main h1");
  const contenedorResumen = document.querySelector(".resumen-panel");

  // Validación básica
  if (!usuario || usuario.rol !== "vendedor") {
    window.location.href = "../inicio.html";
    return;
  }

  // Personalizar bienvenida
  nombreEl.textContent = `Bienvenido, ${usuario.nombre} 👋`;

  // 🔹 Filtrar eventos y ventas solo del vendedor logueado
  const misEventos = eventos.filter(e => e.vendedor === usuario.nombre);
  const misVentas = ventas.filter(v => v.vendedor === usuario.nombre);

  // 🔹 Calcular totales
  const totalEventos = misEventos.length;
  const totalEntradas = misVentas.reduce((sum, v) => sum + (Number(v.cantidad) || 0), 0);
  const totalVentas = misVentas.reduce((sum, v) => sum + (Number(v.total) || 0), 0);

  // 🔹 Render dinámico
  contenedorResumen.innerHTML = `
    <div class="card-resumen">
      <h2>🎭 Eventos activos</h2>
      <p>${totalEventos}</p>
    </div>
    <div class="card-resumen">
      <h2>💰 Ventas totales</h2>
      <p>$${totalVentas.toLocaleString()}</p>
    </div>
    <div class="card-resumen">
      <h2>🎟️ Entradas vendidas</h2>
      <p>${totalEntradas}</p>
    </div>
  `;
});

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
