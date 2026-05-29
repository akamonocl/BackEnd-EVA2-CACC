<?php
// Obtener propiedades del usuario logueado  //

session_start();
header('Content-Type: application/json');
require_once 'conexion.php';

$response = ['success' => false, 'error' => '', 'data' => []];

// Verificar que el usuario haya iniciado sesión //
if (!isset($_SESSION['user_id'])) {
    $response['error'] = 'No autorizado. Debe iniciar sesión';
    echo json_encode($response);
    exit;
}

$usuario_id = $_SESSION['user_id'];

// Obtener todas las propiedades del usuario  //
$stmt = $conn->prepare("SELECT * FROM propiedades WHERE usuario_id = ? ORDER BY id DESC");
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$result = $stmt->get_result();

$propiedades = [];
while ($row = $result->fetch_assoc()) {
    // Decodificar el JSON de imágenes  //
    $imagenes = json_decode($row['imagenes'], true);
    $row['imagen_principal'] = !empty($imagenes) ? $imagenes[0] : 'https://via.placeholder.com/400x200?text=Sin+imagen';
    $row['imagenes_lista'] = $imagenes ?: [];
    
    // Formatear precios para mostrar //
    $row['precio_formateado'] = $row['precio_uf'] 
        ? 'UF ' . number_format($row['precio_uf'], 2) 
        : '$' . number_format($row['precio_clp'], 0, ',', '.');
    
    $propiedades[] = $row;
}

$response['success'] = true;
$response['data'] = $propiedades;
$response['total'] = count($propiedades);

echo json_encode($response);
$stmt->close();
$conn->close();
?>