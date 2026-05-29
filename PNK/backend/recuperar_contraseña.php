<?php
require_once 'conexion.php';

$data = json_decode(file_get_contents('php://input'), true);
$response = ['success' => false, 'error' => ''];

$correo = $data['correo'] ?? '';

$stmt = $conn->prepare("SELECT id FROM gestores WHERE correo = ?");
$stmt->bind_param("s", $correo);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $response['error'] = 'Correo no registrado';
    echo json_encode($response);
    exit;
}

// Aquí normalmente enviarías un email //
// Imaginamos que se envio el enlace al correo //
$response['success'] = true;
$response['message'] = 'Se ha enviado un enlace a tu correo';

echo json_encode($response);
$conn->close();
?>