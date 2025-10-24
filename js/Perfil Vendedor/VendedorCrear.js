// ==================================
// VENDEDOR - CREAR EVENTO (adaptado para permitir campos vacíos y guardar imagen como Base64)
// ==================================
document.addEventListener("DOMContentLoaded", () => {
    const formEl = document.getElementById("crear-evento-form");
    const mensajeFormEl = document.getElementById("mensaje-form");
    const mensajeZonasEl = document.getElementById("mensaje-zonas");
    const zonasListaEl = document.getElementById("zonas-lista");
    const noZonasMsgEl = document.getElementById("no-zonas-msg");
    const btnAgregarZona = document.getElementById("btn-agregar-zona");

    const nombreZonaEl = document.getElementById("nombre-zona");
    const capacidadZonaEl = document.getElementById("capacidad-zona");
    const precioZonaEl = document.getElementById("precio-zona");

    let zonasTemporales = [];
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

    // Validación de sesión y rol
    if (!usuario || usuario.rol !== "vendedor") {
        window.location.href = "../inicio.html";
        return;
    }

    // ---------------------------------
    // Gestión de Zonas
    // ---------------------------------
    const renderizarZonas = () => {
        zonasListaEl.innerHTML = '';
        if (zonasTemporales.length === 0) {
            zonasListaEl.appendChild(noZonasMsgEl); 
            noZonasMsgEl.style.display = 'block';
            return;
        }
        noZonasMsgEl.style.display = 'none';

        zonasTemporales.forEach((zona, index) => {
            const zonaDiv = document.createElement('div');
            zonaDiv.classList.add('zona-item');
            const precioFormateado = zona.precio.toLocaleString('es-CO');
            const capacidadFormateada = zona.capacidad.toLocaleString();
            zonaDiv.innerHTML = `
                <span>${zona.nombre}</span>
                <span>Capacidad: ${capacidadFormateada}</span>
                <span>Precio: $${precioFormateado}</span>
                <button type="button" class="btn-eliminar-zona" data-index="${index}">Eliminar</button>
            `;
            zonasListaEl.appendChild(zonaDiv);
        });

        document.querySelectorAll('.btn-eliminar-zona').forEach(btn => btn.addEventListener('click', eliminarZona));
    };

    const agregarZona = () => {
        const nombre = nombreZonaEl.value.trim();
        const capacidad = parseInt(capacidadZonaEl.value);
        const precio = parseFloat(precioZonaEl.value);

        if (!nombre) { mostrarMensaje(mensajeZonasEl, 'error', 'Nombre obligatorio'); return; }
        if (isNaN(capacidad) || capacidad <= 0) { mostrarMensaje(mensajeZonasEl, 'error', 'Capacidad inválida'); return; }
        if (isNaN(precio) || precio <= 0) { mostrarMensaje(mensajeZonasEl, 'error', 'Precio inválido'); return; }

        zonasTemporales.push({ nombre, capacidad, precio });
        nombreZonaEl.value = '';
        capacidadZonaEl.value = '';
        precioZonaEl.value = '';
        renderizarZonas();
        mostrarMensaje(mensajeZonasEl, 'exito', `Zona "${nombre}" agregada`);
    };

    const eliminarZona = (e) => {
        const index = parseInt(e.target.dataset.index);
        const nombre = zonasTemporales[index].nombre;
        zonasTemporales.splice(index, 1);
        renderizarZonas();
        mostrarMensaje(mensajeZonasEl, 'info', `Zona "${nombre}" eliminada`);
    };

    btnAgregarZona.addEventListener('click', agregarZona);

    // ---------------------------------
    // Manejo del Formulario Principal
    // ---------------------------------
    formEl.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const fechaApertura = document.getElementById('fecha-apertura').value;
        const hora = document.getElementById('hora').value;
        const fechaCierre = document.getElementById('fecha-cierre').value;
        const lugar = document.getElementById('lugar').value.trim();
        const categoria = document.getElementById('categoria').value;
        const descripcion = document.getElementById('descripcion').value.trim();
        const imagenInput = document.getElementById('imagen');

        // Validación de campos obligatorios
        if (!nombre || !fechaApertura || !hora || !fechaCierre || !lugar || !categoria) {
            mostrarMensaje(mensajeFormEl, 'error', 'Completa los campos obligatorios'); 
            return;
        }

        const fechaObj = new Date(`${fechaApertura}T${hora}`);
        const ahora = new Date();
        if (fechaObj <= ahora) { mostrarMensaje(mensajeFormEl, 'error', 'La fecha del evento debe ser futura'); return; }

        const stockTotal = zonasTemporales.reduce((sum, z) => sum + z.capacidad, 0);

        // Función para guardar el evento en localStorage
        const guardarEvento = (imagenBase64) => {
            const nuevoEvento = {
                id: Date.now().toString(),
                vendedor: usuario.nombre,
                nombre: nombre,
                fechaEvento: fechaApertura,
                hora: hora,
                fechaCierre: fechaCierre,
                lugar: lugar,
                categoria: categoria,
                descripcion: descripcion,
                imagen: imagenBase64 || 'default-evento.jpg', // usa Base64 o default
                stock: stockTotal,
                stockVendido: 0,
                zonas: zonasTemporales,
                estado: "Pendiente"
            };

            let eventos = JSON.parse(localStorage.getItem("eventos")) || [];
            eventos.push(nuevoEvento);
            localStorage.setItem("eventos", JSON.stringify(eventos));

            mostrarMensaje(mensajeFormEl, 'exito', 'Evento creado. Pendiente de revisión.');
            setTimeout(() => { window.location.href = 'vendedor-eventos.html'; }, 2000);
        };

        // Si se seleccionó imagen, convertir a Base64
        if (imagenInput.files.length > 0) {
            const file = imagenInput.files[0];
            const reader = new FileReader();
            reader.onload = () => guardarEvento(reader.result);
            reader.readAsDataURL(file);
        } else {
            guardarEvento(null);
        }
    });

    // ---------------------------------
    // Funciones Auxiliares
    // ---------------------------------
    function mostrarMensaje(contenedor, tipo, texto) {
        contenedor.innerHTML = `<p class="${tipo === 'error' ? 'alerta-error' : tipo === 'exito' ? 'alerta-exito' : 'alerta-info'}">${texto}</p>`;
        if (contenedor === mensajeZonasEl) setTimeout(() => contenedor.innerHTML = '', 3000);
    }

    renderizarZonas();
});

// ---------------------------------
// Cerrar sesión
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
