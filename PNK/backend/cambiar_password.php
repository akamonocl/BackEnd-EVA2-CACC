<?php
session_start();
require_once 'conexion.php';

$response = ['success' => false, 'error' => ''];

if (!isset($_SESSION['user_id'])) {
    $response['error'] = 'No autorizado';
    echo json_encode($response);
    exit;
}

// Verificar contraseña actual
$stmt = $conn->prepare("SELECT contrasena FROM gestores WHERE id = ?");
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!password_verify($_POST['passwordActual'], $user['contrasena'])) {
    $response['error'] = 'Contraseña actual incorrecta';
    echo json_encode($response);
    exit;
}

// Actualizar contraseña
$nuevaPassword = password_hash($_POST['nuevaPassword'], PASSWORD_BCRYPT);
$stmt = $conn->prepare("UPDATE gestores SET contrasena = ? WHERE id = ?");
$stmt->bind_param("si", $nuevaPassword, $_SESSION['user_id']);

if ($stmt->execute()) {
    $response['success'] = true;
} else {
    $response['error'] = $stmt->error;
}

echo json_encode($response);
$conn->close();
?>