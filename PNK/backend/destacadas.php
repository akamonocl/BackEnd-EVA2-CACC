<?php
// PROPIEDADES DESTACADAS (PÁGINA PRINCIPAL)    //

header('Content-Type: application/json');
require_once 'conexion.php';

// Obtener las 6 propiedades más recientes
$result = $conn->query("SELECT * FROM propiedades ORDER BY id DESC LIMIT 6");

$propiedades = [];
while ($row = $result->fetch_assoc()) {
    $imagenes = json_decode($row['imagenes'], true);
    $row['imagen_principal'] = !empty($imagenes) ? $imagenes[0] : 'https://via.placeholder.com/400x200?text=Propiedad';
    $row['precio_formateado'] = $row['precio_uf'] 
        ? 'UF ' . number_format($row['precio_uf'], 2) 
        : '$' . number_format($row['precio_clp'], 0, ',', '.');
    $propiedades[] = $row;
}

echo json_encode($propiedades);
$conn->close();
?>