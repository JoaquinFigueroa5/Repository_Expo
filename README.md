# REMA

Sistema de gestión de inventario y préstamo de herramientas para instituto técnico (Guatemala).

Originalmente generado a partir de un diseño de Figma ([expoOR](https://www.figma.com/design/SsV9W20W3fl5pgU5cwUPYe/expoOR)).  
Actualmente es un frontend funcional con datos mock — sin backend conectado.

## Stack

| Tecnología | Versión |
|---|---|
| React + TypeScript | 18.3.1 |
| Vite | 6.3.5 |
| Tailwind CSS | 4.1.12 |
| Motion (animaciones) | 12.23.24 |
| shadcn/ui | 48 componentes |
| MUI (Material UI) | 7.3.5 |
| Radix UI | Primitivas |
| Recharts | Gráficas |
| react-router | 7.13.0 (instalado, no usado en vistas) |
| Vaul, Sonner, react-hook-form, date-fns | Utilidades |

## Vistas de la plataforma

Actualmente el sistema cuenta con las siguientes vistas, manejadas internamente con `useState` (sin react-router):

| Vista | Ruta lógica | Descripción |
|---|---|---|
| **Landing** | `view === "landing"` | Página principal con hero, features, testomonios, CTA. Incluye efecto de glow que sigue al mouse |
| **Login** | `view === "login"` | Inicio de sesión con email/contraseña |
| **Register** | `view === "register"` | Registro con nombre, email, contraseña, carrera |
| **Forgot Password** | `view === "forgot"` | Recuperación de contraseña |
| **Verify Code** | `view === "verify"` | Verificación de código de 6 dígitos |
| **Catalog** | `view === "catalog"` | Catálogo de herramientas con búsqueda, filtro por categoría, cuadrícula de herramientas, autocompletado |
| **Tool Modal** | (overlay) | Modal con detalles de herramienta (especificaciones, disponibilidad, carreras asociadas) |
| **Loan Form Modal** | (overlay) | Formulario de préstamo en 3 pasos: formulario → confirmación → éxito |
| **Account** | `view === "account"` | Panel de cuenta con 6 sub-vistas: Inicio, Préstamos, Perfil, Carrera, Favoritos, Configuración |
| **Admin** | `view === "admin"` | Panel administrativo con 8 sub-vistas: Panel, Estadísticas, Reportes, Solicitudes, Activos, Inventario, Agregar, Carreras |

## Instalación y uso local

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd MelExpo

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

Esto genera la carpeta `dist/` lista para deploy.

## Estructura del proyecto

```
src/
├── main.tsx                      # Entrypoint
├── styles/
│   ├── index.css                 # Estilos globales
│   ├── tailwind.css              # Tailwind v4
│   ├── theme.css                 # Tema activo (dark)
│   └── fonts.css                 # Google Fonts
└── app/
    ├── App.tsx                   # Orquestador (~60 líneas)
    ├── context/
    │   └── AppContext.tsx         # Estado global vía React Context
    ├── types/
    │   └── index.ts              # Interfaces compartidas
    ├── constants/
    │   └── design.ts             # Tokens de color, glass, utilerías
    ├── animate/
    │   └── variants.ts           # Variantes de animación (Motion)
    ├── utils/
    │   └── index.ts              # Funciones helper
    ├── data/
    │   ├── tools.ts              # 12 herramientas mock
    │   ├── loans.ts              # Préstamos y solicitudes mock
    │   ├── user.ts               # Usuario actual y carreras
    │   └── categories.ts         # Categorías e íconos
    ├── components/
    │   ├── atoms/                # Componentes atómicos
    │   │   ├── Badge.tsx
    │   │   ├── Table.tsx
    │   │   ├── Toggle.tsx
    │   │   └── Logo.tsx
    │   ├── ui/                   # 48 componentes shadcn/ui
    │   └── views/
    │       ├── Landing.tsx
    │       ├── auth/
    │       │   ├── Login.tsx
    │       │   ├── Register.tsx
    │       │   ├── ForgotPassword.tsx
    │       │   └── VerifyCode.tsx
    │       ├── catalog/
    │       │   ├── CatalogView.tsx
    │       │   ├── ToolModal.tsx
    │       │   └── LoanFormModal.tsx
    │       ├── account/
    │       │   └── AccountView.tsx     # 6 sub-vistas
    │       └── admin/
    │           └── AdminView.tsx       # 8 sub-vistas
└── imports/                      # Assets del diseño Figma
```

## Notas

- **Sin backend**: Toda la data es mock (`src/app/data/`). El archivo `db/Rema.sql` contiene el esquema de referencia para MySQL pero no está conectado.
- **Tema**: Usa CSS custom properties con modo oscuro (`.dark`). El tema activo está en `theme.css`.
- **Vite**: Tiene un plugin `figmaAssetResolver()` para imports estilo `figma:asset/` y alias `@` → `./src`.
- **Sin testing/linting**: No hay configuraciones de test, lint, typecheck, CI/CD, ni pre-commit hooks.

## Atribuciones

- [shadcn/ui](https://ui.shadcn.com) — componentes UI (MIT)
- [Unsplash](https://unsplash.com) — imágenes de herramientas y laboratorios
- [Motion](https://motion.dev) — animaciones React
- Diseño original: [expoOR en Figma](https://www.figma.com/design/SsV9W20W3fl5pgU5cwUPYe/expoOR)
