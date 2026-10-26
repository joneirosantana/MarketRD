// =========================================================
//  CAPA DE CONEXIÓN - MarketRD
//  Aquí se define la conexión con la base de datos (API).
//  SOLO VINCULA BASE_URL Y LOS ENDPOINTS.
// =========================================================

const API_CONFIG = {
    // URL base de tu backend (Spring Boot, Node, PHP, etc.)
    BASE_URL: "http://localhost:8080/api",

    // Endpoints (ajústalos a los de tu backend)
    ENDPOINTS: {
        productos:  "/productos",
        categorias: "/categorias",
        producto:   (id) => `/productos/${id}`,
        ofertas:    "/ofertas",
        contacto:   "/contacto"
    }
};

/**
 * GET genérico con manejo de errores.
 * @param {string} path
 * @returns {Promise<any>}
 */
async function apiGet(path) {
    const url = `${API_CONFIG.BASE_URL}${path}`;
    const res = await fetch(url, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
    return res.json();
}

/**
 * Normaliza la respuesta del backend a un array de productos.
 * Acepta: [ ... ] | { data: [...] } | { productos: [...] } | { content: [...] }
 */
function normalizarLista(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.productos)) return data.productos;
    if (Array.isArray(data?.content)) return data.content; // Spring Page
    return [];
}

/**
 * Obtiene todos los productos.
 * @returns {Promise<Array>}
 */
async function getProductos() {
    const data = await apiGet(API_CONFIG.ENDPOINTS.productos);
    return normalizarLista(data);
}

/**
 * Obtiene todas las categorías.
 * @returns {Promise<Array>}
 */
async function getCategorias() {
    const data = await apiGet(API_CONFIG.ENDPOINTS.categorias);
    return normalizarLista(data);
}

/**
 * Obtiene un producto por ID.
 * @param {number|string} id
 * @returns {Promise<Object|null>}
 */
async function getProductoPorId(id) {
    try {
        return await apiGet(API_CONFIG.ENDPOINTS.producto(id));
    } catch (err) {
        console.error("Error obteniendo producto:", err);
        return null;
    }
}

/**
 * Obtiene los productos en oferta.
 * @returns {Promise<Array>}
 */
async function getOfertas() {
    const data = await apiGet(API_CONFIG.ENDPOINTS.ofertas);
    return normalizarLista(data);
}