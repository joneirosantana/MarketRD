document.addEventListener("DOMContentLoaded", function() {
    
    const formulario = document.getElementById("registroForm");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const mensajeError = document.getElementById("mensaje-error");
    const mensajeExito = document.getElementById("mensaje-exito");
    const btnSubmit = document.getElementById("btn-submit");

    formulario.addEventListener("submit", async function(evento) {
        evento.preventDefault(); // Evitamos la recarga por defecto

        // 1. Limpiamos mensajes anteriores
        mensajeError.style.display = "none";
        mensajeExito.style.display = "none";
        passwordInput.style.borderColor = "#ccc";
        confirmPasswordInput.style.borderColor = "#ccc";

        // 2. Validación Frontend (Contraseñas iguales)
        if (passwordInput.value !== confirmPasswordInput.value) {
            mensajeError.textContent = "Las contraseñas no coinciden.";
            mensajeError.style.display = "block";
            passwordInput.style.borderColor = "#e74c3c";
            confirmPasswordInput.style.borderColor = "#e74c3c";
            return; 
        }

        // 3. Preparamos los datos para enviar
        const datos = {
            nombre: document.getElementById("nombre").value,
            email: document.getElementById("email").value,
            password: passwordInput.value
        };

        // Bloqueamos el botón mientras se envía
        btnSubmit.disabled = true;
        btnSubmit.textContent = "Registrando...";

        try {
            // 4. Enviamos los datos al Backend REAL
            const respuesta = await fetch("http://localhost:3000/api/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                // Todo salió bien
                mensajeExito.textContent = resultado.mensaje;
                mensajeExito.style.display = "block";
                formulario.reset();
            } else {
                // El servidor devolvió un error (ej: el correo ya existe)
                mensajeError.textContent = resultado.error;
                mensajeError.style.display = "block";
            }
        } catch (error) {
            // Error de red (servidor apagado, etc.)
            console.error("Error:", error);
            mensajeError.textContent = "Error de conexión. Asegúrate de que el servidor esté encendido.";
            mensajeError.style.display = "block";
        } finally {
            // Reactivamos el botón
            btnSubmit.disabled = false;
            btnSubmit.textContent = "Crear Cuenta";
        }
    });

    // Limpiar bordes rojos al escribir
    const inputs = [passwordInput, confirmPasswordInput];
    inputs.forEach(input => {
        input.addEventListener("input", function() {
            this.style.borderColor = "#ccc";
            mensajeError.style.display = "none";
        });
    });
});