const formulario = document.getElementById("formularioRegistro");

formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    const campoNombre = document.getElementById("nombre");
    const campoCorreo = document.getElementById("correo");
    const campoContrasena = document.getElementById("contrasena");
    const campoConfirmar = document.getElementById("confirmarContrasena");

    const nombre = campoNombre.value.trim();
    const correo = campoCorreo.value.trim();
    const contrasena = campoContrasena.value;
    const confirmarContrasena = campoConfirmar.value;

    if (contrasena !== confirmarContrasena) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    if (nombre === "" || correo === "" || contrasena === "") {
        alert("Debes completar todos los campos.");
        return;
    }

    if (contrasena.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres.");
        return;
    }

    try {
        const respuesta = await fetch("registrar.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre,
                correo: correo,
                contrasena: contrasena
            })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            alert(resultado.mensaje || "No se pudo completar el registro.");
            return;
        }

        alert(resultado.mensaje);

        formulario.reset();

    } catch (error) {
        alert("No se pudo conectar con el servidor. Comprueba que Apache esté iniciado.");
        console.error("Error al registrar:", error);
    }
});