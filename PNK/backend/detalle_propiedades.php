<?php
// DETALLE DE UNA PROPIEDAD //

header('Content-Type: application/json');
require_once 'conexion.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    echo json_encode(['success' => false, 'error' => 'ID de propiedad no válido']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM propiedades WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'error' => 'Propiedad no encontrada']);
    exit;
}

$propiedad = $result->fetch_assoc();

// Decodificar imágenes
$imagenes = json_decode($propiedad['imagenes'], true);
$propiedad['imagen_principal'] = !empty($imagenes) ? $imagenes[0] : 'https://via.placeholder.com/800x400?text=Sin+imagen';
$propiedad['imagenes_lista'] = $imagenes ?: [];

// Formatear precios
$propiedad['precio_formateado'] = $propiedad['precio_uf'] 
    ? 'UF ' . number_format($propiedad['precio_uf'], 2) 
    : '$' . number_format($propiedad['precio_clp'], 0, ',', '.');

// Obtener datos del propietario si está disponible
$propietario = null;
if (isset($propiedad['usuario_id']) && $propiedad['usuario_id'] > 0) {
    $stmt2 = $conn->prepare("SELECT nombre_completo, telefono, correo FROM gestores WHERE id = ?");
    $stmt2->bind_param("i", $propiedad['usuario_id']);
    $stmt2->execute();
    $result2 = $stmt2->get_result();
    if ($result2->num_rows > 0) {
        $propietario = $result2->fetch_assoc();
    }
    $stmt2->close();
}

$propiedad['propietario'] = $propietario;

echo json_encode([
    'success' => true,
    'data' => $propiedad
]);

$stmt->close();
$conn->close();
?>