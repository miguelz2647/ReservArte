// =====================
// Clase Usuario
// =====================
class Usuario {
  constructor(nombre, correo, cedula, contraseña, rol = "cliente", fechaRegistro = null) {
    this.nombre = nombre;
    this.correo = correo;
    this.cedula = cedula;
    this.contraseña = contraseña;
    this.rol = rol;
    this.fechaRegistro = fechaRegistro || new Date().toLocaleDateString("es-CO");
  }

  static inicializarAdmin() {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existeAdmin = usuarios.some(u => u.rol === "admin");

    if (!existeAdmin) {
      const admin = new Usuario(
        "Administrador del Sistema",
        "admin@reservarte.com",
        "0000",
        "admin123",
        "admin",
        new Date().toLocaleDateString("es-CO") // 🗓️ Agregamos fecha automática
      );
      usuarios.push(admin);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      console.log("Cuenta admin creada por defecto.");
    }
  }
}
