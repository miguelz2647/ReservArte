class Boleta {
    constructor(id_boleta, id_evento, tipo_boleta, precio, cantidad_total = 0, cantidad_disponible = 0, estado = 'disponible') {
        this.id_boleta = id_boleta;
        this.id_evento = id_evento; // FK a Evento
        this.tipo_boleta = tipo_boleta;
        this.precio = precio;
        this.cantidad_total = cantidad_total;
        this.cantidad_disponible = cantidad_disponible;
        this.estado = estado;
    }
}