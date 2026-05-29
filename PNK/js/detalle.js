// DETALLE.JS - Detalle de propiedad    //

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

if (!id) {
    window.location.href = 'propiedades.html';
}

function cargarDetalle() {
    fetch(`backend/detallePropiedad.php?id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                document.getElementById('detalleContainer').innerHTML = '<div style="text-align:center; padding:60px;">Propiedad no encontrada</div>';
                return;
            }
            
            const prop = data.data;
            const precio = prop.precio_uf ? 'UF ' + prop.precio_uf : '$' + Number(prop.precio_clp).toLocaleString();
            const imagen = prop.imagen_principal || 'https://via.placeholder.com/1100x400?text=PNK+Inmobiliaria';
            
            let galeriaHtml = '';
            if (prop.imagenes_lista && prop.imagenes_lista.length > 0) {
                galeriaHtml = '<div style="display: flex; gap: 10px; margin-top: 15px; overflow-x: auto;">';
                prop.imagenes_lista.forEach(img => {
                    galeriaHtml += `<img src="${img}" style="width: 100px; height: 80px; object-fit: cover; border-radius: 8px; cursor: pointer;" onclick="window.open('${img}')">`;
                });
                galeriaHtml += '</div>';
            }
            
            let caracteristicasHtml = '';
            if (prop.bodega) caracteristicasHtml += '<li>✅ Bodega</li>';
            if (prop.estacionamiento > 0) caracteristicasHtml += `<li>🚗 ${prop.estacionamiento} Estacionamiento(s)</li>`;
            if (prop.cocina_amoblada) caracteristicasHtml += '<li>🍳 Cocina amoblada</li>';
            if (prop.piscina) caracteristicasHtml += '<li>🏊 Piscina</li>';
            
            const container = document.getElementById('detalleContainer');
            container.innerHTML = `
                <div class="main-image" style="background-image: url('${imagen}'); height: 400px; background-size: cover; background-position: center;"></div>
                ${galeriaHtml}
                <div class="detail-content" style="padding: 30px;">
                    <div class="price" style="font-size: 2rem; color: #1a2a6c; font-weight: bold;">${precio}</div>
                    <div class="title" style="font-size: 1.5rem; margin: 10px 0;">${prop.tipo || 'Propiedad'} en ${prop.comuna || 'Chile'}</div>
                    <div class="location" style="color: #666; margin-bottom: 20px;"><i class="fas fa-map-marker-alt"></i> ${prop.comuna || ''}, ${prop.provincia || ''} - ${prop.sector || ''}</div>
                    <div class="features" style="display: flex; gap: 30px; padding: 20px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; margin-bottom: 20px;">
                        <div style="text-align: center;"><i class="fas fa-bed" style="font-size: 1.5rem;"></i><br>${prop.dormitorios || 0} Dormitorios</div>
                        <div style="text-align: center;"><i class="fas fa-bath" style="font-size: 1.5rem;"></i><br>${prop.banos || 0} Baños</div>
                        <div style="text-align: center;"><i class="fas fa-ruler-combined" style="font-size: 1.5rem;"></i><br>${prop.area_terreno || 0} m²</div>
                        <div style="text-align: center;"><i class="fas fa-building" style="font-size: 1.5rem;"></i><br>${prop.area_construida || 0} m² constr.</div>
                    </div>
                    <div class="description" style="margin-bottom: 20px;">
                        <h3>Descripción</h3>
                        <p>${prop.descripcion || 'Sin descripción disponible.'}</p>
                    </div>
                    ${caracteristicasHtml ? `<div class="features-list" style="margin-bottom: 20px;"><h3>Características</h3><ul>${caracteristicasHtml}</ul></div>` : ''}
                    <button class="contact-btn" onclick="contactar()" style="background: #fdbb4d; color: #1a2a6c; border: none; padding: 15px 30px; border-radius: 50px; font-size: 1rem; font-weight: bold; cursor: pointer; width: 100%;">
                        <i class="fas fa-phone"></i> Solicitar más información
                    </button>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('detalleContainer').innerHTML = '<div style="text-align:center; padding:60px;">Error al cargar la propiedad</div>';
        });
}

function contactar() {
    Swal.fire({
        title: 'Contactar a PNK Inmobiliaria',
        text: 'Déjanos tus datos y te contactaremos',
        icon: 'info',
        confirmButtonText: 'Solicitar contacto'
    });
}

cargarDetalle();