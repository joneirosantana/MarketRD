// =========================================
//  PÁGINA PRINCIPAL - MarketRD
//  Carga productos desde la API, renderiza,
//  busca y filtra. Incluye header móvil.
// =========================================

// ===== Estado =====
let todosLosProductos = [];

// ===== Referencias DOM =====
const grid        = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const categorySel = document.getElementById("categoryFilter");
const noResults   = document.getElementById("noResults");

// ===== Helpers =====
function formatPrecio(n) {
    return "RD$ " + Number(n).toLocaleString("es-DO", {
        minimumFractionDigits: 2, maximumFractionDigits: 2
    });
}

// El backend puede devolver categoria como string u objeto {id, nombre}
function nombreCategoria(p) {
    return typeof p.categoria === "object" && p.categoria !== null
        ? p.categoria.nombre
        : p.categoria;
}

function renderProductos(lista) {
    grid.innerHTML = "";
    if (!lista || lista.length === 0) {
        noResults.hidden = false;
        return;
    }
    noResults.hidden = true;

    lista.forEach(p => {
        const article = document.createElement("article");
        article.className = "card";
        article.innerHTML = `
            <div class="card__image-wrapper">
                <img src="${p.imagen}" alt="${p.nombre}" class="card__image"
                     onerror="this.src='img/LogoIcon.png'">
            </div>
            <div class="card__body">
                <h3 class="card__name">${p.nombre}</h3>
                <p class="card__desc">${p.descripcion ?? ""}</p>
                <div class="card__footer">
                    <span class="card__price">${formatPrecio(p.precio)}</span>
                    <a href="detalle.html?id=${p.id}" class="btn btn--small btn--primary">Ver detalle</a>
                </div>
            </div>
        `;
        grid.appendChild(article);
    });
}

function filtrar() {
    const texto = (searchInput?.value || "").trim().toLowerCase();
    const cat   = categorySel?.value || "all";

    const filtrados = todosLosProductos.filter(p => {
        const coincideNombre = p.nombre.toLowerCase().includes(texto);
        const coincideCat    = cat === "all" || nombreCategoria(p) === cat;
        return coincideNombre && coincideCat;
    });

    renderProductos(filtrados);
}

// ===== Cargar categorías en el select =====
async function cargarCategorias() {
    try {
        const cats = await getCategorias();
        categorySel.innerHTML = `<option value="all">Todas las categorías</option>`;
        cats.forEach(c => {
            const nombre = typeof c === "object" ? c.nombre : c;
            const opt = document.createElement("option");
            opt.value = nombre;
            opt.textContent = nombre;
            categorySel.appendChild(opt);
        });
    } catch (err) {
        console.error("No se pudieron cargar las categorías:", err);
    }
}

// ===== Cargar productos =====
async function cargarProductos() {
    grid.innerHTML = `<p class="products__no-results">Cargando productos...</p>`;
    try {
        todosLosProductos = await getProductos();
        renderProductos(todosLosProductos);
    } catch (err) {
        console.error("Error cargando productos:", err);
        grid.innerHTML = "";
        noResults.hidden = false;
        noResults.textContent = "No se pudieron cargar los productos. Intenta más tarde.";
    }
}

// ===== Header: menú móvil + desplegables =====
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

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    cargarCategorias();
    cargarProductos();

    searchInput?.addEventListener("input", filtrar);
    categorySel?.addEventListener("change", filtrar);
});