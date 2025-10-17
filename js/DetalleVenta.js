class DetalleVenta {
    constructor(id_detalle, id_venta, id_boleta, cantidad = 1, precio_unitario) {
        this.id_detalle = id_detalle;
        this.id_venta = id_venta; // FK a Venta
        this.id_boleta = id_boleta; // FK a Boleta
        this.cantidad = cantidad;
        this.precio_unitario = precio_unitario;
        // Propiedad calculada
        this.subtotal = cantidad * precio_unitario; 
    }
}