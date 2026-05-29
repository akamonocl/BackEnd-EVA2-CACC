<?php

//       INICIO DE SESIÓN   //

session_start();
header('Content-Type: application/json');
require_once 'conexion.php';

$response = ['success' => false, 'error' => ''];

// Recibir datos  // Formulario JSON
$data = json_decode(file_get_contents('php://input'), true);

// Validar los datos recibidos  //
if (!isset($data['correo']) || !isset($data['password'])) {
    $response['error'] = 'Faltan datos: correo o contraseña';
    echo json_encode($response);
    exit;
}

$correo = trim($data['correo']);
$password = $data['password'];

// Buscar usuario en la BD   //
$stmt = $conn->prepare("SELECT id, nombre_completo, contrasena, rol, estado FROM gestores WHERE correo = ?");
$stmt->bind_param("s", $correo);
$stmt->execute();
$result = $stmt->get_result();

// Verificar si el usuario existe //
if ($result->num_rows === 0) {
    $response['error'] = 'Usuario no encontrado';
    echo json_encode($response);
    exit;
}

$usuario = $result->fetch_assoc();

// Verificar si el usuario está activo //
if ($usuario['estado'] != 1) {
    $response['error'] = 'Usuario inactivo. Contacte al administrador';
    echo json_encode($response);
    exit;
}

// Verificar contraseña //
if (!password_verify($password, $usuario['contrasena'])) {
    $response['error'] = 'Contraseña incorrecta';
    echo json_encode($response);
    exit;
}

// Iniciar sesión - guardar datos en $_SESSION //
$_SESSION['user_id'] = $usuario['id'];
$_SESSION['user_name'] = $usuario['nombre_completo'];
$_SESSION['user_rol'] = $usuario['rol'];
$_SESSION['user_email'] = $correo;
$_SESSION['login_time'] = time();

// Respuesta exitosa //
$response['success'] = true;
$response['message'] = 'Login exitoso';
$response['redirect'] = 'dashboard.html';
$response['usuario'] = [
    'id' => $usuario['id'],
    'nombre' => $usuario['nombre_completo'],
    'rol' => $usuario['rol']
];

echo json_encode($response);
$stmt->close();
$conn->close();
?>