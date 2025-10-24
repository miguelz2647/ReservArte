// =====================
// Clase Cliente
// =====================
class Cliente extends Usuario {
  constructor(
    nombre,
    correo,
    cedula,
    contraseña,
    rol = "cliente",
    fechaRegistro = new Date().toLocaleDateString(),
    metodoPago = "Tarjeta de crédito / débito"
  ) {
    super(nombre, correo, cedula, contraseña, rol);
    this.fechaRegistro = fechaRegistro;
    this.metodoPago = metodoPago;
  }

  // Convierte un objeto plano del localStorage en instancia de Cliente
  static fromJSON(obj) {
    if (!obj || obj.rol !== "cliente") return null;
    return new Cliente(
      obj.nombre,
      obj.correo,
      obj.cedula,
      obj.contraseña,
      obj.rol,
      obj.fechaRegistro,
      obj.metodoPago
    );
  }

  // Guarda los cambios del cliente actual en localStorage
  guardarCambios() {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Buscar por cédula actual
    const index = usuarios.findIndex(u => u.cedula === this.cedula);

    if (index !== -1) {
      // Reemplaza los datos existentes
      usuarios[index] = this;
    } else {
      // Si no existía (caso raro), lo agrega
      usuarios.push(this);
    }

    // Guarda todo de nuevo
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioActivo", JSON.stringify(this));
  }
}
