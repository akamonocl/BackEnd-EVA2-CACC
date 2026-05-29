<?php
// VERIFICAR SESIÓN ACTIVA  //

session_start();
header('Content-Type: application/json');

$response = ['is_logged_in' => false, 'error' => ''];

if (isset($_SESSION['user_id']) && isset($_SESSION['is_logged_in']) && $_SESSION['is_logged_in'] === true) {
    $response['is_logged_in'] = true;
    $response['user'] = [
        'id' => $_SESSION['user_id'],
        'nombre' => $_SESSION['user_name'],
        'rol' => $_SESSION['user_rol'],
        'email' => $_SESSION['user_email']
    ];
} else {
    $response['error'] = 'No hay sesión activa';
}

echo json_encode($response);
?>