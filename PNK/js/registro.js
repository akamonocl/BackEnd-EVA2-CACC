// REGISTRO.JS - VALIDACIONES GESTOR INMOBILIARIO //

// ========== 1. VALIDAR RUT CHILENO (formato XX.XXX.XXX-X) ==========
function validarRUT(rut) {
    // Limpiar RUT (quitar puntos y guión)
    let rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');
    
    // Validar largo mínimo
    if (rutLimpio.length < 8 || rutLimpio.length > 9) return false;
    
    // Validar que solo tenga números y K al final
    if (!/^\d+[0-9Kk]$/.test(rutLimpio)) return false;
    
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();
    
    // Calcular dígito verificador
    let suma = 0;
    let multiplo = 2;
    
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplo;
        multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    
    return dv === dvCalculado;
}

//  2. VALIDAR CORREO ELECTRÓNICO (XXX@XXX.XX) //
function validarEmail(email) {
    // Formato: texto@texto.dominio
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

//  3. VALIDAR TELÉFONO (9 dígitos numéricos) //
function validarTelefono(telefono) {
    // Solo números, exactamente 9 dígitos
    const telefonoLimpio = telefono.replace(/\s/g, '');
    return /^\d{9}$/.test(telefonoLimpio);
}
//  4. VALIDAR CERTIFICADO PDF //
function validarCertificado(certificado) {
    if (!certificado) return false;
    // Validar que sea PDF
    if (certificado.type !== 'application/pdf') return false;
    // Validar tamaño máximo 5MB
    if (certificado.size > 5 * 1024 * 1024) return false;
    return true;
}

//  5. VALIDAR QUE TODOS LOS CAMPOS ESTÉN COMPLETOS //
function validarCamposCompletos() {
    const rut = document.getElementById('rut').value;
    const nombre = document.getElementById('nombreCompleto').value;
    const fechaNac = document.getElementById('fechaNacimiento').value;
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const sexo = document.getElementById('sexo').value;
    const telefono = document.getElementById('telefono').value;
    const certificado = document.getElementById('certificado').files[0];
    
    if (!rut) { Swal.fire('Error', 'El RUT es obligatorio', 'error'); return false; }
    if (!nombre) { Swal.fire('Error', 'El Nombre Completo es obligatorio', 'error'); return false; }
    if (!fechaNac) { Swal.fire('Error', 'La Fecha de Nacimiento es obligatoria', 'error'); return false; }
    if (!correo) { Swal.fire('Error', 'El Correo Electrónico es obligatorio', 'error'); return false; }
    if (!contrasena) { Swal.fire('Error', 'La Contraseña es obligatoria', 'error'); return false; }
    if (!sexo) { Swal.fire('Error', 'Debe seleccionar su sexo', 'error'); return false; }
    if (!telefono) { Swal.fire('Error', 'El Teléfono Móvil es obligatorio', 'error'); return false; }
    if (!certificado) { Swal.fire('Error', 'El Certificado de Antecedentes es obligatorio', 'error'); return false; }
    
    return true;
}

//  6. FORMATEAR RUT MIENTRAS SE ESCRIBE //
document.getElementById('rut')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\./g, '').replace(/-/g, '');
    if (value.length > 1) {
        if (value.length <= 8) {
            e.target.value = value.replace(/^(\d{1,2})(\d{3})(\d{3})$/, '$1.$2.$3');
        } else {
            e.target.value = value.replace(/^(\d{1,2})(\d{3})(\d{3})(\w{1})$/, '$1.$2.$3-$4');
        }
    }
});

//  7. VALIDAR CONTRASEÑA ROBUSTA (extra) //
function validarContrasenaRobusta(contrasena) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(contrasena);
}

//  8. ENVÍO DEL FORMULARIO CON TODAS LAS VALIDACIONES //
document.getElementById('formRegistro')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 1. Validar que todos los campos estén completos //
    if (!validarCamposCompletos()) {
        return;
    }
    
    // Obtener valores para validaciones específicas
    const rut = document.getElementById('rut').value;
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('telefono').value;
    const contrasena = document.getElementById('contrasena').value;
    const certificado = document.getElementById('certificado').files[0];
    
    // 2. Validar formato RUT (XX.XXX.XXX-X) 
    if (!validarRUT(rut)) {
        Swal.fire('Error', 'RUT inválido. El formato debe ser XX.XXX.XXX-X', 'error');
        return;
    }
    
    // 3. Validar estructura del correo electrónico (XXX@XXX.XX) 
    if (!validarEmail(correo)) {
        Swal.fire('Error', 'Correo electrónico inválido. El formato debe ser ejemplo@dominio.com', 'error');
        return;
    }
    
    // 4. Validar contraseña robusta (extra - opcional pero recomendado)//
    if (!validarContrasenaRobusta(contrasena)) {
        Swal.fire('Error', 'La contraseña debe tener:\n- Mínimo 8 caracteres\n- Al menos una mayúscula\n- Al menos una minúscula\n- Al menos un carácter especial (!@#$%^&*)', 'error');
        return;
    }
    
    // 5. Validar teléfono (9 dígitos numéricos) //
    if (!validarTelefono(telefono)) {
        Swal.fire('Error', 'Teléfono inválido. Debe tener 9 dígitos numéricos', 'error');
        return;
    }
    
    // 6. Validar que el archivo sea PDF //
    if (!validarCertificado(certificado)) {
        Swal.fire('Error', 'El certificado debe ser un archivo PDF válido (máximo 5MB)', 'error');
        return;
    }
    
    //  SI TODAS LAS VALIDACIONES PASAN //
    
    // Preparar FormData
    const formData = new FormData();
    formData.append('rut', rut);
    formData.append('nombreCompleto', document.getElementById('nombreCompleto').value);
    formData.append('fechaNacimiento', document.getElementById('fechaNacimiento').value);
    formData.append('correo', correo);
    formData.append('contrasena', contrasena);
    formData.append('sexo', document.getElementById('sexo').value);
    formData.append('telefono', telefono);
    formData.append('certificado', certificado);
    
    // Mostrar loading
    Swal.fire({
        title: 'Registrando...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    
    // Enviar al backend
    fetch('backend/registrarUsuario.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: '¡Registro exitoso!',
                text: 'Ahora puedes iniciar sesión',
                icon: 'success'
            }).then(() => window.location.href = 'login.html');
        } else {
            Swal.fire('Error', data.error || 'Error al registrar', 'error');
        }
    })
    .catch(error => {
        Swal.fire('Error', 'Error de conexión con el servidor', 'error');
        console.error('Error:', error);
    });
});

// VALIDACIÓN DE ARCHIVO PDF (5 PTS) //

function validarArchivoPDF(file) {
    // 1. Validar que NO esté vacío 
    if (!file) {
        return { isValid: false, error: 'No se ha seleccionado ningún archivo' };
    }
    
    // Validar nombre vacío
    if (!file.name || file.name === '') {
        return { isValid: false, error: 'El archivo no es válido' };
    }
    
    // 2. Validar que tenga extensión .pdf 
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (extension !== 'pdf') {
        return { 
            isValid: false, 
            error: `El archivo debe tener extensión .pdf. Extensión detectada: .${extension}` 
        };
    }
    
    // Validar tipo MIME
    if (file.type !== 'application/pdf') {
        return { 
            isValid: false, 
            error: 'El archivo no es un PDF válido' 
        };
    }
    
    return { isValid: true, error: null };
}

// Validación en tiempo real
document.getElementById('certificado')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const resultado = validarArchivoPDF(file);
    
    let mensajeDiv = document.getElementById('pdfValidationMessage');
    if (!mensajeDiv) {
        mensajeDiv = document.createElement('div');
        mensajeDiv.id = 'pdfValidationMessage';
        mensajeDiv.style.fontSize = '12px';
        mensajeDiv.style.marginTop = '5px';
        this.parentNode.appendChild(mensajeDiv);
    }
    
    if (!resultado.isValid) {
        mensajeDiv.innerHTML = `❌ ${resultado.error}`;
        mensajeDiv.style.color = '#e74c3c';
        this.value = '';
    } else {
        mensajeDiv.innerHTML = `✅ PDF válido: ${file.name}`;
        mensajeDiv.style.color = '#28a745';
    }
});

// VALIDACIÓN DE RUT CHILENO //

function validarRUTChileno(rut) {
    // Limpiar RUT
    let rutLimpio = rut.replace(/\./g, '').replace(/-/g, '').replace(/\s/g, '').toUpperCase();
    
    // Validar largo
    if (rutLimpio.length < 8 || rutLimpio.length > 9) return false;
    
    // Separar cuerpo y dígito verificador
    const cuerpo = rutLimpio.slice(0, -1);
    const dvIngresado = rutLimpio.slice(-1);
    
    // Validar que el cuerpo solo tenga números
    if (!/^\d+$/.test(cuerpo)) return false;
    
    // Validar dígito verificador
    if (!/^[0-9K]$/.test(dvIngresado)) return false;
    
    // Calcular dígito verificador esperado
    let suma = 0;
    let multiplo = 2;
    
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplo;
        multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    
    const resto = suma % 11;
    let dvEsperado = 11 - resto;
    
    if (dvEsperado === 11) dvEsperado = '0';
    else if (dvEsperado === 10) dvEsperado = 'K';
    else dvEsperado = dvEsperado.toString();
    
    return dvIngresado === dvEsperado;
}

// Formatear RUT mientras se escribe
function formatearRUTAlEscribir(rut) {
    let limpio = rut.replace(/\./g, '').replace(/-/g, '').replace(/\s/g, '');
    if (limpio.length < 2) return limpio;
    
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1).toUpperCase();
    
    let formateado = '';
    for (let i = cuerpo.length; i > 0; i -= 3) {
        const inicio = Math.max(0, i - 3);
        const segmento = cuerpo.slice(inicio, i);
        formateado = (formateado ? '.' : '') + segmento + formateado;
    }
    
    return `${formateado}-${dv}`;
}

// Evento para formatear RUT en tiempo real
document.getElementById('rut')?.addEventListener('input', function(e) {
    let value = e.target.value;
    let cursorPos = e.target.selectionStart;
    
    // Aplicar formato
    let formateado = formatearRUTAlEscribir(value);
    e.target.value = formateado;
    
    // Reajustar cursor
    let newCursorPos = cursorPos + (formateado.length - value.length);
    e.target.setSelectionRange(newCursorPos, newCursorPos);
});

// Validación de RUT en el envío
function validarRUTEnFormulario() {
    const rut = document.getElementById('rut').value;
    
    if (!rut) {
        Swal.fire('Error', 'El RUT es obligatorio', 'error');
        return false;
    }
    
    if (!validarRUTChileno(rut)) {
        Swal.fire('Error', 'RUT inválido. Formato: XX.XXX.XXX-X', 'error');
        return false;
    }
    
    return true;
};

// Mensajes de error, confirmación y advertencias   //
//  1. VALIDAR RUT CHILENO //
function validarRUT(rut) {
    let rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');
    if (rutLimpio.length < 8) return false;
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();
    let suma = 0, multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplo;
        multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    return dv === dvCalculado;
}

//  2. VALIDAR CORREO //
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

//  3. VALIDAR TELÉFONO //
function validarTelefono(telefono) {
    return /^\d{9}$/.test(telefono);
}

//  4. VALIDAR CONTRASEÑA ROBUSTA //
function validarContrasena(contrasena) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(contrasena);
}

//  5. VALIDAR ARCHIVO PDF //
function validarCertificado(certificado) {
    if (!certificado) return false;
    if (certificado.type !== 'application/pdf') return false;
    if (certificado.size > 5 * 1024 * 1024) return false;
    return true;
}

//  6. FORMATEAR RUT MIENTRAS SE ESCRIBE //
document.getElementById('rut')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\./g, '').replace(/-/g, '');
    if (value.length > 1) {
        if (value.length <= 8) {
            e.target.value = value.replace(/^(\d{1,2})(\d{3})(\d{3})$/, '$1.$2.$3');
        } else {
            e.target.value = value.replace(/^(\d{1,2})(\d{3})(\d{3})(\w{1})$/, '$1.$2.$3-$4');
        }
    }
});

//  7. FUNCIÓN PARA MOSTRAR ERROR (SweetAlert2) //
function mostrarError(mensaje) {
    Swal.fire({
        icon: 'error',
        title: '❌ Error de validación',
        text: mensaje,
        confirmButtonColor: '#e74c3c',
        confirmButtonText: 'Entendido',
        background: '#fff',
        backdrop: true
    });
}

//  8. FUNCIÓN PARA MOSTRAR ADVERTENCIA (SweetAlert2) //
function mostrarAdvertencia(mensaje) {
    Swal.fire({
        icon: 'warning',
        title: '⚠️ Campo requerido',
        text: mensaje,
        confirmButtonColor: '#fdbb4d',
        confirmButtonText: 'Completar',
        background: '#fff'
    });
}

//  9. FUNCIÓN PARA MOSTRAR CONFIRMACIÓN DE ÉXITO (SweetAlert2) //
function mostrarExito(mensaje, redireccion = null) {
    Swal.fire({
        icon: 'success',
        title: '✅ ¡Registro exitoso!',
        text: mensaje,
        confirmButtonColor: '#28a745',
        confirmButtonText: 'Ir al inicio de sesión',
        background: '#fff',
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed && redireccion) {
            window.location.href = redireccion;
        }
    });
}

//  10. FUNCIÓN PARA MOSTRAR LOADING //
function mostrarLoading() {
    Swal.fire({
        title: 'Procesando registro...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
}

//  11. CERRAR LOADING //
function cerrarLoading() {
    Swal.close();
}

//  12. VALIDACIÓN DE CAMPOS VACÍOS CON ADVERTENCIAS //
function validarCamposCompletos() {
    const rut = document.getElementById('rut').value;
    const nombre = document.getElementById('nombreCompleto').value;
    const fechaNac = document.getElementById('fechaNacimiento').value;
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const sexo = document.getElementById('sexo').value;
    const telefono = document.getElementById('telefono').value;
    const certificado = document.getElementById('certificado').files[0];
    
    if (!rut) { mostrarAdvertencia('El RUT es obligatorio'); return false; }
    if (!nombre) { mostrarAdvertencia('El Nombre Completo es obligatorio'); return false; }
    if (!fechaNac) { mostrarAdvertencia('La Fecha de Nacimiento es obligatoria'); return false; }
    if (!correo) { mostrarAdvertencia('El Correo Electrónico es obligatorio'); return false; }
    if (!contrasena) { mostrarAdvertencia('La Contraseña es obligatoria'); return false; }
    if (!sexo) { mostrarAdvertencia('Debe seleccionar su sexo'); return false; }
    if (!telefono) { mostrarAdvertencia('El Teléfono Móvil es obligatorio'); return false; }
    if (!certificado) { mostrarAdvertencia('El Certificado de Antecedentes es obligatorio'); return false; }
    
    return true;
}

//  13. ENVÍO DEL FORMULARIO CON SWEETALERT2 //
document.getElementById('formRegistro')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validar campos completos con advertencias//
    if (!validarCamposCompletos()) {
        return;
    }
    
    // Obtener valores
    const rut = document.getElementById('rut').value;
    const nombre = document.getElementById('nombreCompleto').value;
    const fechaNac = document.getElementById('fechaNacimiento').value;
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const sexo = document.getElementById('sexo').value;
    const telefono = document.getElementById('telefono').value;
    const certificado = document.getElementById('certificado').files[0];
    
    // Validar formato RUT
    if (!validarRUT(rut)) {
        mostrarError('RUT inválido. El formato debe ser XX.XXX.XXX-X');
        return;
    }
    
    // Validar correo electrónico
    if (!validarEmail(correo)) {
        mostrarError('Correo electrónico inválido. Formato: ejemplo@dominio.com');
        return;
    }
    
    // Validar contraseña robusta
    if (!validarContrasena(contrasena)) {
        mostrarError('La contraseña debe tener:\n- Mínimo 8 caracteres\n- Al menos una mayúscula\n- Al menos una minúscula\n- Al menos un carácter especial (!@#$%^&*)');
        return;
    }
    
    // Validar teléfono
    if (!validarTelefono(telefono)) {
        mostrarError('Teléfono inválido. Debe tener 9 dígitos numéricos');
        return;
    }
    
    // Validar certificado PDF
    if (!validarCertificado(certificado)) {
        mostrarError('El certificado debe ser un archivo PDF válido (máximo 5MB)');
        return;
    }
    
    // Preparar FormData
    const formData = new FormData();
    formData.append('rut', rut);
    formData.append('nombreCompleto', nombre);
    formData.append('fechaNacimiento', fechaNac);
    formData.append('correo', correo);
    formData.append('contrasena', contrasena);
    formData.append('sexo', sexo);
    formData.append('telefono', telefono);
    formData.append('certificado', certificado);
    
    // Mostrar loading
    mostrarLoading();
    
    // Enviar al backend
    fetch('backend/registrarUsuario.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        cerrarLoading();
        
        if (data.success) {
            // Confirmación de envío exitoso
            mostrarExito('Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.', 'login.html');
        } else {
            // Mensaje de error del servidor
            mostrarError(data.error || 'Error al registrar el usuario');
        }
    })
    .catch(error => {
        cerrarLoading();
        mostrarError('Error de conexión con el servidor. Intente nuevamente.');
        console.error('Error:', error);
    });
});
