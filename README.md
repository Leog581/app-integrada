# 🚀 App Integrada - Sistema de Gestión

Aplicación web Full-Stack que unifica tres módulos fundamentales para cualquier empresa: **Soporte Técnico (Tickets)**, **Control de Inventario** y **Agenda de Contactos**. Todo gestionado desde un único panel de control seguro con roles de usuario.

## 🚀 Tecnologías Utilizadas

**Frontend:**
* React.js + Vite
* Tailwind CSS (Diseño responsivo y moderno)
* React Router DOM (Navegación SPA y rutas protegidas)
* Context API (Manejo de estado global para autenticación)

**Backend:**
* Node.js + Express
* Sequelize (ORM para PostgreSQL)
* PostgreSQL (Base de datos alojada en Supabase)
* JSON Web Tokens (JWT) para autenticación
* Bcrypt para encriptación de contraseñas

## ⚙️ Módulos y Características

### 🔐 Autenticación y Seguridad
* Registro e Inicio de sesión con contraseñas hasheadas.
* Rutas protegidas en el Frontend y Backend mediante JWT.
* **Roles:** Los usuarios normales solo acceden a sus tickets y a la vista de lectura de la agenda. Los administradores tienen control total (Inventario y modificación de Agenda).

### 🎟️ Módulo de Tickets (Soporte)
* Creación de tickets con título y descripción.
* **Sistema de Chat:** Los usuarios y administradores pueden conversar dentro del ticket.
* **Flujo de estado automático:** Cuando un administrador responde por primera vez, el ticket pasa de "Abierto" a "En proceso".
* Cierre de tickets por parte del creador o del administrador una vez resuelto el problema.

### 📦 Módulo de Inventario (Solo Admin)
* CRUD completo de productos (código, descripción, cantidad, precio).
* Tarjetas de resumen con el valor total del inventario y la cantidad de artículos en stock en tiempo real.
* Edición rápida en línea (inline editing) de cantidades y precios.

### 📒 Módulo de Agenda de Contactos
* Gestión de contactos (Nombre, Apellido, Teléfono, Email).
* Sistema de categorías dinámico (crear y eliminar categorías).
* Buscador en tiempo real y filtro por categoría.
* Ordenamiento alfabético por columnas (A-Z, Z-A).
* *(Los usuarios no administradores tienen acceso de solo lectura a esta sección).*

## 🛠️ Instalación y Ejecución Local

Sigue estos pasos para correr el proyecto en tu computadora.

### 1. Clonar el repositorio

```bash
git clone https://github.com/Leog581/app-integrada.git
cd app-integrada
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en la carpeta `backend` con las siguientes variables:

```env
DATABASE_URL=tu_cadena_de_conexion_de_supabase
PORT=3000
JWT_SECRET=tu_secreto_jwt
FRONTEND_URL=http://localhost:5173
CRON_SECRET=tu_secreto_cron
```

Inicia el servidor:

```bash
npm run dev
```

### 3. Configurar el Frontend

Abrí otra terminal en la raíz del proyecto y ejecutá:

```bash
cd frontend
npm install
```

Crea un archivo `.env` en la carpeta `frontend`:

```env
VITE_API_URL=http://localhost:3000/api
```

Inicia la aplicación:

```bash
npm run dev
```

## 📌 Endpoints Principales de la API

### Autenticación y Usuarios
* `POST /api/auth/register` - Registro de usuario
* `POST /api/auth/login` - Inicio de sesión
* `GET /api/auth/me` - Obtener datos del usuario autenticado
* `GET /api/users` - Listar usuarios (Solo Admin)

### Tickets
* `POST /api/tickets` - Crear ticket
* `GET /api/tickets` - Listar tickets propios
* `GET /api/tickets/all` - Listar todos los tickets (Solo Admin)
* `GET /api/tickets/:id/mensajes` - Obtener historial de chat
* `POST /api/tickets/:id/mensajes` - Enviar mensaje en el ticket
* `PATCH /api/tickets/:id/cerrar` - Cerrar ticket

### Agenda
* `GET /api/agenda/contactos` - Listar contactos
* `POST /api/agenda/contactos` - Crear contacto (Solo Admin)
* `GET /api/agenda/categorias` - Listar categorías
* `POST /api/agenda/categorias` - Crear categoría (Solo Admin)

### Inventario (Solo Admin)
* `GET /api/items` - Listar productos y totales
* `POST /api/items` - Crear producto
* `PATCH /api/items/:id` - Actualizar cantidad/precio
* `DELETE /api/items/:id` - Eliminar producto

## ☁️ Despliegue en Vercel (Monorepo)

Este proyecto está estructurado como un Monorepo (Frontend y Backend en el mismo repositorio). Para desplegarlo:

1. **Backend:** Crear un proyecto en Vercel apuntando al directorio `/backend`. Configurar las variables de entorno (`DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`). Asegurarse de configurar `NODE_ENV=production`.
2. **Frontend:** Crear otro proyecto en Vercel apuntando al directorio `/frontend`. Configurar la variable `VITE_API_URL` con la URL del backend desplegado.

---
*Desarrollado como proyecto final para la materia Bases de Datos 2.*