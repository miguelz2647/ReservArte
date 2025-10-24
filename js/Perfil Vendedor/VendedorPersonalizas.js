document.addEventListener("DOMContentLoaded", () => {
    const inputNombre = document.getElementById("nombre");
    const inputCorreo = document.getElementById("correo");
    const inputCC = document.getElementById("CC");
    const inputDescripcion = document.getElementById("descripcion");
    const inputContrasena = document.getElementById("contrasena");

    const previewNombre = document.querySelector(".preview-box h3");
    const previewCorreo = document.querySelector(".preview-correo");
    const previewCC = document.querySelector(".preview-telefono");
    const previewDescripcion = document.querySelector(".preview-descripcion");
    const previewFoto = document.querySelector(".preview-box img");
    const fotoPerfil = document.querySelector(".foto-perfil img");
    const btnCambiarFoto = document.querySelector(".btn-cambiar");
    const btnGuardar = document.querySelector(".btn-guardar");

    let usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) return;

    // Llenar inputs desde localStorage
    inputNombre.value = usuarioActivo.nombre || "";
    inputCorreo.value = usuarioActivo.correo || "";
    inputCC.value = usuarioActivo.cedula || "";
    inputDescripcion.value = usuarioActivo.descripcion || "";
    inputContrasena.value = usuarioActivo.contraseña || "";
    if (usuarioActivo.foto) fotoPerfil.src = usuarioActivo.foto;

    function actualizarVistaPrevia() {
        previewNombre.textContent = inputNombre.value;
        previewCorreo.textContent = inputCorreo.value;
        previewCC.textContent = "CC: " + inputCC.value;
        previewDescripcion.textContent = inputDescripcion.value;
        previewFoto.src = usuarioActivo.foto || "../img/1aae286a-55ea-44b5-922f-e7148dbd726e.png";
        fotoPerfil.src = previewFoto.src;
    }

    actualizarVistaPrevia();

    [inputNombre, inputCorreo, inputCC, inputDescripcion, inputContrasena].forEach(input => {
        input.addEventListener("input", actualizarVistaPrevia);
    });

    btnCambiarFoto.addEventListener("click", e => {
        e.preventDefault();
        const inputFile = document.createElement("input");
        inputFile.type = "file";
        inputFile.accept = "image/*";
        inputFile.addEventListener("change", () => {
            const file = inputFile.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                usuarioActivo.foto = reader.result;
                actualizarVistaPrevia();
            };
            reader.readAsDataURL(file);
        });
        inputFile.click();
    });

    btnGuardar.addEventListener("click", e => {
        e.preventDefault();
        usuarioActivo.nombre = inputNombre.value.trim();
        usuarioActivo.correo = inputCorreo.value.trim();
        usuarioActivo.cedula = inputCC.value.trim();
        usuarioActivo.descripcion = inputDescripcion.value.trim();
        usuarioActivo.contraseña = inputContrasena.value;

        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));

        // Actualizar array de usuarios
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        usuarios = usuarios.map(u => u.cedula === usuarioActivo.cedula ? usuarioActivo : u);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        mostrarMensaje(document.querySelector(".perfil-box"), "exito", "Cambios guardados ✅");
        actualizarVistaPrevia();
    });

    // Función de mensajes
    function mostrarMensaje(contenedor, tipo, texto) {
        const mensaje = document.createElement("p");
        mensaje.className = tipo;
        mensaje.textContent = texto;
        contenedor.appendChild(mensaje);
        setTimeout(() => mensaje.remove(), 3000);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const cerrarSesionBtn = document.getElementById('cerrar-sesion');

    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', () => {
            // Eliminar todas las claves de sesión relevantes
            localStorage.removeItem('usuarioActivo'); 
            localStorage.removeItem('usuarioLoggeado'); 
            localStorage.removeItem('esAdmin');         
            
            window.location.href = '../inicio.html';
        });
    }
});
