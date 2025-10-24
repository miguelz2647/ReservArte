// ==================================
// VENDEDOR - MIS EVENTOS (FINAL VERIFICADO Y SIN CONFIRM)
// Script para vendedor-eventos.html
// ==================================
document.addEventListener("DOMContentLoaded", () => {
    // ---------------------------------
    // 1. Elementos y Variables
    // ---------------------------------
    const eventosBody = document.getElementById("eventos-body");
    const mensajeEl = document.getElementById("mensaje-eventos");
    const filtroNombreLugarEl = document.getElementById("filtro-nombre-lugar"); 
    const filtroEstadoEl = document.getElementById("filtro-estado");
    const btnLimpiar = document.getElementById("btn-limpiar"); 
    
    // Datos del vendedor y eventos
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
    let eventos = JSON.parse(localStorage.getItem("eventos")) || []; 

    // 2. Validación de sesión y rol
    if (!usuario || usuario.rol !== "vendedor") {
        window.location.href = "../inicio.html";
        return;
    }
    
    // Filtramos los eventos del vendedor.
    let misEventos = eventos.filter(e => e.vendedor === usuario.nombre);

    // ---------------------------------
    // 3. Funciones de Gestión y Renderizado
    // ---------------------------------

    // Función para renderizar la tabla
    const renderizarTabla = (eventosLista) => {
        eventosBody.innerHTML = ''; 
        
        if (misEventos.length === 0) {
            mensajeEl.innerHTML = '<p class="alerta-info">No tienes eventos registrados aún. Ve a "Crear Evento" para empezar. 📝</p>';
            return;
        }

        if (eventosLista.length === 0) {
            eventosBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No se encontraron eventos que coincidan con la búsqueda o filtro.</td></tr>';
            mensajeEl.innerHTML = '';
            return;
        }

        mensajeEl.innerHTML = ''; 

        eventosLista.forEach(evento => {
            const estadoNormalizado = evento.estado.toLowerCase().replace(' ', '-');
            
            const esGestionable = (estadoNormalizado === "activo" || 
                                   estadoNormalizado === "en-preventa" ||
                                   estadoNormalizado === "pendiente"); 
            
            let botonAccionHTML = '';
            
            // Botón Editar: Guarda en localStorage y redirige
            if (estadoNormalizado !== "finalizado") {
                botonAccionHTML += `<button class="btn btn-editar" data-id="${evento.id}">Editar</button>`;
            }

            if (esGestionable) {
                let textoBotonPreventa;
                let claseBotonPreventa;
                
                if (estadoNormalizado === "en-preventa") {
                    textoBotonPreventa = 'Finalizar Preventa';
                    claseBotonPreventa = 'btn-finalizar';
                } else {
                    textoBotonPreventa = 'Iniciar Preventa';
                    claseBotonPreventa = 'btn-iniciar';
                }

                botonAccionHTML += `
                    <button class="btn btn-preventa ${claseBotonPreventa}" data-id="${evento.id}" data-estado="${evento.estado}">
                        ${textoBotonPreventa}
                    </button>
                `;
            } else if (estadoNormalizado === "finalizado") {
                botonAccionHTML += `<span class="text-secondary">Gestión cerrada</span>`;
            }

            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${evento.nombre}</td>
                <td>${evento.fechaEvento} 
                ${evento.hora}</td>
                <td>${evento.lugar}</td>
                <td>${evento.stock || 'N/A'}</td>
                <td><span class="estado estado-${estadoNormalizado}">${evento.estado}</span></td>
                <td class="acciones">
                    ${botonAccionHTML}
                </td>
            `;
            eventosBody.appendChild(fila);
        });

        document.querySelectorAll('.btn-preventa').forEach(button => {
            button.addEventListener('click', manejarPreventa);
        });
    };
    
    const manejarPreventa = (e) => {
        const idEvento = e.target.dataset.id;
        const estadoActual = e.target.dataset.estado;

        let nuevoEstado;
        let mensajeAccion;

        if (estadoActual === "En preventa") {
            nuevoEstado = "Activo";
            mensajeAccion = 'finalizar';
        } else {
            nuevoEstado = "En preventa";
            mensajeAccion = 'iniciar';
        }
        
        eventos = eventos.map(evento => {
            if (evento.id == idEvento) {
                evento.estado = nuevoEstado;
                mostrarNotificacion(`Preventa para "${evento.nombre}" ${mensajeAccion}da con éxito. Estado: ${nuevoEstado}`);
            }
            return evento;
        });

        misEventos = eventos.filter(e => e.vendedor === usuario.nombre);
        localStorage.setItem("eventos", JSON.stringify(eventos));
        filtrarEventos();
    };

    const filtrarEventos = () => {
        const terminoBusqueda = filtroNombreLugarEl.value.toLowerCase().trim();
        const estadoSeleccionado = filtroEstadoEl.value; 

        let eventosFiltrados = misEventos;
        
        if (terminoBusqueda) {
            eventosFiltrados = eventosFiltrados.filter(evento => {
                const nombre = evento.nombre.toLowerCase();
                const lugar = evento.lugar.toLowerCase();
                return nombre.includes(terminoBusqueda) || lugar.includes(terminoBusqueda);
            });
        }
        if (estadoSeleccionado) {
            eventosFiltrados = eventosFiltrados.filter(evento => evento.estado === estadoSeleccionado);
        }
        renderizarTabla(eventosFiltrados);
    };

    const limpiarFiltros = () => {
        filtroNombreLugarEl.value = '';
        filtroEstadoEl.value = '';
        filtrarEventos(); 
    };

    const mostrarNotificacion = (mensaje) => {
        mensajeEl.innerHTML = `<p class="alerta-exito">${mensaje}</p>`;
        setTimeout(() => {
            mensajeEl.innerHTML = '';
        }, 5000);
    };

    if (filtroNombreLugarEl) {
        filtroNombreLugarEl.addEventListener('keyup', filtrarEventos);
    }
    if (filtroEstadoEl) {
        filtroEstadoEl.addEventListener('change', filtrarEventos);
    }
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarFiltros);
    }

    // Listener para botones Editar usando localStorage
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-editar')) {
            const idEvento = e.target.dataset.id;
            localStorage.setItem("eventoEditarId", idEvento);
            window.location.href = "vendedor-editar.html";
        }
    });
    
    renderizarTabla(misEventos);
});

// ---------------------------------
// LÓGICA DE CIERRE DE SESIÓN
// ---------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const cerrarSesionBtn = document.getElementById('cerrar-sesion');

    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', () => {
            localStorage.removeItem('usuarioActivo'); 
            localStorage.removeItem('usuarioLoggeado'); 
            localStorage.removeItem('esAdmin');         
            window.location.href = '../inicio.html';
        });
    }
});
