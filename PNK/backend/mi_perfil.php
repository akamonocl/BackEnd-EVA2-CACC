<?php
session_start();
require_once 'conexion.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

$stmt = $conn->prepare("SELECT id, rut, nombre_completo, fecha_nacimiento, correo, sexo, telefono FROM gestores WHERE id = ?");
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['error' => 'Usuario no encontrado']);
    exit;
}

$usuario = $result->fetch_assoc();
echo json_encode(['success' => true, 'usuario' => $usuario]);
$conn->close();
?>