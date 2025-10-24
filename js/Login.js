// =====================
// Función para mostrar mensajes temporales
// =====================
function mostrarMensaje(contenedor, tipo, texto) {
  const mensaje = document.createElement("p");
  mensaje.className = tipo;
  mensaje.textContent = texto;
  contenedor.appendChild(mensaje);

  // Elimina el mensaje después de 3 segundos
  setTimeout(() => mensaje.remove(), 3000);
}

// =====================
// Clase Login
// =====================
class Login {
  constructor(formulario) {
    this.formulario = formulario;
    this.formulario.addEventListener("submit", e => this.iniciarSesion(e));
    Usuario.inicializarAdmin();
  }

  iniciarSesion(e) {
    e.preventDefault();

    const cedula = document.getElementById("CC").value.trim();
    const clave = document.getElementById("clave").value.trim();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(u => u.cedula === cedula && u.contraseña === clave);
    const contenedor = document.querySelector(".inicio");

    contenedor.querySelectorAll(".error, .exito").forEach(el => el.remove());

    if (!usuario) {
      mostrarMensaje(contenedor, "error", "Cédula o contraseña incorrectas.");
      return;
    }

    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));

    const mensaje = usuario.rol === "admin"
      ? `Bienvenido Administrador 👑`
      : `Bienvenido ${usuario.nombre} 👋`;

    mostrarMensaje(contenedor, "exito", mensaje);
setTimeout(() => {
  window.location.href = "index.html";
}, 1500);
  }
}

// =====================
// Inicialización automática
// =====================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (form) new Login(form);
});
