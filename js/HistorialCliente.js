// =====================
// Clase HistorialCliente
// =====================
class HistorialCliente {
  constructor() {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    this.cliente = Cliente.fromJSON(usuarioActivo);

    this.verificarAcceso();
    this.historial = this.obtenerHistorial();
    this.mostrarHistorial(this.historial);
    this.configurarBusqueda();
  }

  verificarAcceso() {
    if (!this.cliente) {
      window.location.href = "../inicio.html";
    }
  }

  // Obtener historial desde localStorage
  obtenerHistorial() {
    const historial = JSON.parse(localStorage.getItem("historialCompras")) || [];
    const eventos = JSON.parse(localStorage.getItem("eventos")) || [];

    // Filtramos solo las boletas del cliente
    const comprasCliente = historial.filter(compra => compra.cedula === this.cliente.cedula);

    // Reemplazamos la info de la boleta con los datos actuales del evento
    return comprasCliente.map(compra => {
      const eventoActual = eventos.find(ev => ev.id === compra.idEvento);
      if (eventoActual) {
        return {
          ...compra,
          evento: eventoActual.nombre,
          fechaEvento: eventoActual.fecha,
          lugar: eventoActual.lugar
        };
      }
      return compra; // si no encuentra el evento, dejamos los datos de la boleta tal cual
    });
  }

  mostrarHistorial(compras) {
    const contenedor = document.querySelector(".cards-compras");
    contenedor.innerHTML = "";

    if (compras.length === 0) {
      contenedor.innerHTML = `
        <div class="card-compra" style="text-align:center; opacity:0.8;">
          <h2>🧾 Aún no tienes compras registradas.</h2>
          <p>Cuando realices una compra, aparecerá aquí tu historial.</p>
        </div>
      `;
      return;
    }

    compras.forEach((compra, index) => {
      const card = document.createElement("div");
      card.classList.add("card-compra");

      const botonBoleta =
        compra.estado.toLowerCase() === "activo"
          ? `<button class="update-btn" data-index="${index}">Ver Boleta</button>`
          : "";

      card.innerHTML = `
        <h2>${compra.evento}</h2>
        <p><strong>Fecha de compra:</strong> ${compra.fecha}</p>
        <p><strong>Cantidad:</strong> ${compra.cantidad} boletas</p>
        <p><strong>Precio por boleta:</strong> $${compra.precio.toLocaleString()}</p>
        <p><strong>Total pagado:</strong> $${compra.total.toLocaleString()}</p>
        <p><strong>Estado:</strong> 
          <span class="estado ${compra.estado.toLowerCase()}">${compra.estado}</span>
        </p>
        ${botonBoleta}
      `;

      contenedor.appendChild(card);
    });

    document.querySelectorAll(".update-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        const compraSeleccionada = compras[index];
        localStorage.setItem("boletaSeleccionada", JSON.stringify(compraSeleccionada));
        window.location.href = "ver_boleta.html";
      });
    });
  }

  configurarBusqueda() {
    const inputBusqueda = document.querySelector(".search-bar input");
    const selectEstado = document.querySelector(".search-bar select");
    const btnBuscar = document.querySelector(".search-bar button");

    const buscar = () => {
      const texto = inputBusqueda.value.toLowerCase();
      const estado = selectEstado.value.toLowerCase();

      const resultados = this.historial.filter((compra) => {
        const coincideTexto = compra.evento.toLowerCase().includes(texto);
        const coincideEstado =
          !estado || compra.estado.toLowerCase() === estado;
        return coincideTexto && coincideEstado;
      });

      this.mostrarHistorial(resultados);
    };

    btnBuscar.addEventListener("click", buscar);
    inputBusqueda.addEventListener("input", buscar);
    selectEstado.addEventListener("change", buscar);
  }
}

document.addEventListener("DOMContentLoaded", () => new HistorialCliente());
