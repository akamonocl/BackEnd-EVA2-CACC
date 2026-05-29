// PROPIEDADES.JS - Listado de propiedades  //

let paginaActual = 1;
let filtrosActuales = {};

function cargarPropiedades(pagina = 1) {
    paginaActual = pagina;
    
    const tipo = document.getElementById('filterTipo')?.value || '';
    const operacion = document.getElementById('filterOperacion')?.value || '';
    const ubicacion = document.getElementById('filterUbicacion')?.value || '';
    
    filtrosActuales = { tipo, operacion, ubicacion };
    
    const params = new URLSearchParams();
    params.append('pagina', pagina);
    if (tipo) params.append('tipo', tipo);
    if (operacion) params.append('operacion', operacion);
    if (ubicacion) params.append('ubicacion', ubicacion);
    
    fetch(`backend/listarPropiedades.php?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
            const grid = document.getElementById('propiedadesGrid');
            if (!grid) return;
            
            if (data.data.length === 0) {
                grid.innerHTML = '<div style="text-align:center; padding:40px;">No se encontraron propiedades</div>';
                document.getElementById('pagination').innerHTML = '';
                return;
            }
            
            grid.innerHTML = '';
            data.data.forEach(prop => {
                const precio = prop.precio_uf ? 'UF ' + prop.precio_uf : '$' + Number(prop.precio_clp).toLocaleString();
                const imagen = prop.imagen_principal || 'https://via.placeholder.com/400x200?text=PNK+Inmobiliaria';
                
                grid.innerHTML += `
                    <div class="property-card" onclick="window.location.href='propiedad-detalle.html?id=${prop.id}'">
                        <div class="property-image" style="background-image: url('${imagen}')">
                            <div class="property-price">${precio}</div>
                        </div>
                        <div class="property-info">
                            <div class="property-title">${prop.tipo || 'Propiedad'}</div>
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
            
            // Paginación
            const pagination = document.getElementById('pagination');
            if (pagination && data.total_paginas > 1) {
                pagination.innerHTML = '';
                for (let i = 1; i <= data.total_paginas; i++) {
                    pagination.innerHTML += `<button onclick="cargarPropiedades(${i})" style="background: ${i === paginaActual ? '#1a2a6c' : 'white'}; color: ${i === paginaActual ? 'white' : '#333'}; margin: 0 5px; padding: 8px 15px; border: none; border-radius: 8px; cursor: pointer;">${i}</button>`;
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const grid = document.getElementById('propiedadesGrid');
            if (grid) grid.innerHTML = '<div style="text-align:center; padding:40px;">Error al cargar propiedades</div>';
        });
}

function buscarPropiedades() {
    cargarPropiedades(1);
}

// Cargar filtros desde URL
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tipo')) document.getElementById('filterTipo').value = urlParams.get('tipo');
    if (urlParams.get('categoria')) document.getElementById('filterTipo').value = urlParams.get('categoria');
    if (urlParams.get('ubicacion')) document.getElementById('filterUbicacion').value = urlParams.get('ubicacion');
    
    cargarPropiedades(1);
});