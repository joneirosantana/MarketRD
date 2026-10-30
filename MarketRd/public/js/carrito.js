
const contenedorCarrito = document.getElementById("productosCarrito");
const totalCarrito = document.getElementById("totalCarrito");
let productosGuardados = localStorage.getItem("carrito");

let productos;

if (productosGuardados !== null) {
    productos = JSON.parse(productosGuardados);
} else {
    productos = [
    {
        id: 1,
        nombre: "Labial",
        precio: 50,
        cantidad: 2
    },
    {
        id: 2,
        nombre: "Gloss",
        precio: 250,
        cantidad: 1
    }
];

}


function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(productos));
}

function mostrarCarrito() {

    contenedorCarrito.innerHTML = "";
    totalCarrito.textContent = "0.00";
    let total = 0;

    if (productos.length === 0) {
        localStorage.setItem("totalCompra", "0.00");
        return;
    }

    for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];
        total += producto.precio * producto.cantidad;
        const fila = document.createElement("tr");

        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = producto.nombre;
        fila.appendChild(celdaNombre);

        const celdaPrecio = document.createElement("td");
        celdaPrecio.textContent = "RD$ " + producto.precio;
        fila.appendChild(celdaPrecio);


        const celdaCantidad = document.createElement("td");

        const campoCantidad = document.createElement("input");
        campoCantidad.type = "number";
        campoCantidad.min = "1";
        campoCantidad.value = producto.cantidad;

        celdaCantidad.appendChild(campoCantidad);

        campoCantidad.addEventListener("change", function () {
            let nuevaCantidad = Number(campoCantidad.value);

            if (nuevaCantidad < 1 || campoCantidad.value === "") {
                nuevaCantidad = 1;
            }

            productos[i].cantidad = nuevaCantidad;
            guardarCarrito();
            console.log("Carrito guardado:", localStorage.getItem("carrito"));
            mostrarCarrito();
        });

        fila.appendChild(celdaCantidad); 

        const celdaSubtotal = document.createElement("td");
        celdaSubtotal.textContent = "RD$ " + (producto.precio * producto.cantidad).toFixed(2);
        fila.appendChild(celdaSubtotal);

        const celdaAccion = document.createElement("td");
        const botonEliminar = document.createElement("button");

        botonEliminar.textContent = "Eliminar";
        botonEliminar.type = "button";

        botonEliminar.addEventListener("click", function () {
            productos.splice(i, 1);
            guardarCarrito();
            mostrarCarrito();
        });


        celdaAccion.appendChild(botonEliminar);
        fila.appendChild(celdaAccion);
        contenedorCarrito.appendChild(fila);


    }
    totalCarrito.textContent = total.toFixed(2); 
    localStorage.setItem("totalCompra", total.toFixed(2)); 
}


mostrarCarrito(); 
const botonVaciar = document.getElementById("vaciarCarrito");

botonVaciar.addEventListener("click", function () {
    productos = [];
    guardarCarrito();
    mostrarCarrito();
    
});



