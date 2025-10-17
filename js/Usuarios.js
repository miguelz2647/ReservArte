class Usuario {
    constructor(id_usuario, nombre_usuario, correo, contrasena, id_rol = 4, estado_cuenta = 'activo', fecha_registro = new Date()) {
        this.id_usuario = id_usuario;
        this.nombre_usuario = nombre_usuario;
        this.correo = correo;
        this.contrasena = contrasena;
        this.id_rol = id_rol;
        this.estado_cuenta = estado_cuenta;
        this.fecha_registro = fecha_registro;
    }
}