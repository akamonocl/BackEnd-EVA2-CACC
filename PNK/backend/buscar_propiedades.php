<?php
// BÚSQUEDA AVANZADA DE PROPIEDADES (AJAX)  //

header('Content-Type: application/json');
require_once 'conexion.php';

// Construir consulta dinámica
$sql = "SELECT * FROM propiedades WHERE 1=1";

if (isset($_GET['palabra']) && !empty($_GET['palabra'])) {
    $palabra = $conn->real_escape_string($_GET['palabra']);
    $sql .= " AND (tipo LIKE '%$palabra%' OR descripcion LIKE '%$palabra%' OR comuna LIKE '%$palabra%')";
}
if (isset($_GET['tipo']) && !empty($_GET['tipo'])) {
    $sql .= " AND tipo = '" . $conn->real_escape_string($_GET['tipo']) . "'";
}
if (isset($_GET['operacion']) && !empty($_GET['operacion'])) {
    $sql .= " AND operacion = '" . $conn->real_escape_string($_GET['operacion']) . "'";
}
if (isset($_GET['comuna']) && !empty($_GET['comuna'])) {
    $sql .= " AND comuna LIKE '%" . $conn->real_escape_string($_GET['comuna']) . "%'";
}
if (isset($_GET['provincia']) && !empty($_GET['provincia'])) {
    $sql .= " AND provincia LIKE '%" . $conn->real_escape_string($_GET['provincia']) . "%'";
}
if (isset($_GET['precio_min']) && !empty($_GET['precio_min'])) {
    $sql .= " AND precio_clp >= " . (float)$_GET['precio_min'];
}
if (isset($_GET['precio_max']) && !empty($_GET['precio_max'])) {
    $sql .= " AND precio_clp <= " . (float)$_GET['precio_max'];
}
if (isset($_GET['dormitorios']) && !empty($_GET['dormitorios'])) {
    $sql .= " AND dormitorios >= " . (int)$_GET['dormitorios'];
}

$sql .= " ORDER BY id DESC";
$result = $conn->query($sql);

$propiedades = [];
while ($row = $result->fetch_assoc()) {
    $imagenes = json_decode($row['imagenes'], true);
    $row['imagen_principal'] = !empty($imagenes) ? $imagenes[0] : 'https://via.placeholder.com/400x200?text=Sin+imagen';
    $row['precio_formateado'] = $row['precio_uf'] 
        ? 'UF ' . number_format($row['precio_uf'], 2) 
        : '$' . number_format($row['precio_clp'], 0, ',', '.');
    $propiedades[] = $row;
}

echo json_encode($propiedades);
$conn->close();
?>