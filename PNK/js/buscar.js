// Buscar. JS !!!1 ////


function buscarAvanzado() {
    const params = new URLSearchParams();
    
    const palabra = document.getElementById('palabraClave')?.value;
    const tipo = document.getElementById('filtroTipo')?.value;
    const operacion = document.getElementById('filtroOperacion')?.value;
    const comuna = document.getElementById('filtroComuna')?.value;
    const provincia = document.getElementById('filtroProvincia')?.value;
    const precioMin = document.getElementById('precioMin')?.value;
    const precioMax = document.getElementById('precioMax')?.value;
    const dormitorios = document.getElementById('filtroDorm')?.value;
    
    if (palabra) params.append('palabra', palabra);
    if (tipo) params.append('tipo', tipo);
    if (operacion) params.append('operacion', operacion);
    if (comuna) params.append('comuna', comuna);
    if (provincia) params.append('provincia', provincia);
    if (precioMin) params.append('precio_min', precioMin);
    if (precioMax) params.append('precio_max', precioMax);
    if (dormitorios) params.append('dormitorios', dormitorios);
    
    fetch(`backend/buscarPropiedades.php?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('resultadosContainer');
            if (!container) return;
            
            if (data.length === 0) {
                container.innerHTML = '<div style="text-align:center; padding:40px;">🔍 No se encontraron propiedades con esos criterios</div>';
                return;
            }
            
            let html = '<div class="results-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px;">';
            data.forEach(prop => {
                const precio = prop.precio_uf ? 'UF ' + prop.precio_uf : '$' + Number(prop.precio_clp).toLocaleString();
                const imagen = prop.imagen_principal || 'https://via.placeholder.com/400x200?text=PNK+Inmobiliaria';
                
                html += `
                    <div class="property-card" onclick="window.location.href='propiedad-detalle.html?id=${prop.id}'" style="background: white; border-radius: 15px; overflow: hidden; cursor: pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.08);">
                        <div class="property-image" style="height: 200px; background-image: url('${imagen}'); background-size: cover; background-position: center; position: relative;">
                            <div class="property-price" style="position: absolute; bottom: 15px; right: 15px; background: #fdbb4d; padding: 5px 12px; border-radius: 20px; font-weight: bold;">${precio}</div>
                        </div>
                        <div class="property-info" style="padding: 15px;">
                            <div class="property-title" style="font-weight: 600;">${prop.tipo || 'Propiedad'} en ${prop.comuna || 'Chile'}</div>
                            <div class="property-location" style="color: #666; font-size: 0.85rem; margin: 5px 0;"><i class="fas fa-map-marker-alt"></i> ${prop.comuna || ''}, ${prop.provincia || ''}</div>
                            <div class="property-details" style="display: flex; gap: 15px; font-size: 0.8rem; color: #888;">
                                <span><i class="fas fa-bed"></i> ${prop.dormitorios || 0} dorm</span>
                                <span><i class="fas fa-bath"></i> ${prop.banos || 0} baños</span>
                                <span><i class="fas fa-ruler-combined"></i> ${prop.area_terreno || 0} m²</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            container.innerHTML = html;
        })
        .catch(error => {
            console.error('Error:', error);
            const container = document.getElementById('resultadosContainer');
            if (container) container.innerHTML = '<div style="text-align:center; padding:40px;">Error en la búsqueda</div>';
        });
}

// Cargar filtros desde URL
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tipo')) document.getElementById('filtroTipo').value = urlParams.get('tipo');
    if (urlParams.get('comuna')) document.getElementById('filtroComuna').value = urlParams.get('comuna');
    if (urlParams.get('ubicacion')) document.getElementById('filtroComuna').value = urlParams.get('ubicacion');
    
    if (urlParams.toString()) buscarAvanzado();
});