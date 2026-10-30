
<?php
session_start();

require_once __DIR__ . '/Config/conexion.php';

header("Content-Type: application/json; charset=UTF-8");

if (!isset($_SESSION["usuario_id"])) {
    http_response_code(401);

    echo json_encode([
        "mensaje" => "Debes iniciar sesión."
    ]);

    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "mensaje" => "Método no permitido."
    ]);

    exit;
}

try {
    $consulta = $conexion->prepare(
        "DELETE FROM pedidos WHERE usuario_id = :usuario_id"
    );

    $consulta->execute([
        ":usuario_id" => $_SESSION["usuario_id"]
    ]);

    echo json_encode([
        "mensaje" => "Tu historial de compras ha sido borrado."
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        "mensaje" => "No se pudo borrar el historial."
    ]);
}
