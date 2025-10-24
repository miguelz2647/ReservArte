// ==================================
// Ver Evento - ver-evento.js
// ==================================
document.addEventListener('DOMContentLoaded', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const idEvento = urlParams.get('id');

    const evento = JSON.parse(localStorage.getItem('eventos'))?.find(e => e.id === idEvento);

    if (!evento) {
        window.location.href = 'Galeria.html';
        return;
    }

    const contenedor = document.querySelector('.contenedor-evento');
    contenedor.innerHTML = '';

    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta-evento');

    tarjeta.innerHTML = `
        <img src="${evento.imagen}" alt="${evento.nombre}" class="imagen-evento">
        <div class="detalles-evento">
            <h1 class="titulo-evento">${evento.nombre}</h1>
            <p class="descripcion-evento">${evento.descripcion || 'Sin descripción disponible.'}</p>
            <p><strong>Fecha y hora:</strong> ${evento.fechaEvento} ${evento.hora}</p>
            <p><strong>Ubicación:</strong> ${evento.lugar}</p>
            <p><strong>Capacidad total:</strong> ${evento.stock} personas</p>
            <p><strong>Estado:</strong> <span class="estado-evento">${evento.estado}</span></p>

            <div class="zona-compra">
                <label for="zona">Seleccionar zona:</label>
                <select id="zona" name="zona">
                    ${evento.zonas.map(z => `<option value="${z.nombre}" data-precio="${z.precio}" data-stock="${z.capacidad}">${z.nombre} - $${z.precio.toLocaleString('es-CO')} (${z.capacidad} disponibles)</option>`).join('')}
                </select>

                <label for="cantidad">Cantidad:</label>
                <input type="number" id="cantidad" name="cantidad" min="1" value="1" max="${evento.zonas[0].capacidad}">
            </div>

            <div class="botones">
                <a href="Galeria.html" class="btn-volver">Volver</a>
                <button class="btn-agregar">Añadir al carrito</button>
            </div>

            <div id="mensaje-carrito" class="mensaje-carrito"></div>
        </div>
    `;

    contenedor.appendChild(tarjeta);

    const zonaSelect = tarjeta.querySelector('#zona');
    const cantidadInput = tarjeta.querySelector('#cantidad');
    const mensajeCarrito = tarjeta.querySelector('#mensaje-carrito');

    zonaSelect.addEventListener('change', () => {
        const stockZona = parseInt(zonaSelect.selectedOptions[0].dataset.stock);
        cantidadInput.max = stockZona;
        cantidadInput.value = stockZona > 0 ? 1 : 0;
        mensajeCarrito.innerHTML = ''; // Limpiar mensaje al cambiar zona
    });

    const btnAgregar = tarjeta.querySelector('.btn-agregar');
    btnAgregar.addEventListener('click', () => {
        const zonaSeleccionada = zonaSelect.value;
        const cantidad = parseInt(cantidadInput.value);

        if (cantidad <= 0) {
            mensajeCarrito.innerHTML = '<p class="alerta-error">Selecciona una cantidad válida</p>';
            return;
        }

        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito.push({
            idEvento: evento.id,
            nombreEvento: evento.nombre,
            zona: zonaSeleccionada,
            cantidad: cantidad,
            precioUnitario: parseFloat(zonaSelect.selectedOptions[0].dataset.precio)
        });
        localStorage.setItem('carrito', JSON.stringify(carrito));

        mensajeCarrito.innerHTML = `<p class="alerta-exito">Se agregaron ${cantidad} boletas de la zona ${zonaSeleccionada} al carrito</p>`;
    });
});
