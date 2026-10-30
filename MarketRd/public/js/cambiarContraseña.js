document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCambiarPassword");
    
    // Obtenemos el correo de la URL (enviado desde el login)
    const urlParams = new URLSearchParams(window.location.search);
    const correo = urlParams.get("correo");

    if (!correo) {
        alert("No se especificó un correo válido. Vuelve a intentarlo.");
        window.location.href = "login.html";
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const codigo = document.getElementById("codigoRecuperacion").value.trim();
        const nuevaPass = document.getElementById("nuevaPassword").value;
        const confirmarPass = document.getElementById("confirmarPassword").value;

        if (nuevaPass !== confirmarPass) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const btnSubmit = form.querySelector("button[type='submit']");
        btnSubmit.disabled = true;
        btnSubmit.textContent = "Cambiando...";

        try {
            // Conexión al PHP
            const respuesta = await fetch("recuperarPassword.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    correo: correo, 
                    codigo: codigo, 
                    nuevaContrasena: nuevaPass,
                    accion: "cambiar_password" 
                })
            });
            const resultado = await respuesta.json();

            if (resultado.exito) {
                alert("¡Contraseña cambiada con éxito! Ya puedes iniciar sesión.");
                window.location.href = "login.html"; // Lo devolvemos al login
            } else {
                alert(resultado.mensaje || "Código incorrecto o expirado.");
                btnSubmit.disabled = false;
                btnSubmit.textContent = "Cambiar";
            }
        } catch (error) {
            alert("Error de conexión con el servidor.");
            btnSubmit.disabled = false;
            btnSubmit.textContent = "Cambiar";
        }
    });
});