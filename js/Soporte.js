class SoporteTicket {
    constructor(id_ticket, id_usuario, asunto, descripcion, id_soporte = null, estado = 'pendiente', fecha_creacion = new Date(), fecha_resolucion = null) {
        this.id_ticket = id_ticket;
        this.id_usuario = id_usuario; // FK a Usuario (Creador)
        this.id_soporte = id_soporte; // FK a Usuario (Agente de Soporte)
        this.asunto = asunto;
        this.descripcion = descripcion;
        this.estado = estado;
        this.fecha_creacion = fecha_creacion;
        this.fecha_resolucion = fecha_resolucion;
    }
}