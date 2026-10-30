
<?php

session_start();
require_once __DIR__ '/Config/conexion.php';
if (!isset($_SESSION["usuario_id"])) {
    header("Location: login.html");
    exit;
}
