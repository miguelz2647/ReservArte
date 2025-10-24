// =====================
// Clase GestionUsuariosAdmin (sin alert ni confirm)
// =====================
class GestionUsuariosAdmin {
  constructor() {
    this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    this.contenedor = document.querySelector(".cards-usuarios");
    this.inputBusqueda = document.querySelector(".search-bar input");
    this.selectRol = document.querySelectorAll(".search-bar select")[0];
    this.selectEstado = document.querySelectorAll(".search-bar select")[1];
    this.btnBuscar = document.querySelector(".search-bar button");
    this.mensaje = null;

    this.modal = document.getElementById("modal-cambiar-rol");
    this.selectNuevoRol = document.getElementById("nuevo-rol");
    this.btnGuardarRol = document.getElementById("guardar-rol");
    this.btnCancelarRol = document.getElementById("cancelar-rol");
    this.usuarioSeleccionado = null;

    this.configurarModal();
    this.mostrarUsuarios(this.usuarios);
    this.configurarBusqueda();
  }

  mostrarUsuarios(lista) {
    this.contenedor.innerHTML = "";

    if (!lista || lista.length === 0) {
      this.contenedor.innerHTML = `
        <div class="card-usuario" style="text-align:center; opacity:0.8;">
          <h2>📭 No hay usuarios registrados.</h2>
          <p>Cuando los usuarios se registren, aparecerán aquí.</p>
        </div>`;
      return;
    }

    lista.forEach(usuario => {
      const card = document.createElement("div");
      card.classList.add("card-usuario");

      card.innerHTML = `
        <h3>${usuario.nombre}</h3>
        <p><strong>Correo:</strong> ${usuario.correo}</p>
        <p><strong>Rol:</strong> ${usuario.rol}</p>
        <p><strong>Estado:</strong> 
          <span class="estado ${usuario.estado?.toLowerCase() || "activo"}">
            ${usuario.estado || "Activo"}
          </span>
        </p>
        <p><strong>Fecha de registro:</strong> ${usuario.fechaRegistro || "—"}</p>
        <div class="acciones"></div>
      `;

      const acciones = card.querySelector(".acciones");

      if (usuario.correo !== "admin@reservarte.com") {
        const btnRol = document.createElement("button");
        btnRol.classList.add("btn-rol");
        btnRol.textContent = "Cambiar Rol";
        btnRol.addEventListener("click", () => this.abrirModal(usuario.correo));

        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn-eliminar");
        btnEliminar.textContent = "Eliminar Cuenta";
        btnEliminar.addEventListener("click", () => this.eliminarUsuario(usuario.correo));

        acciones.appendChild(btnRol);
        acciones.appendChild(btnEliminar);
      } else {
        const info = document.createElement("p");
        info.style.color = "gray";
        info.style.fontStyle = "italic";
        info.textContent = "Cuenta protegida del sistema";
        acciones.appendChild(info);
      }

      this.contenedor.appendChild(card);
    });
  }

  abrirModal(correo) {
    this.usuarioSeleccionado = this.usuarios.find(u => u.correo === correo);
    if (!this.usuarioSeleccionado) return;
    this.modal.style.display = "flex";
    this.selectNuevoRol.value = this.usuarioSeleccionado.rol;
  }

  configurarModal() {
    this.btnCancelarRol.addEventListener("click", () => {
      this.modal.style.display = "none";
      this.usuarioSeleccionado = null;
    });

    this.btnGuardarRol.addEventListener("click", () => {
      if (!this.usuarioSeleccionado) return;
      const nuevoRol = this.selectNuevoRol.value;

      this.usuarioSeleccionado.rol = nuevoRol;
      localStorage.setItem("usuarios", JSON.stringify(this.usuarios));

      this.modal.style.display = "none";
      this.mostrarUsuarios(this.usuarios);
      this.mostrarMensaje(`✅ Rol actualizado a ${nuevoRol}.`, true);
    });
  }

  eliminarUsuario(correo) {
    const usuario = this.usuarios.find(u => u.correo === correo);
    if (!usuario) return;

    if (usuario.correo === "admin@reservarte.com") {
      this.mostrarMensaje("⚠️ No puedes eliminar la cuenta del administrador principal.", false);
      return;
    }

    // Eliminación directa sin confirm
    this.usuarios = this.usuarios.filter(u => u.correo !== correo);
    localStorage.setItem("usuarios", JSON.stringify(this.usuarios));
    this.mostrarUsuarios(this.usuarios);
    this.mostrarMensaje(`✅ Usuario "${usuario.nombre}" eliminado correctamente.`, true);
  }

  configurarBusqueda() {
    const buscar = () => {
      const texto = this.inputBusqueda.value.toLowerCase();
      const rol = this.selectRol.value.toLowerCase();
      const estado = this.selectEstado.value.toLowerCase();

      const resultados = this.usuarios.filter(u => {
        const coincideTexto =
          u.nombre.toLowerCase().includes(texto) ||
          u.correo.toLowerCase().includes(texto);
        const coincideRol = !rol || u.rol.toLowerCase() === rol;
        const coincideEstado = !estado || (u.estado?.toLowerCase() || "") === estado;
        return coincideTexto && coincideRol && coincideEstado;
      });

      this.mostrarUsuarios(resultados);
    };

    this.btnBuscar.addEventListener("click", buscar);
    this.inputBusqueda.addEventListener("input", buscar);
    this.selectRol.addEventListener("change", buscar);
    this.selectEstado.addEventListener("change", buscar);
  }

  mostrarMensaje(texto, exito = true) {
    if (this.mensaje) this.mensaje.remove();

    this.mensaje = document.createElement("p");
    this.mensaje.className = exito ? "mensaje-exito" : "mensaje-error";
    this.mensaje.textContent = texto;
    document.querySelector(".main-content").prepend(this.mensaje);

    setTimeout(() => this.mensaje.remove(), 3000);
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const cerrarSesionBtn = document.getElementById('cerrar-sesion');
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', () => {
            localStorage.removeItem('usuarioLoggeado'); 
            localStorage.removeItem('esAdmin');         
            window.location.href = '../inicio.html';
        });
    }

    new GestionUsuariosAdmin();
});
