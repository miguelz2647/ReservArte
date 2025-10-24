document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
  const perfilLink = document.querySelector(".perfil-link");

  if (!perfilLink) return; // Evita errores si no hay header en esa página

  if (!usuario) {
    perfilLink.href = "perfil.html"; // Usuario no logueado
    return;
  }

  switch (usuario.rol) {
    case "admin":
      perfilLink.href = "../Perfil-administrador/dashboard.html";
      break;
    case "vendedor":
      perfilLink.href = "../perfil Vendedor/perfil_vendedor.html";
      break;
    default:
      perfilLink.href = "../Perfil Usuario/perfil.html"; // Cliente normal
  }
});
document.addEventListener("DOMContentLoaded", () => {
    // ... cualquier otra lógica que tengas en main.js

    actualizarFotoPerfilGlobal();
});

function actualizarFotoPerfilGlobal() {
    // 1. Obtener el usuario activo de localStorage
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    
    // 2. Obtener todas las imágenes de perfil con la clase 'logo-perfil'
    const logosPerfil = document.querySelectorAll(".logo-perfil"); 

    if (usuarioActivo && usuarioActivo.foto && logosPerfil.length > 0) {
        // 3. Iterar y actualizar la fuente (src) de cada imagen
        logosPerfil.forEach(img => {
            img.src = usuarioActivo.foto;
        });
    } else if (logosPerfil.length > 0) {
        img.src= "../img/1aae286a-55ea-44b5-922f-e7148dbd726e.png";
        logosPerfil.forEach(img => {
            // Asume que tienes una imagen por defecto en esta ruta
            img.src = "../img/perfil-default.png"; 
        });
    }
}// Contenido de ../js/main.js (Función simplificada)

// ...