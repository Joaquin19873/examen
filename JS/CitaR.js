
let citas = [];
let citaIdCounter = 1;

const doctoresPorEspecialidad = {
    'Cardiología': ['Dr. Carlos Mendoza', 'Dra. Ana García', 'Dr. Luis Rodríguez'],
    'Pediatría': ['Dra. María López', 'Dr. Juan Pérez', 'Dra. Carmen Silva'],
    'Traumatología': ['Dr. Roberto Díaz', 'Dra. Laura Martínez', 'Dr. Pedro Sánchez'],
    'Neurología': ['Dra. Isabel Fernández', 'Dr. Miguel Torres', 'Dra. Patricia Ruiz'],
    'Ginecología': ['Dra. Sandra Jiménez', 'Dra. Elena Vargas', 'Dra. Rosa Morales'],
    'Dermatología': ['Dr. Andrés Castro', 'Dra. Lucía Herrera', 'Dr. Francisco Ramos']
};


document.addEventListener('DOMContentLoaded', function() {

    cargarCitasDeStorage();
    

    const reservaForm = document.getElementById('reservaForm');
    if (reservaForm) {

        const fechaInput = document.getElementById('fecha');
        const hoy = new Date().toISOString().split('T')[0];
        fechaInput.min = hoy;
        
        reservaForm.addEventListener('submit', handleReservaSubmit);

        document.getElementById('especialidad').addEventListener('change', actualizarDoctores);
    }
    

    if (window.location.pathname.includes('citas.html')) {
        cargarCitas();
        actualizarEstadisticas();
    }
});

function cargarCitasDeStorage() {
    const citasGuardadas = localStorage.getItem('citas');
    if (citasGuardadas) {
        citas = JSON.parse(citasGuardadas);
        citaIdCounter = citas.length > 0 ? Math.max(...citas.map(c => c.id)) + 1 : 1;
    }
}

function guardarCitasEnStorage() {
    localStorage.setItem('citas', JSON.stringify(citas));
}


function handleReservaSubmit(e) {
    e.preventDefault();

    if (!e.target.checkValidity()) {
        e.stopPropagation();
        e.target.classList.add('was-validated');
        return;
    }

    const nuevaCita = {
        id: citaIdCounter++,
        nombre: document.getElementById('nombre').value,
        dni: document.getElementById('dni').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        especialidad: document.getElementById('especialidad').value,
        doctor: document.getElementById('doctor').value || 'Por asignar',
        fecha: document.getElementById('fecha').value,
        hora: document.getElementById('hora').value,
        motivo: document.getElementById('motivo').value || 'Consulta general',
        estado: 'Pendiente'
    };

    citas.push(nuevaCita);
    guardarCitasEnStorage();

    mostrarConfirmacionReserva(nuevaCita);

    e.target.reset();
    e.target.classList.remove('was-validated');
}

function mostrarConfirmacionReserva(cita) {
    const modalHtml = `
        <div class="alert alert-success">
            <i class="bi bi-check-circle me-2"></i>
            Su cita ha sido reservada exitosamente
        </div>
        <p><strong>Paciente:</strong> ${cita.nombre}</p>
        <p><strong>DNI:</strong> ${cita.dni}</p>
        <p><strong>Especialidad:</strong> ${cita.especialidad}</p>
        <p><strong>Doctor:</strong> ${cita.doctor}</p>
        <p><strong>Fecha:</strong> ${formatearFecha(cita.fecha)}</p>
        <p><strong>Hora:</strong> ${cita.hora}</p>
        <p><strong>Código de Cita:</strong> <span class="badge bg-primary">CITA-${String(cita.id).padStart(4, '0')}</span></p>
    `;
    
    document.getElementById('confirmacionDetalle').innerHTML = modalHtml;
    
    const modal = new bootstrap.Modal(document.getElementById('confirmacionModal'));
    modal.show();
}

function actualizarDoctores() {
    const especialidad = document.getElementById('especialidad').value;
    const doctorSelect = document.getElementById('doctor');

    doctorSelect.innerHTML = '<option value="">Cualquier doctor disponible</option>';

    if (especialidad && doctoresPorEspecialidad[especialidad]) {
        doctoresPorEspecialidad[especialidad].forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor;
            option.textContent = doctor;
            doctorSelect.appendChild(option);
        });
    }
}


function cargarCitas() {
    const tablaCitas = document.getElementById('tablaCitas');
    const noCitasMessage = document.getElementById('noCitasMessage');
    
    if (!tablaCitas) return;
    
    if (citas.length === 0) {
        tablaCitas.parentElement.style.display = 'none';
        if (noCitasMessage) noCitasMessage.style.display = 'block';
        return;
    }
    
    tablaCitas.parentElement.style.display = 'table';
    if (noCitasMessage) noCitasMessage.style.display = 'none';

    tablaCitas.innerHTML = citas.map((cita, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${cita.nombre}</td>
            <td>${cita.dni}</td>
            <td>${cita.especialidad}</td>
            <td>${cita.doctor}</td>
            <td>${formatearFecha(cita.fecha)}</td>
            <td>${cita.hora}</td>
            <td>${getEstadoBadge(cita.estado)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="verDetallesCita(${cita.id})">
                    <i class="bi bi-eye"></i>
                </button>
                ${cita.estado === 'Pendiente' ? `
                    <button class="btn btn-sm btn-outline-danger" onclick="cancelarCita(${cita.id})">
                        <i class="bi bi-x-circle"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

function getEstadoBadge(estado) {
    const badges = {
        'Pendiente': '<span class="badge bg-warning">Pendiente</span>',
        'Confirmada': '<span class="badge bg-info">Confirmada</span>',
        'Completada': '<span class="badge bg-success">Completada</span>',
        'Cancelada': '<span class="badge bg-danger">Cancelada</span>'
    };
    return badges[estado] || '<span class="badge bg-secondary">Desconocido</span>';
}

function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', opciones);
}


function actualizarEstadisticas() {
    const totalCitas = document.getElementById('totalCitas');
    const citasPendientes = document.getElementById('citasPendientes');
    const citasCompletadas = document.getElementById('citasCompletadas');
    const citasCanceladas = document.getElementById('citasCanceladas');
    
    if (totalCitas) totalCitas.textContent = citas.length;
    if (citasPendientes) citasPendientes.textContent = citas.filter(c => c.estado === 'Pendiente').length;
    if (citasCompletadas) citasCompletadas.textContent = citas.filter(c => c.estado === 'Completada').length;
    if (citasCanceladas) citasCanceladas.textContent = citas.filter(c => c.estado === 'Cancelada').length;
}


function filtrarCitas() {
    const busqueda = document.getElementById('buscarPaciente').value.toLowerCase();
    const especialidad = document.getElementById('filtroEspecialidad').value;
    const fecha = document.getElementById('filtroFecha').value;
    
    let citasFiltradas = [...citas];

    if (busqueda) {
        citasFiltradas = citasFiltradas.filter(cita => 
            cita.nombre.toLowerCase().includes(busqueda) ||
            cita.dni.includes(busqueda)
        );
    }

    if (especialidad) {
        citasFiltradas = citasFiltradas.filter(cita => cita.especialidad === especialidad);
    }
    
    if (fecha) {
        citasFiltradas = citasFiltradas.filter(cita => cita.fecha === fecha);
    }

    mostrarCitasFiltradas(citasFiltradas);
}

function mostrarCitasFiltradas(citasFiltradas) {
    const tablaCitas = document.getElementById('tablaCitas');
    
    if (citasFiltradas.length === 0) {
        tablaCitas.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-4">
                    No se encontraron citas con los filtros aplicados
                </td>
            </tr>
        `;
        return;
    }
    
    tablaCitas.innerHTML = citasFiltradas.map((cita, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${cita.nombre}</td>
            <td>${cita.dni}</td>
            <td>${cita.especialidad}</td>
            <td>${cita.doctor}</td>
            <td>${formatearFecha(cita.fecha)}</td>
            <td>${cita.hora}</td>
            <td>${getEstadoBadge(cita.estado)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="verDetallesCita(${cita.id})">
                    <i class="bi bi-eye"></i>
                </button>
                ${cita.estado === 'Pendiente' ? `
                    <button class="btn btn-sm btn-outline-danger" onclick="cancelarCita(${cita.id})">
                        <i class="bi bi-x-circle"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

function limpiarFiltros() {
    document.getElementById('buscarPaciente').value = '';
    document.getElementById('filtroEspecialidad').value = '';
    document.getElementById('filtroFecha').value = '';
    cargarCitas();
}


function verDetallesCita(id) {
    const cita = citas.find(c => c.id === id);
    if (!cita) return;
    
    alert(`
        DETALLES DE LA CITA
        -------------------
        Código: CITA-${String(cita.id).padStart(4, '0')}
        Paciente: ${cita.nombre}
        DNI: ${cita.dni}
        Email: ${cita.email}
        Teléfono: ${cita.telefono}
        Especialidad: ${cita.especialidad}
        Doctor: ${cita.doctor}
        Fecha: ${formatearFecha(cita.fecha)}
        Hora: ${cita.hora}
        Motivo: ${cita.motivo}
        Estado: ${cita.estado}
    `);
}

function cancelarCita(id) {
    if (!confirm('¿Está seguro que desea cancelar esta cita?')) return;
    
    const index = citas.findIndex(c => c.id === id);
    if (index !== -1) {
        citas[index].estado = 'Cancelada';
        guardarCitasEnStorage();
        cargarCitas();
        actualizarEstadisticas();
        alert('Cita cancelada correctamente');
    }
}


function reservarEspecialidad(especialidad) {
    sessionStorage.setItem('especialidadSeleccionada', especialidad);
    window.location.href = 'reserva.html';
}

window.addEventListener('load', function() {
    const especialidadSeleccionada = sessionStorage.getItem('especialidadSeleccionada');
    if (especialidadSeleccionada && document.getElementById('especialidad')) {
        document.getElementById('especialidad').value = especialidadSeleccionada;
        actualizarDoctores();
        sessionStorage.removeItem('especialidadSeleccionada');
    }
});


const dniInput = document.getElementById('dni');
if (dniInput) {
    dniInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
}

const telefonoInput = document.getElementById('telefono');
if (telefonoInput) {
    telefonoInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
}

console.log('Sistema de Citas Médicas cargado ✅');