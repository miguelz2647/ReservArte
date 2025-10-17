class Venta {
    constructor(id_venta, id_usuario, id_vendedor, total, fecha_venta = new Date(), metodo_pago = 'efectivo', estado_venta = 'pagada') {
        this.id_venta = id_venta;
        this.id_usuario = id_usuario;
        this.id_vendedor = id_vendedor;
        this.fecha_venta = fecha_venta;
        this.total = total;
        this.metodo_pago = metodo_pago;
        this.estado_venta = estado_venta;
    }
}