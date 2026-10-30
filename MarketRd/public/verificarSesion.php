
<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

if (isset($_SESSION["usuario_id"])) {
    echo json_encode([
        "sesion" => true,
        "usuario_id" => $_SESSION["usuario_id"],
        "nombre" => $_SESSION["usuario_nombre"] ?? ""
    ]);
} else {
    http_response_code(401);

    echo json_encode([
        "sesion" => false,
        "mensaje" => "No hay una sesión iniciada."
    ]);
}
