<?php
// ============================================
// REGISTRO DE NUEVO USUARIO (GESTOR)
// Recibe los datos del formulario y los inserta en la BD
// ============================================

// Configuración de cabeceras
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Incluir conexión a la base de datos
require_once 'conexion.php';

$response = ['success' => false, 'error' => ''];

try {
    // ========== 1. VALIDAR QUE SE RECIBIERON LOS DATOS ==========
    $campos_requeridos = ['rut', 'nombreCompleto', 'fechaNacimiento', 'correo', 'contrasena', 'sexo', 'telefono'];
    
    foreach ($campos_requeridos as $campo) {
        if (!isset($_POST[$campo]) || empty($_POST[$campo])) {
            throw new Exception("El campo $campo es obligatorio");
        }
    }
    
    // ========== 2. VALIDAR RUT (del lado del servidor) ==========
    function validarRUT($rut) {
        $rut = preg_replace('/[^k0-9]/i', '', $rut);
        $dv = substr($rut, -1);
        $numero = substr($rut, 0, -1);
        $suma = 0;
        $multiplo = 2;
        
        for ($i = strlen($numero) - 1; $i >= 0; $i--) {
            $suma += $numero[$i] * $multiplo;
            $multiplo = $multiplo < 7 ? $multiplo + 1 : 2;
        }
        
        $dv_esperado = 11 - ($suma % 11);
        $dv_esperado = $dv_esperado == 11 ? '0' : ($dv_esperado == 10 ? 'K' : (string)$dv_esperado);
        
        return strtoupper($dv) === $dv_esperado;
    }
    
    if (!validarRUT($_POST['rut'])) {
        throw new Exception('RUT inválido');
    }
    
    // ========== 3. VALIDAR CORREO ==========
    if (!filter_var($_POST['correo'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Correo electrónico inválido');
    }
    
    // ========== 4. VALIDAR TELÉFONO (9 dígitos) ==========
    if (!preg_match('/^\d{9}$/', $_POST['telefono'])) {
        throw new Exception('El teléfono debe tener 9 dígitos numéricos');
    }
    
    // ========== 5. VALIDAR CONTRASEÑA ROBUSTA ==========
    $password = $_POST['contrasena'];
    if (strlen($password) < 8 || 
        !preg_match('/[A-Z]/', $password) || 
        !preg_match('/[a-z]/', $password) || 
        !preg_match('/[!@#$%^&*]/', $password)) {
        throw new Exception('La contraseña debe tener mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 carácter especial');
    }
    
    // ========== 6. VERIFICAR SI EL RUT O CORREO YA EXISTEN ==========
    $check = $conn->prepare("SELECT id FROM gestores WHERE rut = ? OR correo = ?");
    $check->bind_param("ss", $_POST['rut'], $_POST['correo']);
    $check->execute();
    $result = $check->get_result();
    
    if ($result->num_rows > 0) {
        throw new Exception('Ya existe un usuario con ese RUT o correo electrónico');
    }
    $check->close();
    
    // ========== 7. PROCESAR CERTIFICADO PDF ==========
    $certificado_path = '';
    if (isset($_FILES['certificado']) && $_FILES['certificado']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = '../uploads/certificados/';
        
        // Crear directorio si no existe
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        // Validar que sea PDF
        $extension = strtolower(pathinfo($_FILES['certificado']['name'], PATHINFO_EXTENSION));
        if ($extension !== 'pdf') {
            throw new Exception('El certificado debe ser un archivo PDF');
        }
        
        // Validar tamaño máximo (5MB)
        if ($_FILES['certificado']['size'] > 5 * 1024 * 1024) {
            throw new Exception('El certificado no debe superar los 5MB');
        }
        
        // Generar nombre único
        $nombre_archivo = time() . '_' . preg_replace('/[^a-zA-Z0-9]/', '_', $_FILES['certificado']['name']);
        $certificado_path = 'uploads/certificados/' . $nombre_archivo;
        $ruta_completa = '../' . $certificado_path;
        
        if (!move_uploaded_file($_FILES['certificado']['tmp_name'], $ruta_completa)) {
            throw new Exception('Error al subir el certificado');
        }
    } else {
        throw new Exception('Debe adjuntar el certificado PDF');
    }
    
    // ========== 8. ENCRIPTAR CONTRASEÑA ==========
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    
    // ========== 9. INSERTAR EN LA BASE DE DATOS ==========
    $stmt = $conn->prepare("INSERT INTO gestores (
        rut, 
        nombre_completo, 
        fecha_nacimiento, 
        correo, 
        contrasena, 
        sexo, 
        telefono, 
        certificado_pdf, 
        rol, 
        estado, 
        created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'gestor', 1, NOW())");
    
    $stmt->bind_param(
        "ssssssss",
        $_POST['rut'],
        $_POST['nombreCompleto'],
        $_POST['fechaNacimiento'],
        $_POST['correo'],
        $hashed_password,
        $_POST['sexo'],
        $_POST['telefono'],
        $certificado_path
    );
    
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Usuario registrado correctamente';
        $response['id'] = $stmt->insert_id;
    } else {
        $response['error'] = 'Error al insertar: ' . $stmt->error;
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    $response['error'] = $e->getMessage();
}

// ========== 10. RESPONDER AL CLIENTE ==========
echo json_encode($response);
$conn->close();
?>