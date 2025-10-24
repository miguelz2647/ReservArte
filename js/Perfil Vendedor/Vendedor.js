// =====================
// Clase Vendedor (hereda de Usuario)
// =====================
class Vendedor extends Usuario {
  constructor(nombre, correo, cedula, contraseña, rol = "vendedor") {
    super(nombre, correo, cedula, contraseña, rol);
    this.eventosCreados = [];
    this.ventasRealizadas = [];
  }
}
