// =====================
// Clase Admin
// =====================
class Admin extends Usuario {
  constructor(
    nombre,
    correo,
    cedula,
    contraseña,
    rol = "admin",
    fechaRegistro = new Date().toLocaleDateString()
  ) {
    super(nombre, correo, cedula, contraseña, rol);
    this.fechaRegistro = fechaRegistro;
  }

  // Convierte un objeto plano del localStorage en instancia de Admin
  static fromJSON(obj) {
    if (!obj || obj.rol !== "admin") return null;
    return new Admin(
      obj.nombre,
      obj.correo,
      obj.cedula,
      obj.contraseña,
      obj.rol,
      obj.fechaRegistro
    );
  }

  // Guarda los cambios del admin actual en localStorage
  guardarCambios() {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const index = usuarios.findIndex(u => u.cedula === this.cedula);

    if (index !== -1) {
      usuarios[index] = this;
    } else {
      usuarios.push(this);
    }

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioActivo", JSON.stringify(this));
  }

  // =====================
  // Métodos específicos de admin
  // =====================

  // Cambiar rol de un usuario
  cambiarRol(cedula, nuevoRol) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(u => u.cedula === cedula);
    if (usuario) {
      usuario.rol = nuevoRol;
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      return true;
    }
    return false;
  }

  // Obtener todos los usuarios
  obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
  }

  // Eliminar usuario
  eliminarUsuario(cedula) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios = usuarios.filter(u => u.cedula !== cedula);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
}

