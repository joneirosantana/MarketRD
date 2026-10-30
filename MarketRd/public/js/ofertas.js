// =========================================
//  OFERTAS - MarketRD
//  Carga productos en oferta desde la API.
// =========================================

const grid      = document.getElementById("productsGrid");
const noResults = document.getElementById("noResults");

function formatPrecio(n) {
    return "RD$ " + Number(n).toLocaleString("es-DO", {
        minimumFractionDigits: 2, maximumFractionDigits: 2
    });
}

function renderOfertas(lista) {
    grid.innerHTML = "";
    if (!lista || lista.length === 0) {
        noResults.hidden = false;
        return;
    }
    noResults.hidden = true;

    lista.forEach(p => {
        const article = document.createElement("article");
        article.className = "card card--oferta";
        article.innerHTML = `
            <div class="card__image-wrapper">
                <img src="${p.imagen}" alt="${p.nombre}" class="card__image"
                     onerror="this.src='img/LogoIcon.png'">
                <span class="card__badge">-${p.descuento ?? 0}%</span>
            </div>
            <div class="card__body">
                <h3 class="card__name">${p.nombre}</h3>
                <p class="card__desc">${p.descripcion ?? ""}</p>
                <div class="card__footer">
                    <div class="card__prices">
                        <span class="card__price-old">${formatPrecio(p.precioOriginal ?? p.precio)}</span>
                        <span class="card__price">${formatPrecio(p.precioOferta ?? p.precio)}</span>
                    </div>
                    <a href="detalle.html?id=${p.id}" class="btn btn--small btn--primary">Ver detalle</a>
                </div>
            </div>
        `;
        grid.appendChild(article);
    });
}

async function cargarOfertas() {
    grid.innerHTML = `<p class="products__no-results">Cargando ofertas...</p>`;
    try {
        const lista = await getOfertas();
        renderOfertas(lista);
    } catch (err) {
        console.error("Error cargando ofertas:", err);
        grid.innerHTML = "";
        noResults.hidden = false;
        noResults.textContent = "No se pudieron cargar las ofertas. Intenta más tarde.";
    }
}

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

document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    cargarOfertas();
});