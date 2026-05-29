// PUBLICAR.JS - VALIDACIONES  + GALERÍA ////
const UF_VALUE = 36000;
const MAX_IMAGENES = 10;
let imagenesSeleccionadas = [];

//  1. CÁLCULO AUTOMÁTICO DE UF  ////
document.getElementById('precioCLP')?.addEventListener('input', function() {
    const clp = parseFloat(this.value);
    if (!isNaN(clp) && clp > 0) {
        document.getElementById('precioUF').value = (clp / UF_VALUE).toFixed(2);
    } else {
        document.getElementById('precioUF').value = '';
    }
});

//  2. FECHA POR DEFECTO (HOY) ////
const hoy = new Date().toISOString().split('T')[0];
if (document.getElementById('fechaPublicacion')) {
    document.getElementById('fechaPublicacion').value = hoy;
}

//  3. ACTUALIZAR CONTADOR DE IMÁGENES ////
function actualizarContador() {
    let contador = document.querySelector('.image-counter');
    if (!contador) {
        contador = document.createElement('div');
        contador.className = 'image-counter';
        const gallerySection = document.querySelector('.gallery-section');
        if (gallerySection) gallerySection.appendChild(contador);
    }
    const total = document.querySelectorAll('.image-container:not(.default)').length;
    contador.innerHTML = `<span>${total}</span> / ${MAX_IMAGENES} imágenes seleccionadas`;
    
    if (total >= MAX_IMAGENES) {
        contador.style.color = '#e74c3c';
    } else {
        contador.style.color = '#666';
    }
}

//  4. MARCAR IMAGEN PRINCIPAL //
function marcarImagenPrincipal() {
    const contenedores = document.querySelectorAll('.image-container:not(.default)');
    document.querySelectorAll('.gallery-image').forEach(img => {
        img.classList.remove('principal');
    });
    
    if (contenedores.length > 0) {
        const primeraImg = contenedores[0].querySelector('.gallery-image');
        if (primeraImg) primeraImg.classList.add('principal');
    }
}
//  5. ELIMINAR IMAGEN //
function eliminarImagen(container) {
    container.remove();
    actualizarContador();
    marcarImagenPrincipal();
    
    const imagenesRestantes = document.querySelectorAll('.image-container:not(.default)').length;
    if (imagenesRestantes === 0) {
        const preview = document.getElementById('galleryPreview');
        const defaultContainer = document.createElement('div');
        defaultContainer.className = 'image-container default';
        defaultContainer.setAttribute('data-default', 'true');
        defaultContainer.innerHTML = '<img src="https://via.placeholder.com/100x80?text=Foto+por+defecto" class="gallery-image default">';
        preview.appendChild(defaultContainer);
    }
}
//  6. AGREGAR IMAGEN AL PREVIEW //
function agregarImagenAlPreview(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.getElementById('galleryPreview');
            
            const defaultContainer = preview.querySelector('.image-container.default');
            if (defaultContainer && document.querySelectorAll('.image-container:not(.default)').length === 0) {
                defaultContainer.remove();
            }
            
            const container = document.createElement('div');
            container.className = 'image-container';
            
            const img = document.createElement('img');
            img.src = event.target.result;
            img.className = 'gallery-image';
            img.setAttribute('data-file', file.name);
            
            const btnRemove = document.createElement('button');
            btnRemove.innerHTML = '×';
            btnRemove.className = 'btn-remove-image';
            btnRemove.title = 'Eliminar imagen';
            btnRemove.onclick = () => eliminarImagen(container);
            
            container.appendChild(img);
            container.appendChild(btnRemove);
            preview.appendChild(container);
            
            actualizarContador();
            marcarImagenPrincipal();
            resolve();
        };
        reader.readAsDataURL(file);
    });
}

//  7. EVENTO DE SELECCIÓN DE IMÁGENES //
document.getElementById('imagenes')?.addEventListener('change', async function(e) {
    const files = Array.from(e.target.files);
    const imagenesActuales = document.querySelectorAll('.image-container:not(.default)').length;
    const totalFinal = imagenesActuales + files.length;
    
    if (totalFinal > MAX_IMAGENES) {
        Swal.fire('Error', `Máximo ${MAX_IMAGENES} imágenes permitidas. Actualmente tienes ${imagenesActuales} imágenes.`, 'error');
        this.value = '';
        return;
    }
    
    for (const file of files) {
        await agregarImagenAlPreview(file);
    }
    this.value = '';
});

//  8. VALIDAR GALERÍA //
function validarGaleria() {
    const totalImagenes = document.querySelectorAll('.image-container:not(.default)').length;
    if (totalImagenes === 0) {
        Swal.fire('Error', 'Debe agregar al menos 1 fotografía de la propiedad', 'error');
        return false;
    }
    if (totalImagenes > MAX_IMAGENES) {
        Swal.fire('Error', `Máximo ${MAX_IMAGENES} imágenes permitidas`, 'error');
        return false;
    }
    return true;
}

//  9. FUNCIÓN PRINCIPAL DE VALIDACIÓN  //
function validarFormularioPropiedad() {
    const tipoPropiedad = document.getElementById('tipoPropiedad')?.value;
    const descripcion = document.getElementById('descripcion')?.value.trim();
    const banos = document.getElementById('banos')?.value;
    const dormitorios = document.getElementById('dormitorios')?.value;
    const areaTerreno = document.getElementById('areaTerreno')?.value;
    const areaConstruida = document.getElementById('areaConstruida')?.value;
    const precioCLP = document.getElementById('precioCLP')?.value;
    const precioUF = document.getElementById('precioUF')?.value;
    const fechaPublicacion = document.getElementById('fechaPublicacion')?.value;
    const solicitarVisita = document.getElementById('solicitarVisita')?.value;
    const bodega = document.getElementById('bodega')?.checked;
    const estacionamiento = document.getElementById('estacionamiento')?.value;
    const logia = document.getElementById('logia')?.value;
    const cocinaAmoblada = document.getElementById('cocinaAmoblada')?.checked;
    const antejardin = document.getElementById('antejardin')?.value;
    const patioTrasero = document.getElementById('patioTrasero')?.value;
    const piscina = document.getElementById('piscina')?.checked;
    
    if (!tipoPropiedad) { Swal.fire('Error', 'Tipo de Propiedad es obligatorio', 'error'); return false; }
    if (!descripcion) { Swal.fire('Error', 'Descripción es obligatoria', 'error'); return false; }
    if (!banos && banos !== '0') { Swal.fire('Error', 'Cantidad de Baños es obligatoria', 'error'); return false; }
    if (isNaN(banos) || banos < 0) { Swal.fire('Error', 'Cantidad de Baños debe ser número válido', 'error'); return false; }
    if (!dormitorios && dormitorios !== '0') { Swal.fire('Error', 'Cantidad de Dormitorios es obligatoria', 'error'); return false; }
    if (isNaN(dormitorios) || dormitorios < 0) { Swal.fire('Error', 'Cantidad de Dormitorios debe ser número válido', 'error'); return false; }
    if (!areaTerreno && areaTerreno !== '0') { Swal.fire('Error', 'Área Total del Terreno es obligatoria', 'error'); return false; }
    if (isNaN(areaTerreno) || areaTerreno < 0) { Swal.fire('Error', 'Área Total del Terreno debe ser número válido', 'error'); return false; }
    if (!areaConstruida && areaConstruida !== '0') { Swal.fire('Error', 'Área Construida es obligatoria', 'error'); return false; }
    if (isNaN(areaConstruida) || areaConstruida < 0) { Swal.fire('Error', 'Área Construida debe ser número válido', 'error'); return false; }
    if (!precioCLP) { Swal.fire('Error', 'Precio en CLP es obligatorio', 'error'); return false; }
    if (isNaN(precioCLP) || precioCLP <= 0) { Swal.fire('Error', 'Precio en CLP debe ser mayor a 0', 'error'); return false; }
    if (!precioUF) { Swal.fire('Error', 'Precio en UF es obligatorio', 'error'); return false; }
    if (isNaN(precioUF) || precioUF <= 0) { Swal.fire('Error', 'Precio en UF debe ser número válido', 'error'); return false; }
    if (!fechaPublicacion) { Swal.fire('Error', 'Fecha de Publicación es obligatoria', 'error'); return false; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaPublicacion)) { Swal.fire('Error', 'Formato de fecha inválido', 'error'); return false; }
    if (!solicitarVisita) { Swal.fire('Error', 'Debe indicar si solicita visita', 'error'); return false; }
    if (bodega === undefined) { Swal.fire('Error', 'Debe especificar si tiene bodega', 'error'); return false; }
    if (estacionamiento === '' || estacionamiento === undefined) { Swal.fire('Error', 'Estacionamiento es obligatorio', 'error'); return false; }
    if (isNaN(estacionamiento) || estacionamiento < 0) { Swal.fire('Error', 'Estacionamiento debe ser número válido', 'error'); return false; }
    if (logia === '' || logia === undefined) { Swal.fire('Error', 'Logia es obligatoria', 'error'); return false; }
    if (isNaN(logia) || logia < 0) { Swal.fire('Error', 'Logia debe ser número válido', 'error'); return false; }
    if (cocinaAmoblada === undefined) { Swal.fire('Error', 'Debe especificar si tiene cocina amoblada', 'error'); return false; }
    if (antejardin === '' || antejardin === undefined) { Swal.fire('Error', 'Antejardín es obligatorio', 'error'); return false; }
    if (isNaN(antejardin) || antejardin < 0) { Swal.fire('Error', 'Antejardín debe ser número válido', 'error'); return false; }
    if (patioTrasero === '' || patioTrasero === undefined) { Swal.fire('Error', 'Patio trasero es obligatorio', 'error'); return false; }
    if (isNaN(patioTrasero) || patioTrasero < 0) { Swal.fire('Error', 'Patio trasero debe ser número válido', 'error'); return false; }
    if (piscina === undefined) { Swal.fire('Error', 'Debe especificar si tiene piscina', 'error'); return false; }
    
    return validarGaleria();
}

//  10. ENVÍO DEL FORMULARIO //
document.getElementById('formPropiedad')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validarFormularioPropiedad()) return;
    
    const formData = new FormData();
    formData.append('tipoPropiedad', document.getElementById('tipoPropiedad').value);
    formData.append('operacion', document.getElementById('operacion')?.value || 'Venta');
    formData.append('descripcion', document.getElementById('descripcion').value);
    formData.append('banos', document.getElementById('banos').value);
    formData.append('dormitorios', document.getElementById('dormitorios').value);
    formData.append('areaTerreno', document.getElementById('areaTerreno').value);
    formData.append('areaConstruida', document.getElementById('areaConstruida').value);
    formData.append('precioCLP', document.getElementById('precioCLP').value);
    formData.append('precioUF', document.getElementById('precioUF').value);
    formData.append('fechaPublicacion', document.getElementById('fechaPublicacion').value);
    formData.append('solicitarVisita', document.getElementById('solicitarVisita').value);
    formData.append('comuna', document.getElementById('comuna')?.value || '');
    formData.append('provincia', document.getElementById('provincia')?.value || '');
    formData.append('sector', document.getElementById('sector')?.value || '');
    formData.append('bodega', document.getElementById('bodega')?.checked ? 1 : 0);
    formData.append('estacionamiento', document.getElementById('estacionamiento')?.value || 0);
    formData.append('logia', document.getElementById('logia')?.value || 0);
    formData.append('cocinaAmoblada', document.getElementById('cocinaAmoblada')?.checked ? 1 : 0);
    formData.append('antejardin', document.getElementById('antejardin')?.value || 0);
    formData.append('patioTrasero', document.getElementById('patioTrasero')?.value || 0);
    formData.append('piscina', document.getElementById('piscina')?.checked ? 1 : 0);
    
    // Agregar imágenes desde el preview    //
    const contenedores = document.querySelectorAll('.image-container:not(.default)');
    contenedores.forEach((container, idx) => {
        const img = container.querySelector('.gallery-image');
        if (img && img.src && img.src.startsWith('data:image')) {
            fetch(img.src)
                .then(res => res.blob())
                .then(blob => {
                    formData.append('imagenes[]', blob, `imagen_${idx}.jpg`);
                });
        }
    });
    
    Swal.fire({ title: 'Publicando propiedad...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    
    fetch('backend/registrarPropiedad.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                Swal.fire('¡Publicada!', 'Propiedad publicada correctamente', 'success')
                    .then(() => window.location.href = 'dashboard.html');
            } else {
                Swal.fire('Error', data.error || 'Error al publicar', 'error');
            }
        })
        .catch(error => { Swal.fire('Error', 'Error de conexión', 'error'); console.error(error); });
});

//  11. INICIALIZAR GALERÍA //
function inicializarGaleria() {
    const preview = document.getElementById('galleryPreview');
    if (preview && preview.children.length === 0) {
        const defaultContainer = document.createElement('div');
        defaultContainer.className = 'image-container default';
        defaultContainer.setAttribute('data-default', 'true');
        defaultContainer.innerHTML = '<img src="https://via.placeholder.com/100x80?text=Foto+por+defecto" class="gallery-image default">';
        preview.appendChild(defaultContainer);
    }
    actualizarContador();
    marcarImagenPrincipal();
}

document.addEventListener('DOMContentLoaded', function() {
    inicializarGaleria();
});