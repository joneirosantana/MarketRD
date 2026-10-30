<?php

require_once __DIR__ . '/Config/conexion.php';

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["mensaje" => "Método no permitido."]);
    exit;
}

$datos = json_decode(file_get_contents("php://input"), true);

$nombre = trim($datos["nombre"] ?? "");
$correo = trim($datos["correo"] ?? "");
$contrasena = $datos["contrasena"] ?? "";

if ($nombre === "" || $correo === "" || $contrasena === "") {
    http_response_code(400);
    echo json_encode(["mensaje" => "Debes completar todos los campos."]);
    exit;
}

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["mensaje" => "El correo electrónico no es válido."]);
    exit;
}

if (strlen($contrasena) < 8) {
    http_response_code(400);
    echo json_encode(["mensaje" => "La contraseña debe tener al menos 8 caracteres."]);
    exit;
}

try {
    $consulta = $conexion->prepare(
        "INSERT INTO usuarios (nombre, correo, password)
         VALUES (:nombre, :correo, :password)"
    );

    $consulta->execute([
        ":nombre" => $nombre,
        ":correo" => $correo,
        ":password" => password_hash($contrasena, PASSWORD_DEFAULT)
    ]);

    echo json_encode(["mensaje" => "¡Cuenta creada correctamente!"]);

} catch (PDOException $e) {
    if ($e->getCode() === "23000") {
        http_response_code(409);
        echo json_encode(["mensaje" => "Ese correo ya está registrado."]);
    } else {
        http_response_code(500);
        echo json_encode(["mensaje" => "Ocurrió un error al registrar la cuenta."]);
    }
}