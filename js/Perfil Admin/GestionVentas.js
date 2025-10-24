// =====================
// Clase GestionVentasAdmin
// =====================
class GestionVentasAdmin {
  constructor() {
    // Cargar ventas (desde historialCompras)
    this.ventas = JSON.parse(localStorage.getItem("historialCompras")) || [];

    // 🔹 Ya no agregamos datos de prueba aquí
    this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    this.tbody = document.querySelector(".tabla-ventas tbody");

    // Filtros
    this.inputBuscar = document.getElementById("buscar-comprador");
    this.filtroCategoria = document.getElementById("filtro-categoria");
    this.filtroVendedor = document.getElementById("filtro-vendedor");
    this.fechaInicio = document.getElementById("fecha-inicio");
    this.fechaFin = document.getElementById("fecha-fin");
    this.btnBuscar = document.getElementById("btn-buscar");

    // Inicialización
    this.cargarVendedores();
    this.mostrarVentas(this.ventas);
    this.configurarFiltros();
  }

  // =====================
  // Cargar lista dinámica de vendedores
  // =====================
  cargarVendedores() {
    const vendedores = this.usuarios.filter(u => u.rol === "vendedor");
    this.filtroVendedor.innerHTML = `<option value="">Filtrar por vendedor</option>`;
    vendedores.forEach(v => {
      const option = document.createElement("option");
      option.value = v.nombre;
      option.textContent = v.nombre;
      this.filtroVendedor.appendChild(option);
    });
  }

  // =====================
  // Mostrar ventas en la tabla
  // =====================
  mostrarVentas(lista) {
    this.tbody.innerHTML = "";

    if (!lista || lista.length === 0) {
      this.tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; opacity:0.7;">
            🧾 No se encontraron ventas registradas.
          </td>
        </tr>`;
      return;
    }

    lista.forEach((venta, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${index + 1}</td>
        <td>${venta.comprador}</td>
        <td>${venta.evento}</td>
        <td>${venta.categoria || "—"}</td>
        <td>${venta.vendedor}</td>
        <td>${venta.cantidad}</td>
        <td>$${venta.total.toLocaleString()}</td>
        <td>${venta.fechaVenta}</td>
      `;
      this.tbody.appendChild(fila);
    });
  }

  // =====================
  // Configurar filtros de búsqueda
  // =====================
  configurarFiltros() {
    const filtrar = () => {
      const texto = this.inputBuscar.value.toLowerCase();
      const categoria = this.filtroCategoria.value.toLowerCase();
      const vendedor = this.filtroVendedor.value;
      const desde = this.fechaInicio.value ? new Date(this.fechaInicio.value) : null;
      const hasta = this.fechaFin.value ? new Date(this.fechaFin.value) : null;

      const resultados = this.ventas.filter(v => {
        const coincideComprador = v.comprador.toLowerCase().includes(texto);
        const coincideCategoria =
          !categoria || (v.categoria && v.categoria.toLowerCase() === categoria);
        const coincideVendedor = !vendedor || v.vendedor === vendedor;

        let coincideFecha = true;
        if (desde || hasta) {
          const fechaVenta = new Date(v.fechaVenta);
          if (desde && fechaVenta < desde) coincideFecha = false;
          if (hasta && fechaVenta > hasta) coincideFecha = false;
        }

        return coincideComprador && coincideCategoria && coincideVendedor && coincideFecha;
      });

      this.mostrarVentas(resultados);
    };

    this.btnBuscar.addEventListener("click", filtrar);
    this.inputBuscar.addEventListener("input", filtrar);
    this.filtroCategoria.addEventListener("change", filtrar);
    this.filtroVendedor.addEventListener("change", filtrar);
    this.fechaInicio.addEventListener("change", filtrar);
    this.fechaFin.addEventListener("change", filtrar);
  }
}
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
// =====================
// Inicializar clase al cargar la página
// =====================
document.addEventListener("DOMContentLoaded", () => new GestionVentasAdmin());
