// HOME.JS - Página principal //

// Cargar propiedades destacadas
function cargarDestacadas() {
    fetch('backend/destacadas.php')
        .then(res => res.json())
        .then(data => {
            const grid = document.getElementById('propiedadesGrid');
            if (!grid) return;
            
            if (data.length === 0) {
                grid.innerHTML = '<div style="text-align:center; padding:40px;">No hay propiedades destacadas</div>';
                return;
            }
            
            grid.innerHTML = '';
            data.forEach(prop => {
                const precio = prop.precio_uf ? 'UF ' + prop.precio_uf : '$' + Number(prop.precio_clp).toLocaleString();
                const imagen = prop.imagen_principal || 'https://via.placeholder.com/400x200?text=PNK+Inmobiliaria';
                
                grid.innerHTML += `
                    <div class="property-card" onclick="window.location.href='propiedad-detalle.html?id=${prop.id}'">
                        <div class="property-image" style="background-image: url('${imagen}')">
                            <div class="property-price">${precio}</div>
                        </div>
                        <div class="property-info">
                            <div class="property-title">${prop.tipo || 'Propiedad'} en ${prop.comuna || 'Chile'}</div>
                            <div class="property-location"><i class="fas fa-map-marker-alt"></i> ${prop.comuna || ''}, ${prop.provincia || ''}</div>
                            <div class="property-details">
                                <span><i class="fas fa-bed"></i> ${prop.dormitorios || 0} dorm</span>
                                <span><i class="fas fa-bath"></i> ${prop.banos || 0} baños</span>
                                <span><i class="fas fa-ruler-combined"></i> ${prop.area_terreno || 0} m²</span>
                            </div>
                        </div>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error('Error:', error);
            const grid = document.getElementById('propiedadesGrid');
            if (grid) grid.innerHTML = '<div style="text-align:center; padding:40px;">Error al cargar propiedades</div>';
        });
}

// Buscar desde el home
function buscar() {
    const tipo = document.getElementById('searchTipo')?.value || '';
    const categoria = document.getElementById('searchCategoria')?.value || '';
    const ubicacion = document.getElementById('searchUbicacion')?.value || '';
    window.location.href = `propiedades.html?tipo=${tipo}&categoria=${categoria}&ubicacion=${ubicacion}`;
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    cargarDestacadas();
    
    const inputBusqueda = document.getElementById('searchUbicacion');
    if (inputBusqueda) {
        inputBusqueda.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') buscar();
        });
    }
});