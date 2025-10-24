class PerfilCliente {
  constructor() {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    this.cliente = Cliente.fromJSON(usuarioActivo);

    this.verificarAcceso();
    this.mostrarPerfil();
    this.configurarCierreSesion();
  }

  verificarAcceso() {
    if (!this.cliente) {
      window.location.href = "../inicio.html";
    }
  }

  mostrarPerfil() {
    const titulo = document.querySelector(".perfil-content h1");
    const nombreEtiqueta = document.querySelector(".perfil-header h2");
    const fechaEtiqueta = document.querySelector(".perfil-header p");

    if (titulo) titulo.textContent = `Bienvenido, ${this.cliente.nombre}`;
    if (nombreEtiqueta) nombreEtiqueta.textContent = this.cliente.nombre;

    // Si no tiene fecha, asignar la actual (para usuarios antiguos)
    const fecha = this.cliente.fechaRegistro || new Date().toLocaleDateString();
    fechaEtiqueta.textContent = `Miembro desde ${fecha}`;
  }

  configurarCierreSesion() {
    const boton = document.getElementById("cerrarSesion");
    if (boton) {
      boton.addEventListener("click", () => {
        localStorage.removeItem("usuarioActivo");
        window.location.href = "../inicio.html";
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => new PerfilCliente());
