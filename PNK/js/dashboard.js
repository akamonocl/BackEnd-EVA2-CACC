// DASHBOARD.JS - Panel de usuario  //

function cargarMisPropiedades() {
    fetch('backend/misPropiedades.php')
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector('#tablaPropiedades tbody');
            if (!tbody) return;
            
            if (!data.success || data.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No tienes propiedades publicadas</td></tr>';
                return;
            }
            
            tbody.innerHTML = '';
            data.data.forEach(prop => {
                tbody.innerHTML += `
                    <tr>
                        <td>${prop.tipo || '-'}</td>
                        <td>${prop.descripcion ? prop.descripcion.substring(0, 40) : '-'}</td>
                        <td>${prop.comuna || '-'}</td>
                        <td>${prop.precio_formateado || '-'}</td>
                        <td><span style="background:#27ae60; color:white; padding:2px 8px; border-radius:20px; font-size:12px;">Publicada</span></td>
                        <td>
                            <button class="btn-edit" onclick="editarPropiedad(${prop.id})"><i class="fas fa-edit"></i> Editar</button>
                            <button class="btn-delete" onclick="eliminarPropiedad(${prop.id})"><i class="fas fa-trash"></i> Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => {
            console.error('Error:', error);
            const tbody = document.querySelector('#tablaPropiedades tbody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Error al cargar propiedades</td></tr>';
        });
}

function editarPropiedad(id) {
    window.location.href = `editar-propiedad.html?id=${id}`;
}

function eliminarPropiedad(id) {
    Swal.fire({
        title: '¿Eliminar propiedad?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(result => {
        if (result.isConfirmed) {
            fetch(`backend/eliminarPropiedad.php?id=${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire('Eliminada', 'Propiedad eliminada correctamente', 'success');
                        cargarMisPropiedades();
                    } else {
                        Swal.fire('Error', data.error, 'error');
                    }
                })
                .catch(error => Swal.fire('Error', 'Error de conexión', 'error'));
        }
    });
}

function cerrarSesion() {
    Swal.fire({
        title: 'Cerrar sesión',
        text: '¿Estás seguro?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, salir'
    }).then(result => {
        if (result.isConfirmed) {
            fetch('backend/logout.php').then(() => window.location.href = 'index.html');
        }
    });
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    cargarMisPropiedades();
});