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
// Clase Registro
// =====================
class Registro {
  constructor(formulario) {
    this.formulario = formulario;
    this.formulario.addEventListener("submit", e => this.registrar(e));
    Usuario.inicializarAdmin();
  }

  registrar(e) {
    e.preventDefault();

    const nombre = document.getElementById("usuario").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const cedula = document.getElementById("CC").value.trim();
    const pass1 = document.getElementById("password").value;
    const pass2 = document.getElementById("password2").value;
    const contenedor = document.querySelector(".registro");

    contenedor.querySelectorAll(".error, .exito").forEach(el => el.remove());

    if (pass1 !== pass2) {
      mostrarMensaje(contenedor, "error", "Las contraseñas no coinciden.");
      return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuarios.some(u => u.cedula === cedula)) {
      mostrarMensaje(contenedor, "error", "Ya existe una cuenta con esa cédula.");
      return;
    }

    const nuevo = new Usuario(nombre, correo, cedula, pass1, "cliente");
    usuarios.push(nuevo);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mostrarMensaje(contenedor, "exito", "Cuenta creada exitosamente ✅");
    this.formulario.reset();
  }
}

// =====================
// Inicialización automática
// =====================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (form) new Registro(form);
});
