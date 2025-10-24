// =====================================================
// 📊 ReservArte - Gráficas Generales (Panel Administrador)
// =====================================================

(function () {
  // Tiempo de actualización automática (ms)
  const AUTO_UPDATE_MS = 3000;
  const charts = {};

  // -----------------------------------------------------
  // 🔹 Funciones auxiliares
  // -----------------------------------------------------
  const parseJSON = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  };

  const agrupar = (arr, key, fnSum = null) => {
    const map = {};
    arr.forEach((item) => {
      const clave = item[key];
      if (!clave) return;
      map[clave] = fnSum ? (map[clave] || 0) + fnSum(item) : (map[clave] || 0) + 1;
    });
    return map;
  };

  const renderChart = (id, type, labels, data, label, colors) => {
    const ctx = document.getElementById(id);
    if (!ctx) return;

    // Si ya existe un gráfico, destrúyelo antes de renderizar el nuevo
    if (charts[id]) charts[id].destroy();

    charts[id] = new Chart(ctx, {
      type,
      data: {
        labels,
        datasets: [
          {
            label,
            data,
            backgroundColor:
              colors || [
                "#E27D60", "#85DCB0", "#E8A87C", "#C38D9E",
                "#41B3A3", "#FBEEC1", "#659DBD", "#BC986A"
              ],
            borderWidth: 0.8,
            borderColor: "#fff",
            tension: 0.4 // suaviza líneas (solo line chart)
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { color: "#f4d7b1" } },
        },
        scales: type === "bar" || type === "line"
          ? {
              x: { ticks: { color: "#f4d7b1" }, grid: { color: "#3a2a20" } },
              y: { ticks: { color: "#f4d7b1" }, grid: { color: "#3a2a20" } },
            }
          : {},
        animation: false, // ❌ Desactivar animaciones para estabilidad visual
      },
    });
  };

  // -----------------------------------------------------
  // 🔹 Función principal: Actualizar todas las gráficas
  // -----------------------------------------------------
  function actualizarGraficas() {
    const eventos = parseJSON("eventos");
    const ventas = parseJSON("historialCompras");
    const usuarios = parseJSON("usuarios");

    // 1️⃣ Ventas Completadas vs Pendientes
    const ventasEstado = agrupar(ventas, "estado");
    renderChart(
      "ventasChart",
      "doughnut",
      Object.keys(ventasEstado),
      Object.values(ventasEstado),
      "Estado de Ventas"
    );

    // 2️⃣ Estado de Eventos
    const eventosEstado = agrupar(eventos, "estado");
    renderChart(
      "eventosChart",
      "pie",
      Object.keys(eventosEstado),
      Object.values(eventosEstado),
      "Estado de Eventos"
    );

    // 3️⃣ Usuarios por Rol
    const usuariosRol = agrupar(usuarios, "rol");
    renderChart(
      "usuariosChart",
      "pie",
      Object.keys(usuariosRol),
      Object.values(usuariosRol),
      "Usuarios por Rol"
    );

    // 4️⃣ Boletos Vendidos por Evento
    const boletosPorEvento = {};
    ventas.forEach((v) => {
      const evento = v.evento || "Desconocido";
      boletosPorEvento[evento] =
        (boletosPorEvento[evento] || 0) + (Number(v.cantidad) || 0);
    });
    renderChart(
      "boletosChart",
      "bar",
      Object.keys(boletosPorEvento),
      Object.values(boletosPorEvento),
      "Boletos Vendidos"
    );

    // 5️⃣ Ingresos por Vendedor
    const ingresosVendedor = {};
    ventas.forEach((v) => {
      const vendedor = v.vendedor || "Desconocido";
      ingresosVendedor[vendedor] =
        (ingresosVendedor[vendedor] || 0) + (Number(v.total) || 0);
    });
    renderChart(
      "ingresosChart",
      "bar",
      Object.keys(ingresosVendedor),
      Object.values(ingresosVendedor),
      "Ingresos Generados ($)"
    );

    // 6️⃣ Ventas por Tipo de Evento
    const ventasPorTipo = {};
    ventas.forEach((v) => {
      const evento = eventos.find((e) => e.nombre === v.evento);
      const tipo = evento?.categoria || "Desconocido";
      ventasPorTipo[tipo] =
        (ventasPorTipo[tipo] || 0) + (Number(v.total) || 0);
    });
    renderChart(
      "tipoEventoChart",
      "bar",
      Object.keys(ventasPorTipo),
      Object.values(ventasPorTipo),
      "Ventas por Categoría"
    );

    // 7️⃣ Eventos Pendientes, Preventa y Activos
    const estadosReducidos = {
      Pendiente: eventos.filter((e) => e.estado?.toLowerCase() === "pendiente").length,
      Preventa: eventos.filter((e) => e.estado?.toLowerCase() === "en preventa").length,
      Activo: eventos.filter((e) => e.estado?.toLowerCase() === "activo").length,
    };
    renderChart(
      "estadoEventosChart",
      "doughnut",
      Object.keys(estadosReducidos),
      Object.values(estadosReducidos),
      "Eventos por Estado"
    );

    // 8️⃣ Usuarios Registrados por Mes
    const usuariosPorMes = {};
    usuarios.forEach((u) => {
      if (!u.fechaRegistro) return;
      const fecha = new Date(u.fechaRegistro);
      const mes = fecha.toLocaleString("es-ES", { month: "short", year: "numeric" });
      usuariosPorMes[mes] = (usuariosPorMes[mes] || 0) + 1;
    });
    renderChart(
      "usuariosMesChart",
      "line",
      Object.keys(usuariosPorMes),
      Object.values(usuariosPorMes),
      "Usuarios Nuevos por Mes"
    );
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
  // -----------------------------------------------------
  // 🔹 Ejecución y actualización automática
  // -----------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    actualizarGraficas();
    if (AUTO_UPDATE_MS > 0) setInterval(actualizarGraficas, AUTO_UPDATE_MS);
  });
})();
