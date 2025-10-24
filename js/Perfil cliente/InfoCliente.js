// =====================
// Clase InfoCliente (Ajustada para Foto de Perfil)
// =====================
class InfoCliente {
  constructor() {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    this.cliente = Cliente.fromJSON(usuarioActivo);

    // ✅ NUEVAS REFERENCIAS: Selecciona la imagen dentro de .foto-perfil
    this.fotoPerfil = document.querySelector(".foto-perfil img");
    // ✅ NUEVA REFERENCIA: Selecciona el botón por su clase (ya que está fuera de .foto-perfil)
    this.btnCambiarFoto = document.querySelector(".btn-cambiar"); 

    this.verificarAcceso();
    this.mostrarInformacion();
    this.configurarFormulario();
    this.configurarMetodoPago();
    this.configurarCambioFoto(); // ✅ Agregamos la configuración de la foto
  }

  verificarAcceso() {
    if (!this.cliente) {
      window.location.href = "../inicio.html";
      return;
    }
  }

  mostrarInformacion() {
    // Mostrar en la parte superior
    const nombreEtiqueta = document.querySelector(".perfil-header h2");
    const fechaEtiqueta = document.querySelector(".perfil-header p");

    if (nombreEtiqueta) nombreEtiqueta.textContent = this.cliente.nombre;
    if (fechaEtiqueta)
      fechaEtiqueta.textContent = `Miembro desde ${this.cliente.fechaRegistro}`;

    // ✅ NUEVO: Mostrar la foto del cliente si existe
    if (this.fotoPerfil && this.cliente.foto) {
      this.fotoPerfil.src = this.cliente.foto;
    }

    // Mostrar info actual
    const info = document.querySelectorAll(".info-card")[0];
    info.innerHTML = `
      <h2>👤 Información del Usuario</h2>
      <p><strong>Nombre:</strong> ${this.cliente.nombre}</p>
      <p><strong>Correo:</strong> ${this.cliente.correo}</p>
      <p><strong>CC (Documento de Identificación):</strong> ${this.cliente.cedula}</p>
      <p><strong>Contraseña:</strong> ${"*".repeat(this.cliente.contraseña.length)}</p>
    `;

    // Rellenar formulario
    document.getElementById("nombre").value = this.cliente.nombre;
    document.getElementById("correo").value = this.cliente.correo;
    document.getElementById("cc").value = this.cliente.cedula;
    document.getElementById("contrasena").value = this.cliente.contraseña;

    // Seleccionar método de pago actual
    document.querySelectorAll("input[name='pago']").forEach(input => {
      const texto = input.parentNode.textContent.trim();
      input.checked = texto === this.cliente.metodoPago;
    });
  }

  configurarFormulario() {
    const form = document.querySelector(".update-form");
    if (form) {
      form.addEventListener("submit", e => {
        e.preventDefault();
        this.actualizarDatos();
      });
    }
  }

  actualizarDatos() {
    const nuevoNombre = document.getElementById("nombre").value.trim();
    const nuevoCorreo = document.getElementById("correo").value.trim();
    const nuevaCedula = document.getElementById("cc").value.trim();
    const nuevaPass = document.getElementById("contrasena").value.trim();

    if (!nuevoNombre || !nuevoCorreo || !nuevaCedula || !nuevaPass) {
      this.mostrarMensaje("❌ Completa todos los campos.", false);
      return;
    }

    // Actualizar datos del cliente actual
    this.cliente.nombre = nuevoNombre;
    this.cliente.correo = nuevoCorreo;
    this.cliente.cedula = nuevaCedula;
    this.cliente.contraseña = nuevaPass;

    this.cliente.guardarCambios();
    this.mostrarInformacion();
    this.mostrarMensaje("✔️ Tu información se ha actualizado correctamente.", true);
  }

  configurarMetodoPago() {
    const radios = document.querySelectorAll("input[name='pago']");
    radios.forEach(input => {
      input.addEventListener("change", e => {
        const texto = e.target.parentNode.textContent.trim();
        this.cliente.metodoPago = texto;
        this.cliente.guardarCambios();
        this.mostrarMensaje(`💳 Método de pago cambiado a: ${texto}`, true);
      });
    });
  }
  
  // ✅ NUEVO MÉTODO: Lógica para cambiar y guardar la foto
  configurarCambioFoto() {
    if (!this.btnCambiarFoto || !this.fotoPerfil) return;

    this.btnCambiarFoto.addEventListener("click", (e) => {
      e.preventDefault();

      const inputFile = document.createElement("input");
      inputFile.type = "file";
      inputFile.accept = "image/*";

      inputFile.addEventListener("change", () => {
        const file = inputFile.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
          // 1. Guardar la imagen como Base64 en el objeto del cliente
          this.cliente.foto = reader.result;

          // 2. Actualizar la vista de la foto
          this.fotoPerfil.src = this.cliente.foto;

          // 3. Persistir el cambio en localStorage
          this.cliente.guardarCambios();

          this.mostrarMensaje("🖼️ Foto de perfil actualizada.", true);

          // 4. Actualizar la foto en el navbar si la función global existe (main.js)
          if (typeof actualizarFotoPerfilGlobal === 'function') {
            actualizarFotoPerfilGlobal();
          }
        };
        reader.readAsDataURL(file);
      });
      // Simula el click para abrir el diálogo de archivos
      inputFile.click();
    });
  }

  // ✅ Ahora usa tu propio <p class="mensaje-exito"> del HTML
  mostrarMensaje(texto, exito = true) {
    const mensaje = document.querySelector(".mensaje-exito");

    if (mensaje) {
      mensaje.textContent = texto;
      mensaje.style.display = "block";
      mensaje.style.opacity = "1";

      clearTimeout(this.temporizador);
      this.temporizador = setTimeout(() => {
        mensaje.style.transition = "opacity 0.5s ease";
        mensaje.style.opacity = "0";
        setTimeout(() => {
          mensaje.style.display = "none";
          mensaje.style.opacity = "1";
        }, 500);
      }, 3000);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => new InfoCliente());