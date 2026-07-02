# REMA — Frontend

**REMA** (Registro de Equipos y Materiales) es el frontend del sistema de gestión de inventario y préstamo de herramientas para un instituto técnico en Guatemala. Está desplegado en Vercel y se conecta al backend en Render.

---

## Tabla de Contenidos

- [Tech Stack](#tech-stack)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Routing](#routing)
- [Vistas Públicas](#vistas-públicas)
- [Autenticación](#autenticación)
- [Catálogo de Herramientas](#catálogo-de-herramientas)
- [Panel de Cuenta (7 sub-vistas)](#panel-de-cuenta-7-sub-vistas)
- [Panel Admin (9 sub-vistas)](#panel-admin-9-sub-vistas)
- [Integración con Backend API](#integración-con-backend-api)
- [Hooks API](#hooks-api)
- [Sistema de Diseño](#sistema-de-diseño)
- [Manejo de Estado](#manejo-de-estado)
- [Componentes UI](#componentes-ui-shadcnui)
- [Variables de Entorno](#variables-de-entorno)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Deploy en Vercel](#deploy-en-vercel)
- [Scripts](#scripts)
- [Dependencias](#dependencias)
- [Notas Técnicas](#notas-técnicas)
- [Atribuciones](#atribuciones)

---

## Tech Stack

| Categoría | Tecnología |
|-----------|-----------|
| **Framework** | React 18.3.1 + TypeScript 5.8 |
| **Build Tool** | Vite 6.3.5 |
| **Estilos** | Tailwind CSS v4.1.12 |
| **Animaciones** | Motion 12.23.24 |
| **UI Components** | shadcn/ui (48 componentes) + Radix UI primitives |
| **Data Fetching** | TanStack Query (React Query) 5.101 |
| **Routing** | React Router DOM 7.18 |
| **Gráficas** | Recharts |
| **PDF** | jspdf 4.2 + jspdf-autotable 5.0 |
| **Analytics** | @vercel/analytics 2.0 |
| **Utilidades** | clsx, class-variance-authority, tailwind-merge |

---

## Estructura del Proyecto

```
FrontendExpoMel/
├── index.html                     # Entrypoint HTML
├── vercel.json                    # Rewrites para SPA routing
├── vite.config.ts                 # Configuración de Vite + plugins
├── package.json                   # Dependencias y scripts
├── tsconfig.json                  # Config TypeScript
├── postcss.config.mjs             # PostCSS config
├── public/
│   └── imports/                   # Assets estáticos (imágenes)
├── db/
│   └── Rema.sql                   # Esquema MySQL de referencia
└── src/
    ├── main.tsx                   # Entrypoint: BrowserRouter + QueryClient
    ├── lib/
    │   ├── api.ts                 # ApiClient HTTP genérico (108 líneas)
    │   ├── auth.ts                # Helpers JWT (token, decode, isAuthenticated)
    │   └── mappers.ts             # Conversión tipos API → tipos frontend
    ├── hooks/                     # 11 hooks con TanStack Query
    │   ├── useAuth.ts
    │   ├── useTools.ts
    │   ├── useLoans.ts
    │   ├── useRequests.ts
    │   ├── useFavorites.ts
    │   ├── useAdmin.ts
    │   ├── useReports.ts
    │   ├── useIncidents.ts
    │   ├── useNotifications.ts
    │   ├── useProfile.ts
    │   └── useAppNavigate.ts
    ├── app/
    │   ├── App.tsx                # Orquestador de vistas (~268 líneas)
    │   ├── context/
    │   │   └── AppContext.tsx      # Estado global vía React Context
    │   ├── types/
    │   │   └── index.ts           # 295 líneas de tipos e interfaces
    │   ├── constants/
    │   │   └── design.ts          # Sistema de diseño (colores, glass, status map)
    │   ├── animate/
    │   │   └── variants.ts        # 7 variantes de animación Motion
    │   ├── utils/
    │   │   └── index.ts           # Helpers de fecha
    │   └── components/
    │       ├── atoms/             # Badge, Table, Toggle, Logo
    │       ├── ui/                # 48 componentes shadcn/ui pre-generados
    │       └── views/
    │           ├── Landing.tsx           # Landing page pública (353 líneas)
    │           ├── auth/
    │           │   ├── Login.tsx         # Inicio de sesión
    │           │   ├── Register.tsx      # Registro de estudiantes
    │           │   ├── ForgotPassword.tsx # Recuperación de contraseña
    │           │   └── VerifyCode.tsx    # Verificación de código
    │           ├── catalog/
    │           │   ├── CatalogView.tsx    # Catálogo con búsqueda y filtros
    │           │   ├── ToolModal.tsx      # Modal de detalle de herramienta
    │           │   └── LoanFormModal.tsx  # Formulario de préstamo multi-paso
    │           ├── account/
    │           │   └── AccountView.tsx    # Panel de cuenta (7 sub-vistas)
    │           └── admin/
    │               └── AdminView.tsx      # Panel administrativo (9 sub-vistas)
    └── styles/
        ├── index.css              # Entrypoint de estilos
        ├── tailwind.css           # Tailwind v4
        ├── theme.css              # Tema oscuro (CSS custom properties)
        └── fonts.css              # Google Fonts (Inter + Plus Jakarta Sans)
```

---

## Routing

La app usa `react-router-dom` con `BrowserRouter` en `main.tsx`. Sin embargo, las vistas no se definen como rutas de React Router — se orquestan manualmente en `App.tsx` mediante un estado `view` sincronizado con la URL a través de `useEffect` + `useNavigate`.

Cada cambio de vista actualiza la URL mediante `navigate()`, y cada navegación directa (o recarga) lee la URL para restaurar la vista correcta. Para que esto funcione en producción, `vercel.json` redirige todas las rutas a `index.html`.

| Ruta | Vista | Tipo | Descripción |
|------|-------|------|-------------|
| `/` | `landing` | Pública | Página principal |
| `/login` | `login` | Pública | Inicio de sesión |
| `/register` | `register` | Pública | Registro de estudiantes |
| `/forgot-password` | `forgot` | Pública | Recuperación de contraseña |
| `/verify-code` | `verify` | Pública | Verificación de código de 6 dígitos |
| `/catalog` | `catalog` | Pública (contenido varía) | Catálogo de herramientas |
| `/account` | `account` | Autenticada | Panel de cuenta |
| `/admin` | `admin` | Admin | Panel administrativo |

---

## Vistas Públicas

### Landing

Página principal con los siguientes componentes:

- **Navbar**: Logo REMA + navegación + botones de inicio de sesión y registro
- **Hero section**: Título principal con "R.E.M.A." animado en columnas interactivas, subtítulo y CTA
- **Features grid**: 4 tarjetas de funcionalidades (prestar, rastrear, gestionar, reportar) con iconos y descripciones
- **Testimonios**: Tarjetas con citas ficticias y avatares
- **FAQ**: Acordeón de preguntas frecuentes
- **CTA Banner**: Llamado a la acción con enlace al catálogo
- **Footer**: Enlaces y créditos

**Efectos visuales:**
- Glow radial que sigue la posición del mouse (solo en landing)
- Animaciones de entrada con Motion (fadeUp, scaleIn, slideLeft, slideRight)
- CSS keyframes: `borderRipple`, `glowPulse`
- Hover glow en tarjetas (`.glow-card`, `.glow-card-green`)

---

## Autenticación

### Login (`Login.tsx`)
- Diseño de dos columnas: izquierda con gradiente/imagen, derecha con formulario
- Campo de email (o nombre de usuario)
- Campo de contraseña con toggle de visibilidad
- Enlace a "Olvidé mi contraseña" y "Registrarse"
- Responsive: en mobile la columna izquierda se oculta

### Register (`Register.tsx`)
- Formulario con: nombre, email, contraseña, confirmar contraseña, selección de carrera
- Validaciones: contraseñas coincidentes, campos requeridos
- Al registrarse exitosamente, redirige a la vista de verificación de código

### Forgot Password (`ForgotPassword.tsx`)
- Campo de email
- Envía código de recuperación al backend
- Redirige a la vista de verificación

### Verify Code (`VerifyCode.tsx`)
- 6 inputs individuales para cada dígito del código
- Auto-avance al siguiente input al escribir
- Soporta pegado de código completo
- Modos: `register` (verificación post-registro) y `reset` (verificación post-forgot-password)
- En modo reset, después de verificar redirige a formulario de nueva contraseña

---

## Catálogo de Herramientas

### CatalogView (`CatalogView.tsx`)
- **Barra superior**: Selector de categoría, campo de búsqueda con autocompletado, carrito
- **Autocompletado**: Muestra sugerencias mientras se escribe (nombre y código)
- **Grid de herramientas**: Tarjetas con nombre, código, categoría, disponibilidad y estado
- **Indicador de disponibilidad**: Barra de progreso visual (verde/rojo según stock)
- **Estados**: Tooltip con badges de color (Disponible, En Uso, Mantenimiento, Reservado)
- **Acciones**: Click en tarjeta abre modal de detalle; botón "Solicitar" abre formulario de préstamo

### ToolModal (`ToolModal.tsx`)
- Modal con detalle completo de la herramienta:
  - Imagen, nombre, código, marca, ubicación
  - Especificaciones técnicas dinámicas (tabla clave-valor)
  - Cantidad total y disponible
  - Carreras asociadas
  - Días máximos de préstamo
  - Estado actual con badge de color
- Botón "Solicitar Préstamo" que abre LoanFormModal

### LoanFormModal (`LoanFormModal.tsx`)
- Formulario de 3 pasos:
  1. **Formulario**: Cantidad, fecha de inicio, fecha de devolución, notas
  2. **Confirmación**: Resumen de la solicitud
  3. **Éxito**: Confirmación de envío
- Validaciones: cantidad ≤ disponible, fechas coherentes

### Carrito de Compras
- Icono de carrito en la barra de catálogo con contador de items
- `CartModal.tsx`: modal que lista los items agregados con cantidad
- Botón "Solicitar Préstamo" para enviar todas las herramientas del carrito como una sola solicitud

---

## Panel de Cuenta (7 sub-vistas)

El panel de cuenta se accede desde `/account` y muestra un menú lateral con las siguientes secciones. Cada sección se renderiza dinámicamente mediante `React.createElement(sMap[state.accountSection])`.

| Sección | Icono | Componente | Descripción |
|---------|-------|-----------|-------------|
| **Inicio** | ⊞ | `AccountInicio` | KPIs: préstamos activos, vencidos, favoritos. Alertas de herramientas vencidas. Lista de equipos en posesión actual. |
| **Mis Préstamos** | 📋 | `AccountLoans` | Historial completo de préstamos con tabla: equipo, código, fecha préstamo, fecha devolución, estado (badge de color). |
| **Incidencias** | ⚠️ | `AccountIncidents` | Lista de incidencias reportadas + formulario para reportar una nueva (título, descripción, severidad). |
| **Mi Perfil** | 👤 | `AccountProfile` | Avatar, nombre, carné, email, taller, teléfono. Botón "Editar Perfil". |
| **Mi Carrera** | 🎓 | `AccountCareer` | Información de la carrera y taller asignado. Lista de herramientas autorizadas para esa carrera. |
| **Favoritos** | ⭐ | `AccountFavorites` | Grid de herramientas marcadas como favoritas con botones "Ver detalle" y "Solicitar". |
| **Configuración** | ⚙️ | `AccountSettings` | Toggles de notificaciones + formulario de cambio de contraseña. |

---

## Panel Admin (9 sub-vistas)

El panel admin se accede desde `/admin` (solo usuarios con rol `ADMIN`). Muestra un menú lateral con las siguientes secciones. Cada sección se renderiza dinámicamente mediante `React.createElement(pageMap[state.adminPage])`.

| Sección | Icono | Componente | Descripción |
|---------|-------|-----------|-------------|
| **Panel de Control** | ⊞ | `AdminPanel` | 6 tarjetas KPI: disponibles, en uso, mantenimiento, total herramientas, solicitudes pendientes, préstamos activos. Lista de actividad reciente. |
| **Estadísticas** | 📈 | `AdminEstadisticas` | 4 tarjetas de resumen + gráfico de barras de disponibilidad por área + gráfico de herramientas por área (recharts). |
| **Reportes** | 📄 | `AdminReportes` | 3 tarjetas de resumen + top 5 herramientas más solicitadas + historial completo de préstamos con botón de exportación a PDF. |
| **Solicitudes** | 📬 | `AdminSolicitudes` | Tabla de solicitudes con botones "Aprobar" y "Rechazar" por solicitud. |
| **Préstamos Activos** | 🔧 | `AdminActivos` | Tabla de préstamos activos/vencidos con botón "Registrar Devolución". |
| **Inventario** | 📦 | `AdminInventario` | Tabla completa de herramientas con selector de estado (editable inline), botones de editar (lápiz) y eliminar (papelera). |
| **Agregar Equipo** | ➕ | `AdminAgregar` | Formulario completo: nombre, código, marca, categoría, cantidad, días máximos, ubicación, estado, visibilidad (rol mínimo), carreras, imagen (URL), especificaciones técnicas (clave-valor dinámicas). Modo edición vs creación. |
| **Carreras** | 🎓 | `AdminCarreras` | Lista de carreras registradas con estadísticas + formulario "Crear Nueva Carrera" (nombre, icono, selector de color). |
| **Incidencias** | ⚠️ | `AdminIncidents` | KPIs de incidencias (abiertas, en progreso, resueltas, total) + lista completa con botón "Gestionar" para cambiar estado y añadir resolución. |

---

## Integración con Backend API

### ApiClient (`src/lib/api.ts`)

Cliente HTTP genérico que maneja:

- **Token JWT**: se almacena en `localStorage` y se envía como `Authorization: Bearer <token>` en cada petición
- **Manejo de errores**: si el backend responde con `UNAUTHORIZED`, limpia el token y ejecuta el callback `onUnauthorized`
- **Métodos**: `get`, `post`, `put`, `patch`, `delete`
- **URL base**: configurable via `VITE_API_URL`, con fallback a `https://repository-backendmelexpo.onrender.com/api`

### Mappers (`src/lib/mappers.ts`)

Convierten los tipos del backend (UPPER_SNAKE_CASE) a los tipos del frontend (lowercase):

| Tipo API | Tipo Frontend | Mapper |
|----------|---------------|--------|
| `ApiTool` | `Tool` | `mapApiToolToTool()` |
| `ApiLoan` | `Loan` | `mapApiLoanToLoan()` |
| `ApiRequest` | `AdminReq` | `mapApiRequestToAdminReq()` |
| `ApiCareer` | `Career` | `mapApiCareerToCareer()` |

**Mappings de estado:**
- `AVAILABLE` → `available`, `IN_USE` → `in_use`, `MAINTENANCE` → `maintenance`, `RESERVED` → `reserved`
- `ACTIVE` → `active`, `RETURNED` → `returned`, `OVERDUE` → `overdue`
- `PENDING` → `pending`, `APPROVED` → `approved`, `REJECTED` → `rejected`
- `specs` de `Record<string, string>` a `{ k: string; v: string }[]`

### Status Mapping en UI

El objeto `STATUS_MAP` en `design.ts` mapea cada estado a su label en español, color y background:

```ts
available   → { label: "Disponible",    color: green,  bg: "rgba(48,209,88,0.12)" }
in_use      → { label: "En Uso",        color: red,    bg: "rgba(255,69,58,0.12)" }
maintenance → { label: "Mantenimiento", color: muted,  bg: "rgba(107,127,168,0.12)" }
reserved    → { label: "Reservado",     color: orange, bg: "rgba(255,159,10,0.12)" }
active      → { label: "Activo",        color: blue,   bg: "rgba(10,132,255,0.12)" }
returned    → { label: "Devuelto",      color: green,  bg: "rgba(48,209,88,0.12)" }
overdue     → { label: "Atrasado",      color: red,    bg: "rgba(255,69,58,0.12)" }
pending     → { label: "Pendiente",     color: yellow, bg: "rgba(255,214,10,0.12)" }
approved    → { label: "Aprobado",      color: green,  bg: "rgba(48,209,88,0.12)" }
rejected    → { label: "Rechazado",     color: red,    bg: "rgba(255,69,58,0.12)" }
```

---

## Hooks API

11 hooks personalizados que encapsulan la lógica de fetching con TanStack Query y comunicación con el backend:

| Hook | Métodos | Endpoints API | Descripción |
|------|---------|---------------|-------------|
| `useAuth` | `login`, `register`, `me`, `changePassword`, `forgotPassword`, `verifyCode`, `resetPassword` | `POST /auth/*`, `GET /auth/me` | Autenticación completa |
| `useTools` | `tools`, `tool`, `toolMovements`, `createTool`, `updateTool`, `deleteTool`, `updateToolStatus` | `GET /tools/*`, `POST /tools`, `PUT /tools/:id`, `DELETE /tools/:id`, `PATCH /tools/:id/status` | CRUD de herramientas |
| `useLoans` | `loans`, `myLoans`, `createLoan`, `returnLoan` | `GET /loans`, `POST /loans`, `PATCH /loans/:id/return` | Gestión de préstamos |
| `useRequests` | `requests`, `createRequest`, `approveRequest`, `rejectRequest` | `GET /requests`, `POST /requests`, `PATCH /requests/:id/approve`, `PATCH /requests/:id/reject` | Solicitudes de préstamo |
| `useFavorites` | `favorites`, `addFavorite`, `removeFavorite` | `GET /user/favorites`, `POST /user/favorites/:toolId`, `DELETE /user/favorites/:toolId` | Favoritos |
| `useAdmin` | `users`, `createUser`, `updateUser`, `deleteUser`, `categories`, `createCategory`, `updateCategory`, `deleteCategory`, `careers`, `createCareer`, `updateCareer`, `deleteCareer`, `workshops`, `createWorkshop`, `updateWorkshop`, `deleteWorkshop` | `GET/POST/PUT/DELETE /admin/*` | CRUD administrativo |
| `useReports` | `topTools`, `loansByMonth`, `delays`, `activeUsers` | `GET /reports/*` | Reportes y estadísticas |
| `useIncidents` | `incidents`, `incident`, `incidentStats`, `createIncident`, `updateIncident`, `deleteIncident` | `GET/POST/PATCH/DELETE /incidents/*` | Gestión de incidencias |
| `useNotifications` | `notifications`, `markAsRead` | `GET /notifications`, `PATCH /notifications/:id/read` | Notificaciones in-app |
| `useProfile` | `updateProfile` | `PUT /user/profile` | Actualización de perfil |
| `useAppNavigate` | `goTo(view)`, `pathToViewType(path)` | N/A | Navegación programática entre vistas |

---

## Sistema de Diseño

### Tema Oscuro
- Fondo principal: `#060A14` con gradientes radiales sutiles
- Texto: `#E8EEFF`
- Esquema completo de CSS custom properties en `theme.css` con 42 variables
- Compatibilidad con Tailwind v4 mediante la directiva `@theme inline`

### Glassmorphism
Tres variantes definidas en `design.ts`:

| Variante | Uso | Características |
|----------|-----|----------------|
| `glass(opacity, blur)` | Cards, inputs, modales | Fondo semitransparente + backdrop-filter blur |
| `glassDark` | Modales, sidebars, toasts | Fondo oscuro sólido (#060A14 a 92%) + blur |
| `glassBlue` / `glassGreen` | Botones CTA | Gradiente lineal con sombra glow |

### Paleta de Colores
7 colores fijos definidos en el objeto `C`:

| Variable | Valor | Uso |
|----------|-------|-----|
| `C.blue` | `#0A84FF` | Primario, links, acentos |
| `C.green` | `#30D158` | Éxito, disponible, devuelto |
| `C.yellow` | `#FFD60A` | Pendiente, advertencias |
| `C.orange` | `#FF9F0A` | Reservado, alertas medias |
| `C.red` | `#FF453A` | Error, en uso, vencido, rechazado |
| `C.purple` | `#BF5AF2` | Acentos secundarios |
| `C.muted` | `#6B7FA8` | Texto secundario, mantenimiento |

### Tipografía
- **Inter**: Texto general y UI
- **Plus Jakarta Sans**: Títulos y letras decorativas (logo REMA)
- Cargadas desde Google Fonts con `@import` en `fonts.css`

### Animaciones (Motion)
7 variantes definidas en `variants.ts`:

| Variante | Propiedades | Uso típico |
|----------|------------|------------|
| `fadeUp` | Opacity 0→1, Y 18→0, delay escalonado | Cards, listas |
| `fadeIn` | Opacity 0→1, delay escalonado | Badges, elementos pequeños |
| `scaleIn` | Scale 0.94→1, spring suave | Modales, tooltips |
| `slideLeft` | X -14→0 | Elementos del sidebar |
| `slideRight` | X 20→0 | Paneles deslizantes |
| `viewTransition` | Opacity + Y, 0.38s | Transiciones entre vistas |
| `toastVariant` | Spring, scale 0.88→1 | Toast notifications |
| `backdropVariant` | Opacity fade | Fondos de modales |

---

## Manejo de Estado

### AppContext (React Context)
Estado global definido en `AppContext.tsx` con 44 campos que incluyen:

- **Vista actual**: `view`, `accountSection`, `adminPage`
- **Autenticación**: `user`, `isAuth`
- **Catálogo**: `tools`, `activeCat`, `searchQ`, `selectedTool`
- **Carrito**: `cart`, `cartModalOpen`
- **Préstamos**: `loanForm`, `loanStep`, `loanFormTool`
- **UI**: `toasts`, `showLoginPass`, `showRegPass`, etc.

**Métodos expuestos:**
- `update(partial)` — actualización parcial del estado
- `toast(msg, icon?, type?)` — mostrar notificación toast (auto-dismiss 3.5s)
- `getTool(id)` — buscar herramienta por ID
- `openToolDetail(t)`, `openLoanForm(t)` — acciones de UI
- `addToCart`, `removeFromCart`, `updateCartItem`, `clearCart` — gestión de carrito

### TanStack Query (React Query)
- Configuración global en `main.tsx`: `retry: 1`, `refetchOnWindowFocus: false`
- Cache automático de datos del backend
- Re-fetching controlado por hooks

### localStorage
- `rema_token`: Token JWT para autenticación
- Gestionado por `lib/auth.ts` (getToken, setToken, clearToken, isAuthenticated, decodeToken)

---

## Componentes UI (shadcn/ui)

48 componentes pre-generados en `src/app/components/ui/` basados en shadcn/ui. Cada componente sigue el patrón estándar de shadcn con `cn()` de `tailwind-merge` para合并 de clases y `class-variance-authority` para variantes.

Componentes incluidos: accordion, alert-dialog, avatar, badge, button, card, checkbox, collapsible, dialog, dropdown-menu, form, input, label, menubar, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, sheet, slider, switch, table, tabs, textarea, toast, toggle, tooltip, y más.

---

## Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `VITE_API_URL` | `https://repository-backendmelexpo.onrender.com/api` | URL base del backend API (incluye `/api`) |

La variable debe configurarse en el entorno de despliegue (Vercel). Si no se define, se usa el fallback hardcodeado en `src/lib/api.ts`.

---

## Instalación y Ejecución

### Local

**Requisitos previos:** Node.js 18+

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd FrontendExpoMel

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:5173
```

### Build de producción

```bash
npm run build
```

Esto genera la carpeta `dist/` con los archivos estáticos listos para desplegar.

---

## Deploy en Vercel

La aplicación está configurada para desplegarse en Vercel.

### Archivo `vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Este rewrite es necesario para que Vercel sirva `index.html` en todas las rutas, permitiendo que React Router maneje el routing del lado del cliente. Sin esto, recargar páginas como `/login` o `/catalog` devolvería 404.

### Configuración en Vercel

| Campo | Valor |
|-------|-------|
| **Framework** | Vite |
| **Build command** | `npm run build` |
| **Output directory** | `dist` |
| **Environment Variable** | `VITE_API_URL` = `https://repository-backendmelexpo.onrender.com/api` |

---

## Scripts

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `vite` | Inicia servidor de desarrollo en `http://localhost:5173` |
| `build` | `vite build` | Genera build de producción en `dist/` |

No hay scripts de test, lint, typecheck, CI/CD ni pre-commit hooks configurados.

---

## Dependencias

### Runtime (37)

```
@radix-ui/* (22 componentes), @tanstack/react-query,
@vercel/analytics, class-variance-authority, clsx,
jspdf, jspdf-autotable, motion, react, react-dom,
react-router-dom, tailwind-merge, tw-animate-css
```

### Dev (6)

```
@tailwindcss/vite, @types/react, @types/react-dom,
@vitejs/plugin-react, tailwindcss, vite
```

---

## Notas Técnicas

- **Plugin Vite figmaAssetResolver()**: Permite imports estilo `figma:asset/filename` que resuelven a `src/assets/filename`
- **Alias `@`**: Configurado en `vite.config.ts` apuntando a `./src`
- **assetsInclude**: Configurado para `*.svg` y `*.csv` (no agregar `.css`, `.tsx` ni `.ts`)
- **Analytics**: `@vercel/analytics` para tracking de visitas en producción
- **Sin testing/linting**: El proyecto no incluye configuraciones de test, lint, typecheck, CI/CD ni pre-commit hooks por ser un proyecto escolar
- **Imágenes**: Las imágenes del diseño original de Figma se almacenan en `public/imports/` y se referencian como `/imports/...`
- **Diseño responsive**: Media queries para tablets (max-width: 900px, 768px) y móviles (max-width: 600px) con ajustes de layout, tipografía y navegación

---

## Atribuciones

- [shadcn/ui](https://ui.shadcn.com) — Componentes UI (MIT)
- [Unsplash](https://unsplash.com) — Imágenes de herramientas y laboratorios
- [Motion](https://motion.dev) — Animaciones React
- [Radix UI](https://www.radix-ui.com) — Primitivas UI accesibles
- [Recharts](https://recharts.org) — Gráficas para estadísticas
- Diseño original: [expoOR en Figma](https://www.figma.com/design/SsV9W20W3fl5pgU5cwUPYe/expoOR)
