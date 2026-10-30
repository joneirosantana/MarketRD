
<?php

session_start();

require_once __DIR__ . "/Config/database.php";

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "mensaje" => "Método no permitido."
    ]);
    exit;
}

if (!isset($_SESSION["usuario_id"])) {
    http_response_code(401);
    echo json_encode([
        "mensaje" => "Debes iniciar sesión para realizar una compra."
    ]);
    exit;
}

$datos = json_decode(file_get_contents("php://input"), true);

$nombre = trim($datos["nombre"] ?? "");
$direccion = trim($datos["direccion"] ?? "");
$productos = $datos["productos"] ?? [];

if (
    $nombre === "" ||
    $direccion === "" ||
    !is_array($productos) ||
    count($productos) === 0
) {
    http_response_code(400);
    echo json_encode([
        "mensaje" => "Verifica los datos de tu compra."
    ]);
    exit;
}

try {
    $conexion->beginTransaction();

    $consultaProducto = $conexion->prepare(
        "SELECT id, nombre, precio
         FROM productos
         WHERE id = :id AND activo = TRUE"
    );

    $consultaDetalle = $conexion->prepare(
        "INSERT INTO detalle_pedido
        (pedido_id, producto_id, nombre_producto, precio_unitario, cantidad, subtotal)
        VALUES (:pedido_id, :producto_id, :nombre, :precio, :cantidad, :subtotal)"
    );

    $totalCalculado = 0;
    $detalles = [];

    foreach ($productos as $producto) {
        $productoId = $producto["id"] ?? 0;
        $cantidad = filter_var(
            $producto["cantidad"] ?? null,
            FILTER_VALIDATE_INT
        );

        if (!filter_var($productoId, FILTER_VALIDATE_INT) ||
            $productoId <= 0 || $cantidad === false || $cantidad <= 0) {
            throw new Exception("Hay productos con datos inválidos.");
        }

        $consultaProducto->execute([
            ":id" => $productoId
        ]);

        $productoBD = $consultaProducto->fetch();

        if (!$productoBD) {
            throw new Exception("Uno de los productos no existe o está inactivo.");
        }

        $precio = (float)$productoBD["precio"];
        $subtotal = $precio * $cantidad;
        $totalCalculado += $subtotal;

        $detalles[] = [
            "id" => $productoBD["id"],
            "nombre" => $productoBD["nombre"],
            "precio" => $precio,
            "cantidad" => $cantidad,
            "subtotal" => $subtotal
        ];
    }

    $consultaPedido = $conexion->prepare(
        "INSERT INTO pedidos
        (usuario_id, nombre_cliente, direccion, total)
        VALUES (:usuario_id, :nombre, :direccion, :total)"
    );

    $consultaPedido->execute([
        ":usuario_id" => $_SESSION["usuario_id"],
        ":nombre" => $nombre,
        ":direccion" => $direccion,
        ":total" => $totalCalculado
    ]);

    $pedidoId = $conexion->lastInsertId();

    foreach ($detalles as $detalle) {
        $consultaDetalle->execute([
            ":pedido_id" => $pedidoId,
            ":producto_id" => $detalle["id"],
            ":nombre" => $detalle["nombre"],
            ":precio" => $detalle["precio"],
            ":cantidad" => $detalle["cantidad"],
            ":subtotal" => $detalle["subtotal"]
        ]);
    }

    $conexion->commit();

    echo json_encode([
        "mensaje" => "¡Pedido y productos guardados correctamente!",
        "pedido_id" => $pedidoId,
        "total" => $totalCalculado
    ]);

} catch (Throwable $e) {
    if ($conexion->inTransaction()) {
        $conexion->rollBack();
    }

    error_log($e->getMessage());

    http_response_code(500);
    echo json_encode([
        "mensaje" => "No se pudo guardar el pedido y sus productos."
    ]);
}
