
<?php

session_start();

require_once __DIR__ . "/Config/database.php";

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["mensaje" => "Método no permitido."]);
    exit;
}

$datos = json_decode(file_get_contents("php://input"), true);

$correo = trim($datos["correo"] ?? "");
$contrasena = $datos["contrasena"] ?? "";

if ($correo === "" || $contrasena === "") {
    http_response_code(400);
    echo json_encode(["mensaje" => "Completa tu correo y contraseña."]);
    exit;
}

try {
    $consulta = $conexion->prepare(
        "SELECT id, nombre, correo, password
         FROM usuarios
         WHERE correo = :correo
         LIMIT 1"
    );

    $consulta->execute([":correo" => $correo]);
    $usuario = $consulta->fetch();

    if (!$usuario || !password_verify($contrasena, $usuario["password"])) {
        http_response_code(401);
        echo json_encode(["mensaje" => "Correo o contraseña incorrectos."]);
        exit;
    }

    session_regenerate_id(true);

    $_SESSION["usuario_id"] = $usuario["id"];
    $_SESSION["usuario_nombre"] = $usuario["nombre"];
    $_SESSION["usuario_correo"] = $usuario["correo"];

    echo json_encode([
        "mensaje" => "¡Bienvenido a MarketRD, " . $usuario["nombre"] . "!",
        "usuario" => [
            "nombre" => $usuario["nombre"],
            "correo" => $usuario["correo"]
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["mensaje" => "Ocurrió un error al iniciar sesión."]);
}
