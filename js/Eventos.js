class Evento {
    constructor(id_evento, nombre_evento, descripcion = null, fecha_hora_evento, ubicacion = null, capacidad = 0, id_vendedor, estado_evento = 'activo') {
        this.id_evento = id_evento;
        this.nombre_evento = nombre_evento;
        this.descripcion = descripcion;
        this.fecha_hora_evento = fecha_hora_evento;
        this.ubicacion = ubicacion;
        this.capacidad = capacidad;
        this.id_vendedor = id_vendedor; // FK a Usuario (Vendedor)
        this.estado_evento = estado_evento;
    }
}