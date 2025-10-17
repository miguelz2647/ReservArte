// Gráficas Circulares Generales
const ventasCtx = document.getElementById('ventasChart').getContext('2d');
const ventasChart = new Chart(ventasCtx, {
    type: 'doughnut',
    data: {
        labels: ['Completadas', 'Pendientes'],
        datasets: [{
            data: [75, 25],
            backgroundColor: ['#ffcf87','#ffc107'],
            borderWidth: 2,
        }]
    },
    options: { plugins: { legend: { labels: { color: '#fff' } } } }
});

const eventosCtx = document.getElementById('eventosChart').getContext('2d');
const eventosChart = new Chart(eventosCtx, {
    type: 'doughnut',
    data: {
        labels: ['Activos', 'Pendientes', 'Cerrados'],
        datasets: [{ data: [60,20,20], backgroundColor: ['#28a745','#ffc107','#dc3545'], borderWidth: 2 }]
    },
    options: { plugins: { legend: { labels: { color: '#fff' } } } }
});

const usuariosCtx = document.getElementById('usuariosChart').getContext('2d');
const usuariosChart = new Chart(usuariosCtx, {
    type: 'doughnut',
    data: {
        labels: ['Clientes','Vendedores','Administradores'],
        datasets: [{ data: [50,30,20], backgroundColor: ['#1e90ff','#ff69b4','#ffa500'], borderWidth: 2 }]
    },
    options: { plugins: { legend: { labels: { color: '#fff' } } } }
});

// Gráficas de barras verticales
const boletosCtx = document.getElementById('boletosChart').getContext('2d');
new Chart(boletosCtx, {
    type: 'bar',
    data: {
        labels: ['Evento 1','Evento 2','Evento 3','Evento 4'],
        datasets: [{ label: 'Boletos', data: [120,200,150,80], backgroundColor:'#ffcf87' }]
    },
    options: { scales: { y: { beginAtZero:true, ticks: { color:'#fff' } }, x:{ ticks:{ color:'#fff' } } }, plugins:{ legend:{ labels:{ color:'#fff' } } } }
});

const ingresosCtx = document.getElementById('ingresosChart').getContext('2d');
new Chart(ingresosCtx, {
    type: 'bar',
    data: {
        labels: ['Juan','Ana','Lucía','Pedro'],
        datasets: [{ label: 'Ingresos', data: [500,300,450,200], backgroundColor:'#28a745' }]
    },
    options: { scales:{ y:{ beginAtZero:true, ticks:{ color:'#fff' } }, x:{ ticks:{ color:'#fff' } } }, plugins:{ legend:{ labels:{ color:'#fff' } } } }
});

const tipoEventoCtx = document.getElementById('tipoEventoChart').getContext('2d');
new Chart(tipoEventoCtx, {
    type: 'bar',
    data: {
        labels: ['Música','Deporte','Teatro','Arte'],
        datasets: [{ label: 'Ventas', data: [200,150,100,80], backgroundColor:'#ff69b4' }]
    },
    options: { scales:{ y:{ beginAtZero:true, ticks:{ color:'#fff' } }, x:{ ticks:{ color:'#fff' } } }, plugins:{ legend:{ labels:{ color:'#fff' } } } }
});

const estadoEventosCtx = document.getElementById('estadoEventosChart').getContext('2d');
new Chart(estadoEventosCtx, {
    type: 'bar',
    data: {
        labels: ['Pendientes','Activos'],
        datasets: [{ label: 'Cantidad', data: [10,30], backgroundColor:'#ffc107' }]
    },
    options: { scales:{ y:{ beginAtZero:true, ticks:{ color:'#fff' } }, x:{ ticks:{ color:'#fff' } } }, plugins:{ legend:{ labels:{ color:'#fff' } } } }
});

const usuariosMesCtx = document.getElementById('usuariosMesChart').getContext('2d');
new Chart(usuariosMesCtx, {
    type: 'bar',
    data: {
        labels: ['Enero','Febrero','Marzo','Abril','Mayo'],
        datasets: [{ label: 'Usuarios', data: [20,30,25,40,35], backgroundColor:'#1e90ff' }]
    },
    options: { scales:{ y:{ beginAtZero:true, ticks:{ color:'#fff' } }, x:{ ticks:{ color:'#fff' } } }, plugins:{ legend:{ labels:{ color:'#fff' } } } }
});
