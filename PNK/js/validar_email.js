// VALIDACIÓN DE CORREO ELECTRÓNICO //

/**
 * Valida un correo electrónico según los requisitos:
 * - Solo 1 símbolo @ (2 pts)
 * - Mínimo 3 caracteres antes del símbolo @
 * - Al menos 1 punto después del símbolo @
 * 
 * @param {string} email - Correo electrónico a validar
 * @returns {boolean} - true si es válido, false en caso contrario
 */
function validarEmail(email) {
    // Verificar que no sea nulo o vacío
    if (!email || email.trim() === '') {
        return false;
    }
    
    // Limpiar espacios
    email = email.trim();
    
    // ========== 1. SOLO 1 SÍMBOLO @ ==========
    const partes = email.split('@');
    
    // Debe haber exactamente 2 partes (una antes y una después del @)
    if (partes.length !== 2) {
        return false;
    }
    
    const antesDelArroba = partes[0];
    const despuesDelArroba = partes[1];
    
    // Validar que no haya @ vacío (ej: "@dominio.com" o "usuario@")
    if (antesDelArroba === '' || despuesDelArroba === '') {
        return false;
    }
    
    // ========== 2. MÍNIMO 3 CARACTERES ANTES DEL @ ==========
    if (antesDelArroba.length < 3) {
        return false;
    }
    
    // ========== 3. AL MENOS 1 PUNTO DESPUÉS DEL @ ==========
    if (!despuesDelArroba.includes('.')) {
        return false;
    }
    
    // Validar que el punto no esté al inicio o al final del dominio
    if (despuesDelArroba.startsWith('.') || despuesDelArroba.endsWith('.')) {
        return false;
    }
    
    // Validar que después del punto haya al menos 2 caracteres (dominio válido)
    const partesDominio = despuesDelArroba.split('.');
    if (partesDominio.length < 2) {
        return false;
    }
    
    // Validar que la última parte del dominio tenga al menos 2 caracteres
    const ultimaParte = partesDominio[partesDominio.length - 1];
    if (ultimaParte.length < 2) {
        return false;
    }
    
    return true;
}

// ========== FUNCIÓN CON MENSAJES DETALLADOS ==========
/**
 * Valida el correo y devuelve un objeto con el resultado y el mensaje de error
 * @param {string} email - Correo a validar
 * @returns {object} - { isValid: boolean, error: string }
 */
function validarEmailConMensaje(email) {
    if (!email || email.trim() === '') {
        return { isValid: false, error: 'El correo electrónico es obligatorio' };
    }
    
    email = email.trim();
    
    // Validar solo 1 @
    const partes = email.split('@');
    if (partes.length !== 2) {
        return { isValid: false, error: 'El correo debe contener solo un símbolo @' };
    }
    
    const antesDelArroba = partes[0];
    const despuesDelArroba = partes[1];
    
    if (antesDelArroba === '') {
        return { isValid: false, error: 'No hay texto antes del @' };
    }
    
    if (despuesDelArroba === '') {
        return { isValid: false, error: 'No hay texto después del @' };
    }
    
    // Validar mínimo 3 caracteres antes del @
    if (antesDelArroba.length < 3) {
        return { isValid: false, error: 'Debe tener al menos 3 caracteres antes del @' };
    }
    
    // Validar al menos 1 punto después del @
    if (!despuesDelArroba.includes('.')) {
        return { isValid: false, error: 'Debe contener al menos un punto después del @' };
    }
    
    // Validar que el punto no esté al inicio o final
    if (despuesDelArroba.startsWith('.')) {
        return { isValid: false, error: 'El dominio no puede comenzar con un punto' };
    }
    
    if (despuesDelArroba.endsWith('.')) {
        return { isValid: false, error: 'El dominio no puede terminar con un punto' };
    }
    
    // Validar extensión del dominio
    const partesDominio = despuesDelArroba.split('.');
    if (partesDominio.length < 2) {
        return { isValid: false, error: 'El dominio debe tener al menos un punto' };
    }
    
    const ultimaParte = partesDominio[partesDominio.length - 1];
    if (ultimaParte.length < 2) {
        return { isValid: false, error: 'La extensión del dominio es demasiado corta (ej: .com, .cl)' };
    }
    
    return { isValid: true, error: null };
}

// ========== VALIDACIÓN EN TIEMPO REAL PARA INPUT ==========
/**
 * Actualiza la interfaz mostrando si el correo es válido o no
 * @param {HTMLInputElement} inputElement - El elemento input del correo
 */
function actualizarValidacionCorreo(inputElement) {
    const email = inputElement.value;
    const resultado = validarEmailConMensaje(email);
    
    // Crear o actualizar mensaje de validación
    let mensajeDiv = document.getElementById('emailValidationMessage');
    if (!mensajeDiv) {
        mensajeDiv = document.createElement('div');
        mensajeDiv.id = 'emailValidationMessage';
        mensajeDiv.style.fontSize = '12px';
        mensajeDiv.style.marginTop = '5px';
        inputElement.parentNode.appendChild(mensajeDiv);
    }
    
    if (email === '') {
        mensajeDiv.innerHTML = '';
        inputElement.classList.remove('valid', 'invalid');
    } else if (resultado.isValid) {
        mensajeDiv.innerHTML = '<i class="fas fa-check-circle" style="color: #28a745;"></i> Correo válido';
        mensajeDiv.style.color = '#28a745';
        inputElement.classList.remove('invalid');
        inputElement.classList.add('valid');
    } else {
        mensajeDiv.innerHTML = `<i class="fas fa-times-circle" style="color: #e74c3c;"></i> ${resultado.error}`;
        mensajeDiv.style.color = '#e74c3c';
        inputElement.classList.remove('valid');
        inputElement.classList.add('invalid');
    }
}