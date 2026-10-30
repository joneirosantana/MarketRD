

const listaPedidos = document.getElementById("listaPedidos");
const cantidadPedidos = document.getElementById("cantidadPedidos");

async function mostrarHistorial() {
    try {
        const respuesta = await fetch("obtenerPedidos.php");
        const pedidos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                pedidos.mensaje || "No se pudo cargar el historial."
            );
        }

        listaPedidos.innerHTML = "";

        cantidadPedidos.textContent =
            "Tienes " + pedidos.length + " compras registradas.";

        if (pedidos.length === 0) {
            listaPedidos.innerHTML =
                '<tr><td colspan="4">Todavía no tienes compras registradas.</td></tr>';
            return;
        }

        pedidos.forEach(function(pedido) {
            const fila = document.createElement("tr");

            const cliente = document.createElement("td");
            cliente.textContent = pedido.nombre_cliente;

            const direccion = document.createElement("td");
            direccion.textContent = pedido.direccion;

            const total = document.createElement("td");
            total.textContent =
                "RD$ " + Number(pedido.total).toFixed(2);

            const fecha = document.createElement("td");
            fecha.textContent = pedido.fecha;

            fila.appendChild(cliente);
            fila.appendChild(direccion);
            fila.appendChild(total);
            fila.appendChild(fecha);

            listaPedidos.appendChild(fila);
        });

    } catch (error) {
        cantidadPedidos.textContent =
            "No se pudo cargar el historial de compras.";

        console.error("Error al consultar pedidos:", error);
    }
}

mostrarHistorial();

const botonBorrar = document.getElementById("borrarHistorial");

botonBorrar.addEventListener("click", async function() {
    const confirmar = confirm(
        "¿Estás seguro de que deseas borrar todo tu historial de compras?"
    );

    if (!confirmar) {
        return;
    }

    try {
        const respuesta = await fetch("borrarHistorial.php", {
            method: "POST"
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            alert(resultado.mensaje || "No se pudo borrar el historial.");
            return;
        }

        alert(resultado.mensaje);
        mostrarHistorial();

    } catch (error) {
        alert("No se pudo conectar con el servidor.");
        console.error("Error al borrar el historial:", error);
    }
});
