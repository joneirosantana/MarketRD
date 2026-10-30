

const formularioLogin = document.getElementById("formularioLogin");

formularioLogin.addEventListener("submit", async function(event) {
    event.preventDefault();

    const campoCorreo = document.getElementById("correo");
    const campoContrasena = document.getElementById("contrasena");

    const correo = campoCorreo.value.trim();
    const contrasena = campoContrasena.value;

    if (correo === "" || contrasena === "") {
        alert("Debes completar tu correo y contraseña.");
        return;
    }

    try {
       const respuesta = await fetch("iniciarSesion.php", {
    method: "POST",
    credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo: correo,
                contrasena: contrasena
            })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            alert(resultado.mensaje || "No se pudo iniciar sesión.");
            return;
        }

        alert(resultado.mensaje);

window.location.href = "principal.html";

    } catch (error) {
        alert("No se pudo conectar con el servidor.");
        console.error("Error al iniciar sesión:", error);
    }
});

