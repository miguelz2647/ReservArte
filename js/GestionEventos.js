// =====================
// Clase GestionEventosAdmin
// =====================
class GestionEventosAdmin {
  constructor() {
    this.eventos = JSON.parse(localStorage.getItem("eventos")) || [];
    this.contenedor = document.querySelector(".cards-eventos");
    this.inputBusqueda = document.querySelector(".search-bar input");
    this.selectEstado = document.querySelector(".search-bar select");
    this.btnBuscar = document.querySelector(".search-bar button");
    this.mensaje = null;

    this.mostrarEventos(this.eventos);
    this.configurarBusqueda();
  }

  // Mostrar lista de eventos
  mostrarEventos(lista) {
    this.contenedor.innerHTML = "";

    if (!lista || lista.length === 0) {
      this.contenedor.innerHTML = `
        <div class="card-evento" style="text-align:center; opacity:0.8;">
          <h2>📭 No hay eventos registrados.</h2>
          <p>Cuando los vendedores creen eventos, aparecerán aquí.</p>
        </div>
      `;
      return;
    }

    lista.forEach(evento => {
      const card = document.createElement("div");
      card.classList.add("card-evento");

      card.innerHTML = `
        <h2>${evento.nombre}</h2>
      <p>
        <span class="fecha-evento"><strong>Fecha:</strong> ${evento.fecha}</span> | 
        <span class="lugar-evento"><strong>Lugar:</strong> ${evento.lugar || "Sin definir"}</span> |
        <span class="cierre-ventas"><strong>Cierre de ventas:</strong> ${evento.fechaCierre || "Sin definir"}</span> |
        <span class="vendedor-evento"><strong>Vendedor:</strong> ${evento.vendedor || "Sin definir"}</span>
      </p>
        <p><strong>Estado:</strong> 
          <span class="estado ${evento.estado.toLowerCase()}">${evento.estado}</span>
        </p>
        </div>
        <button class="btn-eliminar">🗑️ Eliminar</button>
      `;

      // Botón de eliminar con animación (sin confirmación ni alert)
      card.querySelector(".btn-eliminar").addEventListener("click", () => {
        this.eliminarEvento(evento.nombre, card);
      });

      this.contenedor.appendChild(card);
    });
  }

  // Eliminar evento (con animación)
  eliminarEvento(nombre, card) {
    // Se elimina directamente, sin confirmación
    card.classList.add("eliminando");
    setTimeout(() => {
      this.eventos = this.eventos.filter(e => e.nombre !== nombre);
      localStorage.setItem("eventos", JSON.stringify(this.eventos));
      this.mostrarEventos(this.eventos);
      this.mostrarMensaje(`✅ Evento "${nombre}" eliminado correctamente.`);
    }, 400); // coincide con el fadeOut del CSS
  }

  // Configurar barra de búsqueda y filtro
  configurarBusqueda() {
    const buscar = () => {
      const texto = this.inputBusqueda.value.toLowerCase();
      const estado = this.selectEstado.value.toLowerCase();

      const resultados = this.eventos.filter(ev => {
        const coincideTexto = ev.nombre.toLowerCase().includes(texto);
        const coincideEstado = !estado || ev.estado.toLowerCase() === estado;
        return coincideTexto && coincideEstado;
      });

      this.mostrarEventos(resultados);
    };

    this.btnBuscar.addEventListener("click", buscar);
    this.inputBusqueda.addEventListener("input", buscar);
    this.selectEstado.addEventListener("change", buscar);
  }

  // Mostrar mensaje temporal
  mostrarMensaje(texto) {
    if (this.mensaje) this.mensaje.remove();

    this.mensaje = document.createElement("p");
    this.mensaje.className = "mensaje-exito";
    this.mensaje.textContent = texto;
    document.querySelector(".main-content").prepend(this.mensaje);

    setTimeout(() => this.mensaje.remove(), 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const cerrarSesionBtn = document.getElementById('cerrar-sesion');

  if (cerrarSesionBtn) {
      cerrarSesionBtn.addEventListener('click', () => {
          localStorage.removeItem('usuarioLoggeado'); 
          localStorage.removeItem('esAdmin');         
          window.location.href = '../inicio.html';
      });
  }
});

// Inicializar
document.addEventListener("DOMContentLoaded", () => new GestionEventosAdmin());
