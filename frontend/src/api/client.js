const API_URL = import.meta.env.VITE_API_URL;

export const api = async (endpoint, options = {}) => {
    // 1. Buscamos el token en el localStorage
    const token = localStorage.getItem('token');

    // 2. Armamos los headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Si hay token, lo agregamos al header Authorization
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // 3. Hacemos el fetch (igual que en vanilla JS)
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // 4. Manejo de error 401 (Sesión expirada)
    if (response.status === 401 && endpoint !== '/auth/login') {
        // Si falla, limpiamos todo y recargamos la página para ir al login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login'; 
        return;
    }

    // 5. Manejo de errores normales (400, 403, 404, etc)
    if (!response.ok) {
        // Si el backend devuelve un JSON con { error: "..." }, lo leemos
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error en la petición');
    }

    // 6. Si todo está bien (200, 201, etc.), devolvemos el JSON
    // Si es un 204 (No Content), no hay JSON que leer
    if (response.status === 204) return null;
    
    return response.json();
};

// --- Inventario ---
export const getItems = () => api('/items');
export const createItem = (item) => api('/items', { method: 'POST', body: JSON.stringify(item) });
export const updateItem = (id, campo, valor) => api(`/items/${id}`, { method: 'PATCH', body: JSON.stringify({ campo, valor }) });
export const deleteItem = (id) => api(`/items/${id}`, { method: 'DELETE' });
export const getPerfil = () => api('/perfil');

// --- Agenda ---
export const getCategorias = () => api('/agenda/categorias');
export const createCategoria = (data) => api('/agenda/categorias', { method: 'POST', body: JSON.stringify(data) });
export const updateCategoria = (id, data) => api(`/agenda/categorias/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCategoria = (id) => api(`/agenda/categorias/${id}`, { method: 'DELETE' });

export const getContactos = () => api('/agenda/contactos');
export const createContacto = (data) => api('/agenda/contactos', { method: 'POST', body: JSON.stringify(data) });
export const updateContacto = (id, data) => api(`/agenda/contactos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteContacto = (id) => api(`/agenda/contactos/${id}`, { method: 'DELETE' });

export const getMensajes = (id) => api(`/tickets/${id}/mensajes`);
export const createMensaje = (id, texto) => api(`/tickets/${id}/mensajes`, { method: 'POST', body: JSON.stringify({ texto }) });
export const cerrarTicket = (id) => api(`/tickets/${id}/cerrar`, { method: 'PATCH' });