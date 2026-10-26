// =========================================
//  CONTACTO - MarketRD
//  Envía el formulario a la API (POST /contacto).
// =========================================

const form   = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

function mostrarStatus(msg, tipo) {
    status.hidden = false;
    status.textContent = msg;
    status.className = "contacto__status contacto__status--" + tipo;
}

async function enviarContacto(payload) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.contacto}`;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // Algunos backends devuelven 204 sin body
    return res.status === 204 ? null : res.json().catch(() => null);
}

form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validación nativa
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const payload = {
        nombre:  form.nombre.value.trim(),
        email:   form.email.value.trim(),
        asunto:  form.asunto.value.trim(),
        mensaje: form.mensaje.value.trim()
    };

    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    mostrarStatus("Enviando...", "info");

    try {
        await enviarContacto(payload);
        mostrarStatus("¡Mensaje enviado con éxito! Te responderemos pronto.", "success");
        form.reset();
    } catch (err) {
        console.error("Error enviando contacto:", err);
        mostrarStatus("No se pudo enviar el mensaje. Intenta más tarde.", "error");
    } finally {
        btn.disabled = false;
    }
});

// Header móvil + desplegables
function initHeader() {
    const toggle = document.querySelector(".nav__toggle");
    const mainNav = document.querySelector(".nav--main");
    const authNav = document.querySelector(".nav--auth");

    toggle?.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        mainNav?.classList.toggle("is-open", !open);
        authNav?.classList.toggle("is-open", !open);
    });

    document.querySelectorAll(".nav__item--dropdown > button").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const item = btn.parentElement;
            const abierto = item.classList.contains("is-open");
            document.querySelectorAll(".nav__item--dropdown.is-open")
                .forEach(i => { if (i !== item) i.classList.remove("is-open"); });
            item.classList.toggle("is-open", !abierto);
            btn.setAttribute("aria-expanded", String(!abierto));
        });
    });

    document.addEventListener("click", () => {
        document.querySelectorAll(".nav__item--dropdown.is-open")
            .forEach(i => i.classList.remove("is-open"));
    });
}

document.addEventListener("DOMContentLoaded", initHeader);