// Clase Evento
class Evento {
    constructor(id, vendedor, nombre, fechaEvento, hora, fechaCierre, lugar, categoria, descripcion, imagen, zonas = [], estado = "Pendiente") {
        this.id = id;
        this.vendedor = vendedor;
        this.nombre = nombre;
        this.fechaEvento = fechaEvento;
        this.hora = hora;
        this.fechaCierre = fechaCierre;
        this.lugar = lugar;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.imagen = imagen || 'default-evento.jpg';
        this.zonas = zonas;
        this.stock = zonas.reduce((sum, z) => sum + z.capacidad, 0);
        this.stockVendido = 0;
        this.estado = estado;
    }
}

// Clase GestorEventos
class GestorEventos {
    constructor() {
        this.eventos = JSON.parse(localStorage.getItem("eventos")) || [];
    }

    agregarEvento(evento) {
        this.eventos.push(evento);
        this.guardar();
    }

    guardar() {
        localStorage.setItem("eventos", JSON.stringify(this.eventos));
    }

    obtenerEventosPorCategoriaYCreador(categoria, vendedor) {
        return this.eventos.filter(e => e.categoria === categoria && e.vendedor === vendedor);
    }
}
