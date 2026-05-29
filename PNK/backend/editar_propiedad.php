<?php
session_start();
header('Content-Type: application/json');
require_once 'conexion.php';

$response = ['success' => false, 'error' => ''];

if (!isset($_SESSION['user_id'])) {
    $response['error'] = 'Debe iniciar sesión';
    echo json_encode($response);
    exit;
}

$usuario_id = $_SESSION['user_id'];

try {
    //       CREAR VARIABLES TEMPORALES (SOLUCIÓN AL ERROR)         //
    $tipoPropiedad = $_POST['tipoPropiedad'] ?? '';
    $operacion = $_POST['operacion'] ?? 'Venta';
    $descripcion = $_POST['descripcion'] ?? '';
    $banos = (int)($_POST['banos'] ?? 0);
    $dormitorios = (int)($_POST['dormitorios'] ?? 0);
    $areaTerreno = (float)($_POST['areaTerreno'] ?? 0);
    $areaConstruida = (float)($_POST['areaConstruida'] ?? 0);
    $precioCLP = (float)($_POST['precioCLP'] ?? 0);
    $precioUF = (float)($_POST['precioUF'] ?? 0);
    $comuna = $_POST['comuna'] ?? '';
    $provincia = $_POST['provincia'] ?? '';
    $sector = $_POST['sector'] ?? '';
    $bodega = (int)($_POST['bodega'] ?? 0);
    $estacionamiento = (int)($_POST['estacionamiento'] ?? 0);
    $logia = (int)($_POST['logia'] ?? 0);
    $cocinaAmoblada = (int)($_POST['cocinaAmoblada'] ?? 0);
    $antejardin = (int)($_POST['antejardin'] ?? 0);
    $patioTrasero = (int)($_POST['patioTrasero'] ?? 0);
    $piscina = (int)($_POST['piscina'] ?? 0);
    
    // Procesar imágenes
    $imagenes_paths = [];
    $upload_dir = '../uploads/propiedades/';
    if (!file_exists($upload_dir)) mkdir($upload_dir, 0777, true);
    
    if (isset($_FILES['imagenes']) && !empty($_FILES['imagenes']['name'][0])) {
        foreach ($_FILES['imagenes']['tmp_name'] as $key => $tmp_name) {
            if ($_FILES['imagenes']['error'][$key] === UPLOAD_ERR_OK) {
                $nombre = time() . '_' . $key . '.jpg';
                move_uploaded_file($tmp_name, $upload_dir . $nombre);
                $imagenes_paths[] = 'uploads/propiedades/' . $nombre;
            }
        }
    }
    
    $imagenes_json = json_encode($imagenes_paths ?: ['https://via.placeholder.com/600x400']);
    
    // Consulta SQL
    $sql = "INSERT INTO propiedades (
        tipo, operacion, descripcion, banos, dormitorios,
        area_terreno, area_construida, precio_clp, precio_uf,
        comuna, provincia, sector,
        bodega, estacionamiento, logia, cocina_amoblada, antejardin, patio_trasero, piscina,
        imagenes, usuario_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Error en prepare: " . $conn->error);
    }
    
    // bind_param CON VARIABLES (NO funciones directas)
    $stmt->bind_param(
        "sssiidddsssiiiiiiiiisi",
        $tipoPropiedad,
        $operacion,
        $descripcion,
        $banos,
        $dormitorios,
        $areaTerreno,
        $areaConstruida,
        $precioCLP,
        $precioUF,
        $comuna,
        $provincia,
        $sector,
        $bodega,
        $estacionamiento,
        $logia,
        $cocinaAmoblada,
        $antejardin,
        $patioTrasero,
        $piscina,
        $imagenes_json,
        $usuario_id
    );
    
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Propiedad publicada correctamente';
        $response['id'] = $stmt->insert_id;
    } else {
        $response['error'] = 'Error al insertar: ' . $stmt->error;
    }
    
    $stmt->close();
} catch (Exception $e) {
    $response['error'] = $e->getMessage();
}

echo json_encode($response);
$conn->close();
?>