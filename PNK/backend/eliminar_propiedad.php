<?php
//  ELIMINAR PROPIEDAD (SOLO DEL PROPIETARIO)    //

session_start();
header('Content-Type: application/json');
require_once 'conexion.php';

$response = ['success' => false, 'error' => ''];

//  Verificar sesión    //
if (!isset($_SESSION['user_id'])) {
    $response['error'] = 'No autorizado';
    echo json_encode($response);
    exit;
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$usuario_id = $_SESSION['user_id'];

if ($id <= 0) {
    $response['error'] = 'ID de propiedad no válido';
    echo json_encode($response);
    exit;
}

//   Verificar que la propiedad existe y pertenece al usuario   //
$check = $conn->prepare("SELECT id FROM propiedades WHERE id = ? AND usuario_id = ?");
$check->bind_param("ii", $id, $usuario_id);
$check->execute();
$check_result = $check->get_result();

if ($check_result->num_rows === 0) {
    $response['error'] = 'Propiedad no encontrada o no tienes permiso para eliminarla';
    echo json_encode($response);
    $check->close();
    exit;
}
$check->close();

//          Eliminar propiedad                  //
$stmt = $conn->prepare("DELETE FROM propiedades WHERE id = ? AND usuario_id = ?");
$stmt->bind_param("ii", $id, $usuario_id);

if ($stmt->execute()) {
    $response['success'] = true;
    $response['message'] = 'Propiedad eliminada correctamente';
} else {
    $response['error'] = 'Error al eliminar: ' . $stmt->error;
}

echo json_encode($response);
$stmt->close();
$conn->close();
?>