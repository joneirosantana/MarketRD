const formularioLogin = document.getElementById("formularioLogin");

// ===== Función para mostrar modales =====
function mostrarModal(titulo, mensaje, tipo = "info", callback = null) {
    const modal = document.getElementById("modalAviso");
    const modalTitulo = document.getElementById("modalTitulo");
    const modalMensaje = document.getElementById("modalMensaje");
    const modalIcono = document.getElementById("modalIcono");
    const modalBoton = document.getElementById("modalBoton");

    modalTitulo.textContent = titulo;
    modalMensaje.textContent = mensaje;
    modalIcono.className = "modal__icon modal__icon--" + tipo;

    // Cambiar icono según el tipo (usando Ionicons)
    if (tipo === "error") {
        modalIcono.innerHTML = '<ion-icon name="close-circle-outline"></ion-icon>';
    } else if (tipo === "success") {
        modalIcono.innerHTML = '<ion-icon name="checkmark-circle-outline"></ion-icon>';
    } else {
        modalIcono.innerHTML = '<ion-icon name="information-circle-outline"></ion-icon>';
    }

    modal.classList.add("is-active");

    // Acción al cerrar el modal
    modalBoton.onclick = () => {
        modal.classList.remove("is-active");
        if (callback) callback();
    };
}

// ===== Lógica del Login =====
formularioLogin.addEventListener("submit", async function (event) {
    event.preventDefault();

    const campoCorreo = document.getElementById("correo");
    const campoContrasena = document.getElementById("password");

    const correo = campoCorreo.value.trim();
    const contrasena = campoContrasena.value;

    if (correo === "" || contrasena === "") {
        mostrarModal("Campos vacíos", "Debes completar tu correo y contraseña.", "error");
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
            mostrarModal("Error al iniciar sesión", resultado.mensaje || "No se pudo iniciar sesión. Verifica tus datos.", "error");
            return;
        }

        // Éxito: Mostrar modal y redirigir al cerrar
        mostrarModal("¡Bienvenido!", resultado.mensaje || "Inicio de sesión exitoso.", "success", () => {
            window.location.href = "principal.html";
        });

    } catch (error) {
        mostrarModal("Error de conexión", "No se pudo conectar con el servidor. Intenta más tarde.", "error");
        console.error("Error al iniciar sesión:", error);
    }
});