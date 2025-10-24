// ==================================
// Clase GestorEventos
// ==================================
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

    // Ahora devuelve eventos por categoría (NO filtra por vendedor)
    obtenerEventosPorCategoria(categoria, limite = 5) {
        let eventosFiltrados = this.eventos.filter(e =>
            e.categoria === categoria &&
            (e.estado === "Activo" || e.estado === "En preventa")
        );
        eventosFiltrados.sort((a, b) => new Date(b.fechaEvento + "T" + b.hora) - new Date(a.fechaEvento + "T" + a.hora));
        return eventosFiltrados.slice(0, limite);
    }

    obtenerEventosProximos(limite = 3) {
        const ahora = new Date();
        let eventosFuturos = this.eventos.filter(e =>
            new Date(e.fechaEvento + "T" + e.hora) > ahora &&
            (e.estado === "Activo" || e.estado === "En preventa")
        );
        eventosFuturos.sort((a, b) => new Date(a.fechaEvento + "T" + a.hora) - new Date(b.fechaEvento + "T" + b.hora));
        return eventosFuturos.slice(0, limite);
    }

    obtenerEventoPorId(id) {
        return this.eventos.find(e => e.id === id);
    }
}

// ==================================
// Clase RenderizadorEventos
// ==================================
class RenderizadorEventos {
    constructor(gestor) {
        this.gestor = gestor;
    }

    // ahora recibe (contenedorSelector, categoria)
    renderizarCategoria(contenedorSelector, categoria, limite = 5) {
        const contenedor = document.querySelector(contenedorSelector);
        if (!contenedor) return;

        contenedor.innerHTML = '';
        const eventos = this.gestor.obtenerEventosPorCategoria(categoria, limite);

        if (eventos.length === 0) {
            contenedor.innerHTML = `<p class="mensaje-vacio">Actualmente no hay eventos disponibles en ${categoria}.</p>`;
            return;
        }

        eventos.forEach(evento => {
            const div = document.createElement('div');
            div.classList.add('concierto');
            div.innerHTML = `
                <a href="ver-evento.html?id=${encodeURIComponent(evento.id)}">
                    <div class="img-concierto">
                        <img src="${evento.imagen}" alt="${evento.nombre}">
                    </div>
                    <div class="titulo-concierto"><p>${evento.nombre}</p></div>
                    <div class="fecha-concicerto"><p>Fecha del evento: ${evento.fechaEvento}</p></div>
                    <div class="lugar-concierto"><p>Lugar establecido: ${evento.lugar}</p></div>
                    <div class="estado-concierto"><p>${evento.estado || "Pendiente"}</p></div>
                </a>
            `;
            contenedor.appendChild(div);
        });
    }

    renderizarProximos(contenedorSelector, limite = 3) {
        const contenedor = document.querySelector(contenedorSelector);
        if (!contenedor) return;

        contenedor.innerHTML = '';
        const eventos = this.gestor.obtenerEventosProximos(limite);

        if (eventos.length === 0) {
            contenedor.innerHTML = `<p class="mensaje-vacio">No hay próximos eventos disponibles.</p>`;
            return;
        }

        eventos.forEach(evento => {
            const div = document.createElement('div');
            div.classList.add('concierto');
            div.innerHTML = `
                <a href="ver-evento.html?id=${encodeURIComponent(evento.id)}">
                    <div class="img-concierto">
                        <img src="${evento.imagen}" alt="${evento.nombre}">
                    </div>
                    <div class="titulo-concierto"><p>${evento.nombre}</p></div>
                    <div class="fecha-concicerto"><p>Fecha del evento: ${evento.fechaEvento}</p></div>
                    <div class="lugar-concierto"><p>Lugar establecido: ${evento.lugar}</p></div>
                    <div class="estado-concierto"><p>${evento.estado || "Pendiente"}</p></div>
                </a>
            `;
            contenedor.appendChild(div);
        });
    }
}

// ==================================
// Inicialización al cargar el menú
// ==================================
document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
    // Si no hay usuario logueado, igual queremos mostrar el menú (todos pueden verlo).
    // por eso *no* retornamos aquí; solo usamos usuario si necesitamos algo más adelante.
    // if (!usuario) return; <- NO lo hacemos para que menú sea visible si no hay sesión

    const gestor = new GestorEventos();
    const renderizador = new RenderizadorEventos(gestor);

    // Próximos eventos (visibles para todos)
    renderizador.renderizarProximos('#proximamente');

    // Categorías: ahora muestran eventos de TODOS los vendedores que estén Activo/En preventa
    renderizador.renderizarCategoria('#festivales', 'Festivales');
    renderizador.renderizarCategoria('#conciertos', 'Conciertos');
    renderizador.renderizarCategoria('#deportes', 'Deporte');
    renderizador.renderizarCategoria('#teatro', 'Teatro');
    renderizador.renderizarCategoria('#conferencias', 'Conferencias');
});
