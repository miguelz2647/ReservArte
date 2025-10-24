// =============================
// 📂 GESTOR DE EVENTOS
// =============================
class GestorEventos {
    constructor() {
        this.eventos = JSON.parse(localStorage.getItem("eventos")) || [];
    }

    // Comprueba coincidencia flexible entre categoría del evento y la seleccionada
    categoriaCoincide(eCategoria = "", seleccion = "") {
        if (!seleccion) return true; // "Ninguna" -> acepta todo
        const ev = String(eCategoria || "").toLowerCase();
        const sel = String(seleccion || "").toLowerCase();
        // coincidencia flexible: igualdad exacta OR inclusión en cualquiera de los dos sentidos
        return ev === sel || ev.includes(sel) || sel.includes(ev);
    }

    filtrarEventos(busqueda = "", categoria = "") {
        const busq = (busqueda || "").trim().toLowerCase();
        return this.eventos.filter(e =>
            (e.estado === "Activo" || e.estado === "En preventa") &&
            (!busq || (e.nombre || "").toLowerCase().includes(busq)) &&
            this.categoriaCoincide(e.categoria, categoria)
        );
    }
}

// =============================
// 🖼️ RENDERIZADOR DE GALERÍA
// =============================
class RenderizadorGaleria {
    constructor(gestor, contenedorSelector, btnVerMasSelector, limite = 6) {
        this.gestor = gestor;
        this.contenedor = document.querySelector(contenedorSelector);
        this.btnVerMas = document.querySelector(btnVerMasSelector);
        this.limite = limite;
        this.inicio = 0;
        this.eventosFiltrados = [];
    }

    inicializar(busqueda = "", categoria = "") {
        this.inicio = 0;
        this.eventosFiltrados = this.gestor.filtrarEventos(busqueda, categoria);
        this.contenedor.innerHTML = "";

        if (this.eventosFiltrados.length === 0) {
            // mensaje cuando no hay eventos
            this.contenedor.innerHTML = `<p class="mensaje-vacio">Actualmente no hay eventos disponibles.</p>`;
            this.btnVerMas.style.display = "none";
            return;
        }

        this.mostrarSiguienteBloque();
    }

    mostrarSiguienteBloque() {
        const bloque = this.eventosFiltrados.slice(this.inicio, this.inicio + this.limite);
        // si es el primer bloque limpiamos (por seguridad)
        if (this.inicio === 0) this.contenedor.innerHTML = "";

        bloque.forEach(e => {
            const div = document.createElement("article");
            div.classList.add("evento");
            div.innerHTML = `
                <a href="ver-evento.html?id=${encodeURIComponent(e.id)}">
                    <img src="${e.imagen}" alt="${e.nombre}">
                    <div class="info">
                        <h3>${e.nombre}</h3>
                        <p>${e.descripcion || ""}</p>
                        <p><strong>Estado:</strong> ${e.estado}</p>
                        <p><strong>Lugar:</strong> ${e.lugar}</p>
                    </div>
                </a>
            `;
            this.contenedor.appendChild(div);
        });

        this.inicio += bloque.length;
        this.btnVerMas.style.display = (this.inicio < this.eventosFiltrados.length) ? "block" : "none";
    }
}

// =============================
// ⚙️ INICIALIZACIÓN
// =============================
document.addEventListener("DOMContentLoaded", () => {
    const gestor = new GestorEventos();
    const renderizador = new RenderizadorGaleria(gestor, ".eventos-grid", ".ver-mas button");

    const busquedaInput = document.getElementById("busqueda");
    const radiosCategoria = document.querySelectorAll("input[name='categoria']");

    const obtenerCategoria = () => {
        const seleccionado = document.querySelector("input[name='categoria']:checked");
        return seleccionado ? seleccionado.value : "";
    };

    // Inicial: sin filtros
    renderizador.inicializar();

    // Filtro automático por nombre (mientras se escribe)
    busquedaInput.addEventListener("input", () => {
        renderizador.inicializar(busquedaInput.value, obtenerCategoria());
    });

    // Filtro automático al cambiar categoría
    radiosCategoria.forEach(radio => {
        radio.addEventListener("change", () => {
            renderizador.inicializar(busquedaInput.value, obtenerCategoria());
        });
    });

    // Cargar más
    renderizador.btnVerMas.addEventListener("click", () => renderizador.mostrarSiguienteBloque());
});
