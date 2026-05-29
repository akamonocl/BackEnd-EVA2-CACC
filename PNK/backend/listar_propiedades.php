<?php
// LISTAR PROPIEDADES CON PAGINACIÓN Y FILTROS //

header('Content-Type: application/json');
require_once 'conexion.php';

$pagina = isset($_GET['pagina']) ? (int)$_GET['pagina'] : 1;
$por_pagina = 9;
$offset = ($pagina - 1) * $por_pagina;

// Construir query      //
$sql_where = "WHERE 1=1";

if (isset($_GET['tipo']) && !empty($_GET['tipo'])) {
    $sql_where .= " AND tipo = '" . $conn->real_escape_string($_GET['tipo']) . "'";
}
if (isset($_GET['operacion']) && !empty($_GET['operacion'])) {
    $sql_where .= " AND operacion = '" . $conn->real_escape_string($_GET['operacion']) . "'";
}
if (isset($_GET['ubicacion']) && !empty($_GET['ubicacion'])) {
    $ubicacion = $conn->real_escape_string($_GET['ubicacion']);
    $sql_where .= " AND (comuna LIKE '%$ubicacion%' OR provincia LIKE '%$ubicacion%' OR sector LIKE '%$ubicacion%')";
}
if (isset($_GET['comuna']) && !empty($_GET['comuna'])) {
    $sql_where .= " AND comuna LIKE '%" . $conn->real_escape_string($_GET['comuna']) . "%'";
}
if (isset($_GET['provincia']) && !empty($_GET['provincia'])) {
    $sql_where .= " AND provincia LIKE '%" . $conn->real_escape_string($_GET['provincia']) . "%'";
}
if (isset($_GET['precio_min']) && !empty($_GET['precio_min'])) {
    $sql_where .= " AND precio_clp >= " . (float)$_GET['precio_min'];
}
if (isset($_GET['precio_max']) && !empty($_GET['precio_max'])) {
    $sql_where .= " AND precio_clp <= " . (float)$_GET['precio_max'];
}
if (isset($_GET['dormitorios']) && !empty($_GET['dormitorios'])) {
    $sql_where .= " AND dormitorios >= " . (int)$_GET['dormitorios'];
}

//      Contar total de registros           //
$count_sql = "SELECT COUNT(*) as total FROM propiedades $sql_where";
$count_result = $conn->query($count_sql);
$total_registros = $count_result->fetch_assoc()['total'];
$total_paginas = ceil($total_registros / $por_pagina);

//       Propiedades     //
$sql = "SELECT * FROM propiedades $sql_where ORDER BY id DESC LIMIT $offset, $por_pagina";
$result = $conn->query($sql);

$propiedades = [];
while ($row = $result->fetch_assoc()) {
    $imagenes = json_decode($row['imagenes'], true);
    $row['imagen_principal'] = !empty($imagenes) ? $imagenes[0] : 'https://via.placeholder.com/400x200?text=Sin+imagen';
    $row['imagenes_lista'] = $imagenes ?: [];
    $row['precio_formateado'] = $row['precio_uf'] 
        ? 'UF ' . number_format($row['precio_uf'], 2) 
        : '$' . number_format($row['precio_clp'], 0, ',', '.');
    $propiedades[] = $row;
}

echo json_encode([
    'success' => true,
    'data' => $propiedades,
    'total_registros' => $total_registros,
    'total_paginas' => $total_paginas,
    'pagina_actual' => $pagina,
    'por_pagina' => $por_pagina
]);

$conn->close();
?>