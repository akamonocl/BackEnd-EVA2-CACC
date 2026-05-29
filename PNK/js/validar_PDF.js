// VALIDACIÓN DE ARCHIVO PDF //

/**
 * Valida que el archivo seleccionado sea un PDF válido
 * @param {File} file - El archivo seleccionado
 * @returns {object} - { isValid: boolean, error: string }
 */
function validarArchivoPDF(file) {
    // 1. Validar que NO esté vacío (2.5 pts)
    if (!file) {
        return {
            isValid: false,
            error: 'No se ha seleccionado ningún archivo'
        };
    }
    
    // Verificar que el archivo tenga nombre y tamaño
    if (file.name === undefined || file.name === '') {
        return {
            isValid: false,
            error: 'El archivo no es válido'
        };
    }
    
    // 2. Validar que tenga extensión .pdf (2.5 pts)
    // Obtener extensión del archivo
    const nombreArchivo = file.name;
    const extension = nombreArchivo.split('.').pop().toLowerCase();
    
    // Verificar extensión
    if (extension !== 'pdf') {
        return {
            isValid: false,
            error: 'El archivo debe tener extensión .pdf. Extensión detectada: .' + extension
        };
    }
    
    // Verificar el tipo MIME (doble validación)
    if (file.type !== 'application/pdf') {
        return {
            isValid: false,
            error: 'El archivo no es un PDF válido. Tipo detectado: ' + file.type
        };
    }
    
    // Validación adicional: tamaño máximo 5MB (opcional pero recomendado)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        return {
            isValid: false,
            error: 'El archivo PDF no debe superar los 5MB. Tamaño actual: ' + (file.size / 1024 / 1024).toFixed(2) + 'MB'
        };
    }
    
    // Si pasa todas las validaciones
    return {
        isValid: true,
        error: null
    };
}

document.getElementById('certificado')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const resultado = validarArchivoPDF(file);
    
    // Crear o actualizar mensaje de validación
    let mensajeDiv = document.getElementById('pdfValidationMessage');
    if (!mensajeDiv) {
        mensajeDiv = document.createElement('div');
        mensajeDiv.id = 'pdfValidationMessage';
        mensajeDiv.style.fontSize = '12px';
        mensajeDiv.style.marginTop = '5px';
        this.parentNode.appendChild(mensajeDiv);
    }
    
    if (!resultado.isValid) {
        mensajeDiv.innerHTML = `<i class="fas fa-times-circle" style="color: #e74c3c;"></i> ${resultado.error}`;
        mensajeDiv.style.color = '#e74c3c';
        this.value = ''; // Limpiar el input si es inválido
    } else {
        mensajeDiv.innerHTML = `<i class="fas fa-check-circle" style="color: #28a745;"></i> PDF válido: ${file.name}`;
        mensajeDiv.style.color = '#28a745';
    }
});

function validarPDFEnFormulario() {
    const certificado = document.getElementById('certificado').files[0];
    const resultado = validarArchivoPDF(certificado);
    
    if (!resultado.isValid) {
        Swal.fire('Error', resultado.error, 'error');
        return false;
    }
    return true;
}