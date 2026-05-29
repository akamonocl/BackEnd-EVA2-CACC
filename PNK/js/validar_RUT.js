// VALIDACIÓN DE RUT CHILENO (5 PTS)
// Incluye: formato, dígito verificador, validación completa
// ============================================

/**
 * Valida un RUT chileno completo incluyendo el dígito verificador
 * @param {string} rut - RUT a validar (puede venir con o sin puntos y guión)
 * @returns {boolean} - true si el RUT es válido, false en caso contrario
 * 
 * Ejemplos de formatos aceptados:
 * - "12.345.678-9"
 * - "12.345.678-K"
 * - "12345678-9"
 * - "12345678K"
 * - "12.345.678-9"
 */
function validarRUTChileno(rut) {
    // ========== 1. LIMPIAR EL RUT ==========
    // Eliminar puntos, guiones y espacios
    let rutLimpio = rut.replace(/\./g, '').replace(/-/g, '').replace(/\s/g, '');
    
    // Convertir a mayúsculas para estandarizar la K
    rutLimpio = rutLimpio.toUpperCase();
    
    // ========== 2. VALIDAR LARGO MÍNIMO Y MÁXIMO ==========
    // Un RUT chileno tiene entre 8 y 9 caracteres (7-8 números + 1 dígito verificador)
    if (rutLimpio.length < 8 || rutLimpio.length > 9) {
        return false;
    }
    
    // ========== 3. VALIDAR FORMATO (solo números y K al final) ==========
    // Debe terminar en número o K, y el resto deben ser números
    const cuerpo = rutLimpio.slice(0, -1);
    const dvIngresado = rutLimpio.slice(-1);
    
    // Validar que el cuerpo solo contenga números
    if (!/^\d+$/.test(cuerpo)) {
        return false;
    }
    
    // Validar que el dígito verificador sea número o K
    if (!/^[0-9K]$/.test(dvIngresado)) {
        return false;
    }
    
    // ========== 4. CALCULAR EL DÍGITO VERIFICADOR ==========
    let suma = 0;
    let multiplo = 2;
    
    // Recorrer el cuerpo del RUT de derecha a izquierda
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplo;
        multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    
    // Calcular dígito verificador esperado
    const resto = suma % 11;
    let dvEsperado = 11 - resto;
    
    // Convertir a valor correcto
    if (dvEsperado === 11) {
        dvEsperado = '0';
    } else if (dvEsperado === 10) {
        dvEsperado = 'K';
    } else {
        dvEsperado = dvEsperado.toString();
    }
    
    // ========== 5. COMPARAR DÍGITOS ==========
    return dvIngresado === dvEsperado;
}

// ========== FUNCIONES ADICIONALES ÚTILES ==========

/**
 * Formatea un RUT al formato XX.XXX.XXX-X
 * @param {string} rut - RUT sin formatear
 * @returns {string} - RUT formateado
 */
function formatearRUT(rut) {
    let rutLimpio = rut.replace(/\./g, '').replace(/-/g, '').replace(/\s/g, '');
    if (rutLimpio.length < 2) return rut;
    
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();
    
    // Aplicar formato de miles
    let cuerpoFormateado = '';
    for (let i = cuerpo.length; i > 0; i -= 3) {
        const inicio = Math.max(0, i - 3);
        const segmento = cuerpo.slice(inicio, i);
        cuerpoFormateado = (cuerpoFormateado ? '.' : '') + segmento + cuerpoFormateado;
    }
    
    return `${cuerpoFormateado}-${dv}`;
}

/**
 * Limpia un RUT (quita puntos, guiones y espacios)
 * @param {string} rut - RUT con formato
 * @returns {string} - RUT solo */
function limpiarRUT(rut) {
    return rut.replace(/\./g, '').replace(/-/g, '').replace(/\s/g, '').toUpperCase();
}

/**
 * Valida RUT y devuelve mensaje de error específico
 * @param {string} rut - RUT a validar
 * @returns {object} - { isValid: boolean, message: string }
 */
function validarRUTConMensaje(rut) {
    if (!rut || rut.trim() === '') {
        return { isValid: false, message: 'El RUT es obligatorio' };
    }
    
    const rutLimpio = limpiarRUT(rut);
    
    if (rutLimpio.length < 8) {
        return { isValid: false, message: 'El RUT es demasiado corto' };
    }
    
    if (rutLimpio.length > 9) {
        return { isValid: false, message: 'El RUT es demasiado largo' };
    }
    
    if (!validarRUTChileno(rut)) {
        return { isValid: false, message: 'RUT inválido. El dígito verificador no coincide' };
    }
    
    return { isValid: true, message: 'RUT válido' };
}