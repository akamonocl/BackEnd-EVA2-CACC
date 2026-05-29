<?php
// CONEXIÓN A LA BASE DE DATOS  //

// Configuración de la base de datos
$host = 'localhost';           // Servidor (localhost en local, IP en AWS)
$user = 'root';                // Usuario de MySQL
$password = '';                // Contraseña de MySQL (en XAMPP/WAMP suele estar vacía)
$database = 'inmobiliaria';    // Nombre de la base de datos

// Crear conexión
$conn = new mysqli($host, $user, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode([
        'success' => false, 
        'error' => 'Conexión fallida: ' . $conn->connect_error
    ]));
}

// Configurar charset para evitar problemas con caracteres especiales
$conn->set_charset("utf8");

// La conexión se mantiene disponible para los demás archivos
// No cerrar la conexión aquí porque otros archivos la usan
?>