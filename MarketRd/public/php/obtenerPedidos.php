

<?php

session_start();

require_once __DIR__ . "/Config/database.php";

header("Content-Type: application/json; charset=UTF-8");

if (!isset($_SESSION["usuario_id"])) {
    http_response_code(401);

    echo json_encode([
        "mensaje" => "Debes iniciar sesión para ver tus compras."
    ]);

    exit;
}

try {
    $consulta = $conexion->prepare(
        "SELECT id, nombre_cliente, direccion, total, fecha
         FROM pedidos
         WHERE usuario_id = :usuario_id
         ORDER BY fecha DESC"
    );

    $consulta->execute([
        ":usuario_id" => $_SESSION["usuario_id"]
    ]);

    $pedidos = $consulta->fetchAll();

    echo json_encode($pedidos);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        "mensaje" => "No se pudo consultar el historial de compras."
    ]);
}

