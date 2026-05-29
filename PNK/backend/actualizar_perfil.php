<?php
session_start();
require_once 'conexion.php';

$response = ['success' => false, 'error' => ''];

if (!isset($_SESSION['user_id'])) {
    $response['error'] = 'No autorizado';
    echo json_encode($response);
    exit;
}

$stmt = $conn->prepare("UPDATE gestores SET nombre_completo=?, fecha_nacimiento=?, sexo=?, correo=?, telefono=? WHERE id=?");
$stmt->bind_param("sssssi", $_POST['nombreCompleto'], $_POST['fechaNacimiento'], $_POST['sexo'], $_POST['correo'], $_POST['telefono'], $_SESSION['user_id']);

if ($stmt->execute()) {
    $response['success'] = true;
    $response['message'] = 'Perfil actualizado';
} else {
    $response['error'] = $stmt->error;
}

echo json_encode($response);
$conn->close();
?>