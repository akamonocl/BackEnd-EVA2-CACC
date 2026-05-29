<?php
// CERRAR SESIÓN //
session_start();

// Destruir todas las variables de sesión //
$_SESSION = array();

// Destruir la sesión //
session_destroy();

// Redirigir al inicio con mensaje //
header('Location: ../index.html?mensaje=sesion_cerrada');
exit;
?>