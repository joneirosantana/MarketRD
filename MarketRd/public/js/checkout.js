
const formularioPago = document.getElementById("formularioPago");

const nombreCliente = document.getElementById("nombreCliente");
const correoCliente = document.getElementById("correoCliente");
const direccionCliente = document.getElementById("direccionCliente");
const telefonoCliente = document.getElementById("telefonoCliente");

const totalCompra = document.getElementById("totalCompra");

const totalGuardado = localStorage.getItem("totalCompra");

totalCompra.textContent = totalGuardado || "0.00";

formularioPago.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nombre = nombreCliente.value.trim();
    const direccion = direccionCliente.value.trim();
    const total = Number(totalCompra.textContent);

    if (total <= 0 || !Number.isFinite(total)) {
        alert("Tu carrito está vacío. Agrega productos antes de comprar.");
        return;
    }

    if (nombre === "" || direccion === "") {
        alert("Completa tu nombre y dirección.");
        return;
    }

    try {
        const respuesta = await fetch("guardarPedido.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre,
                direccion: direccion,
                total: total,
                productos: JSON.parse(localStorage.getItem("carrito") || "[]")
            })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            alert(resultado.mensaje || "No se pudo guardar el pedido.");
            return;
        }


        localStorage.setItem("totalPedidoConfirmado", total.toFixed(2));

        formularioPago.reset();


        localStorage.setItem("carrito", "[]");
        localStorage.setItem("totalCompra", "0.00");


        window.location.href = "confirmacion.html";


    } catch (error) {
        alert("No se pudo conectar con el servidor. Comprueba que Apache esté iniciado.");
        console.error("Error al guardar el pedido:", error);
    }
});
