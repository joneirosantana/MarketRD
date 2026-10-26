// =========================================
//  CATÁLOGO - MarketRD
//  Datos de muestra + búsqueda + filtros
//  + header (menú móvil y desplegables)
// =========================================

// ===== DATOS DE MUESTRA =====
const productos = [
    { id: 1, nombre: "Audífonos Bluetooth", descripcion: "Sonido HD con cancelación de ruido.", precio: 1200.00, categoria: "electrónica", imagen: "https://picsum.photos/seed/audifonos/400/300" },
    { id: 2, nombre: "Lámpara de Mesa", descripcion: "Diseño moderno, luz cálida regulable.", precio: 850.00,  categoria: "hogar", imagen: "https://picsum.photos/seed/lampara/400/300" },
    { id: 3, nombre: "Smartwatch", descripcion: "Monitor de salud y notificaciones.", precio: 2450.00, categoria: "electrónica", imagen: "https://picsum.photos/seed/smartwatch/400/300" },
    { id: 4, nombre: "Camiseta Casual", descripcion: "Algodón 100%, varios colores.", precio: 640.00,  categoria: "moda", imagen: "https://picsum.photos/seed/camiseta/400/300" },
    { id: 5, nombre: "Balón de Fútbol", descripcion: "Tamaño oficial, cuero sintético.", precio: 3100.00, categoria: "deportes", imagen: "https://picsum.photos/seed/balon/400/300" },
    { id: 6, nombre: "Juego de Sábanas", descripcion: "Suaves, 2 plazas, tonos neutros.", precio: 990.00,  categoria: "hogar", imagen: "https://picsum.photos/seed/sabanas/400/300" },
    { id: 7, nombre: "Zapatillas Running", descripcion: "Ligeras y transpirables.", precio: 1850.00, categoria: "deportes", imagen: "https://picsum.photos/seed/zapatillas/400/300" },
    { id: 8, nombre: "Mochila Urbana", descripcion: "Resistente al agua, 25L.", precio: 1100.00, categoria: "moda", imagen: "https://picsum.photos/seed/mochila/400/300" }
];

// ===== Referencias DOM =====
const grid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const categorySel = document.getElementById("categoryFilter");
const noResults = document.getElementById("noResults");

// ===== Helpers =====
function formatPrecio(n) {
    return "RD$ " + Number(n).toLocaleString("es-DO", {
        minimumFractionDigits: 2, maximumFractionDigits: 2
    });
}

function renderProductos(lista) {
    grid.innerHTML = "";
    if (lista.length === 0) {
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
                <p class="card__desc">${p.descripcion}</p>
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
    const texto = searchInput.value.trim().toLowerCase();
    const cat   = categorySel.value;
    const filtrados = productos.filter(p => {
        const coincideNombre = p.nombre.toLowerCase().includes(texto);
        const coincideCat    = cat === "all" || p.categoria === cat;
        return coincideNombre && coincideCat;
    });
    renderProductos(filtrados);
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

    // Lee ?cat= de la URL y preselecciona el filtro
    const catParam = new URLSearchParams(window.location.search).get("cat");
    if (catParam && categorySel) {
        categorySel.value = catParam;
    }

    renderProductos(productos);
    searchInput.addEventListener("input", filtrar);
    categorySel.addEventListener("change", filtrar);
});