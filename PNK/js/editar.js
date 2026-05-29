// EDITAR.JS - Editar propiedad     //
const UF_VALUE = 36000;
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

if (!id) {
    window.location.href = 'dashboard.html';
}

// Cargar datos de la propiedad
function cargarPropiedad() {
    fetch(`backend/detallePropiedad.php?id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                Swal.fire('Error', 'Propiedad no encontrada', 'error').then(() => window.location.href = 'dashboard.html');
                return;
            }
            
            const prop = data.data;
            document.getElementById('propiedadId').value = prop.id;
            document.getElementById('tipoPropiedad').value = prop.tipo;
            document.getElementById('operacion').value = prop.operacion || 'Venta';
            document.getElementById('descripcion').value = prop.descripcion;
            document.getElementById('banos').value = prop.banos;
            document.getElementById('dormitorios').value = prop.dormitorios;
            document.getElementById('areaTerreno').value = prop.area_terreno;
            document.getElementById('areaConstruida').value = prop.area_construida;
            document.getElementById('precioCLP').value = prop.precio_clp;
            document.getElementById('precioUF').value = prop.precio_uf;
            document.getElementById('comuna').value = prop.comuna;
            document.getElementById('provincia').value = prop.provincia;
            document.getElementById('sector').value = prop.sector;
            document.getElementById('bodega').checked = prop.bodega == 1;
            document.getElementById('estacionamiento').value = prop.estacionamiento;
            document.getElementById('cocinaAmoblada').checked = prop.cocina_amoblada == 1;
            document.getElementById('piscina').checked = prop.piscina == 1;
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error al cargar la propiedad', 'error');
        });
}

// Cálculo de UF
document.getElementById('precioCLP')?.addEventListener('input', function() {
    const clp = parseFloat(this.value);
    if (!isNaN(clp) && clp > 0) {
        document.getElementById('precioUF').value = (clp / UF_VALUE).toFixed(2);
    }
});

// Enviar formulario
document.getElementById('formEditarPropiedad')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('id', document.getElementById('propiedadId').value);
    formData.append('tipoPropiedad', document.getElementById('tipoPropiedad').value);
    formData.append('operacion', document.getElementById('operacion').value);
    formData.append('descripcion', document.getElementById('descripcion').value);
    formData.append('banos', document.getElementById('banos').value || 0);
    formData.append('dormitorios', document.getElementById('dormitorios').value || 0);
    formData.append('areaTerreno', document.getElementById('areaTerreno').value || 0);
    formData.append('areaConstruida', document.getElementById('areaConstruida').value || 0);
    formData.append('precioCLP', document.getElementById('precioCLP').value || 0);
    formData.append('precioUF', document.getElementById('precioUF').value || 0);
    formData.append('comuna', document.getElementById('comuna').value || '');
    formData.append('provincia', document.getElementById('provincia').value || '');
    formData.append('sector', document.getElementById('sector').value || '');
    formData.append('bodega', document.getElementById('bodega').checked ? 1 : 0);
    formData.append('estacionamiento', document.getElementById('estacionamiento').value || 0);
    formData.append('cocinaAmoblada', document.getElementById('cocinaAmoblada').checked ? 1 : 0);
    formData.append('piscina', document.getElementById('piscina').checked ? 1 : 0);
    
    const imagenes = document.getElementById('imagenes')?.files;
    if (imagenes) {
        for (let i = 0; i < imagenes.length; i++) {
            formData.append('imagenes[]', imagenes[i]);
        }
    }
    
    Swal.fire({ title: 'Guardando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    
    fetch('backend/editarPropiedad.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            Swal.fire('¡Actualizada!', 'Propiedad actualizada correctamente', 'success')
                .then(() => window.location.href = 'dashboard.html');
        } else {
            Swal.fire('Error', data.error, 'error');
        }
    })
    .catch(error => Swal.fire('Error', 'Error de conexión', 'error'));
});

cargarPropiedad();