// =====================
// Clase VerBoleta
// =====================
class VerBoleta {
  constructor() {
    this.boleta = JSON.parse(localStorage.getItem("boletaSeleccionada"));
    this.usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!this.boleta || !this.usuario) {
      window.location.href = "../inicio.html";
      return;
    }

    this.mostrarBoleta();
  }

  mostrarBoleta() {
    const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
    const eventoActual = eventos.find(ev => ev.id === this.boleta.idEvento);

    const nombreEvento = eventoActual ? eventoActual.nombre : this.boleta.evento;
    const fechaEvento = eventoActual ? eventoActual.fecha : this.boleta.fechaEvento;
    const lugarEvento = eventoActual ? eventoActual.lugar : this.boleta.lugar;

    document.querySelector(".ticket-info").innerHTML = `
      <h2>${nombreEvento}</h2>
      <p><strong>Comprador:</strong> ${this.usuario.nombre}</p>
      <p><strong>Cédula (CC):</strong> ${this.usuario.cedula}</p>
      <p><strong>Fecha de compra:</strong> ${this.boleta.fecha}</p>
      <p><strong>Cantidad de boletas:</strong> ${this.boleta.cantidad}</p>
      <p><strong>Precio por boleta:</strong> $${this.boleta.precio.toLocaleString()}</p>
      <p><strong>Total pagado:</strong> $${this.boleta.total.toLocaleString()}</p>
    `;

    document.querySelector(".ticket-evento").innerHTML = `
      <p><strong>Fecha del evento:</strong> ${fechaEvento}</p>
      <p><strong>Lugar:</strong> ${lugarEvento}</p>
      <p><strong>Estado:</strong> 
        <span class="estado ${this.boleta.estado.toLowerCase()}">${this.boleta.estado}</span>
      </p>
    `;

    document.querySelector(".codigo-id").textContent = `#${this.boleta.codigo}`;
  }
}

document.addEventListener("DOMContentLoaded", () => new VerBoleta());
