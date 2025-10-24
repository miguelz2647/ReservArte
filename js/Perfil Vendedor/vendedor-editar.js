document.addEventListener("DOMContentLoaded", () => {
    const tablaBody = document.getElementById("zonas-body");
    const estadoSelect = document.getElementById("estado-evento");
    const btnGuardar = document.getElementById("guardar-cambios");
    const mensaje = document.getElementById("mensaje-editar");

    // Inputs adicionales para nombre, fecha, hora y lugar
    const inputNombre = document.getElementById("nombre-evento");
    const inputFecha = document.getElementById("fecha-evento");
    const inputHora = document.getElementById("hora-evento");
    const inputLugar = document.getElementById("lugar-evento");

    // ID del evento a editar desde localStorage
    const eventoIdEditar = localStorage.getItem("eventoEditarId");
    let eventos = JSON.parse(localStorage.getItem("eventos")) || [];

    // Buscar evento
    let evento = eventos.find(ev => ev.id === eventoIdEditar);
    if (!evento) {
        mensaje.textContent = "Evento no encontrado.";
        mensaje.style.color = "#ff4d4d";
        return;
    }

    // Llenar inputs con los datos actuales
    inputNombre.value = evento.nombre;
    inputFecha.value = evento.fechaEvento;
    inputHora.value = evento.hora;
    inputLugar.value = evento.lugar;
    estadoSelect.value = evento.estado;

    // Asegurarse de que cada zona tenga un id único solo si no lo tiene
    evento.zonas = evento.zonas.map((z, index) => {
        if (!z.id) z.id = Date.now() + index; 
        return z;
    });

    // Renderizar tabla de zonas
    function renderizarZonas() {
        tablaBody.innerHTML = "";
        evento.zonas.forEach(zona => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${zona.nombre}</td>
                <td><input type="number" class="input-capacidad" value="${zona.capacidad}" min="1"></td>
                <td><input type="number" class="input-precio" value="${zona.precio}" min="0"></td>
                <td><button class="btn-actualizar" data-id="${zona.id}">Actualizar</button></td>
            `;
            tablaBody.appendChild(tr);
        });
    }

    // Actualizar zona individual
    tablaBody.addEventListener("click", (e) => {
        if(e.target.classList.contains("btn-actualizar")) {
            const fila = e.target.closest("tr");
            const idZona = parseInt(e.target.dataset.id);
            const capacidad = parseInt(fila.querySelector(".input-capacidad").value);
            const precio = parseFloat(fila.querySelector(".input-precio").value);

            const zona = evento.zonas.find(z => z.id === idZona);
            if (!zona) return;

            zona.capacidad = capacidad;
            zona.precio = precio;

            mensaje.textContent = `Zona "${zona.nombre}" actualizada correctamente.`;
            mensaje.style.color = "#ffcf87";
        }
    });

    // Cambiar estado del evento
    estadoSelect.addEventListener("change", () => {
        evento.estado = estadoSelect.value;
        mensaje.textContent = `Estado del evento cambiado a "${evento.estado}".`;
        mensaje.style.color = "#ffcf87";
    });

    // Guardar todos los cambios en localStorage
    btnGuardar.addEventListener("click", () => {
        // 1️⃣ Tomar los nuevos valores de los inputs principales
        if(inputNombre.value.trim()) evento.nombre = inputNombre.value.trim();
        if(inputFecha.value) evento.fechaEvento = inputFecha.value;
        if(inputHora.value) evento.hora = inputHora.value;
        if(inputLugar.value.trim()) evento.lugar = inputLugar.value.trim();

        // 2️⃣ Recalcular stock total sumando las capacidades de las zonas
        evento.stock = evento.zonas.reduce((total, z) => total + (z.capacidad || 0), 0);

        // 3️⃣ Guardar el evento actualizado en el array completo
        eventos = eventos.map(ev => ev.id === evento.id ? evento : ev);
        localStorage.setItem("eventos", JSON.stringify(eventos));

        // 4️⃣ Mostrar mensaje de éxito
        mensaje.textContent = "Todos los cambios guardados correctamente!";
        mensaje.style.color = "#8aff8a";
    });

    renderizarZonas();
});
