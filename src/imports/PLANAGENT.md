# ACTÚA COMO UN DESARROLLADOR FRONTEND SENIOR EXPERTO EN UI/UX

Diseña y desarrolla una aplicación web profesional para un sistema de GESTIÓN Y PRÉSTAMO DE HERRAMIENTAS para una institución educativa (estilo ferretería institucional).

---

# REGLAS DE NEGOCIO IMPORTANTES

1. NO es una tienda en línea.
2. NO existen procesos de compra, precios, descuentos, pasarelas de pago 
3. El flujo principal y exclusivo es solicitar, autorizar, prestar y devolver herramientas.
4. El sistema debe validar automáticamente que cada estudiante solo pueda solicitar herramientas autorizadas según su Carrera y Taller Asignado.
5. La interfaz debe ser moderna, elegante, minimalista y totalmente responsive (Desktop, Tablet y Móvil).
6. Mantener estrictamente el mismo lenguaje visual en todas las pantallas.
7. Priorizar productividad, claridad y facilidad de uso por encima de elementos comerciales.

---

# PROHIBIDO GENERAR

* Carrito de compras.
* Checkout.
* Sistema de pagos.
* Precios.
* Descuentos.
* Cupones.
* Wishlist comercial.
* Experiencia estilo Amazon, Mercado Libre o Shopify.

TODO EL SISTEMA DEBE ESTAR ORIENTADO EXCLUSIVAMENTE AL PRÉSTAMO Y DEVOLUCIÓN DE HERRAMIENTAS.

---

# TECNOLOGÍAS OBLIGATORIAS

Utilizar:

* React + TypeScript (tipado estricto)
* TailwindCSS
* shadcn/ui
* Lucide Icons
* Framer Motion
* React Hook Form
* Zod
* TanStack Query
* Zustand
* Recharts

El código debe ser limpio, modular, reutilizable y escalable.

---

# ESTILO VISUAL OBLIGATORIO

Aplicar SIEMPRE una estética Glassmorphism Premium inspirada en:

* Apple Vision Pro
* Microsoft Fluent Design
* Linear
* Notion
* Interfaces SaaS modernas de 2025-2026

Mantener consistencia visual en TODOS los componentes.

### Fondo

* Gradiente azul institucional.
* Tonos azules oscuros.
* Efectos suaves y modernos.

### Tarjetas y Paneles

* Transparencia.
* backdrop-blur.
* Bordes blancos semitransparentes.
* Border radius entre 18px y 24px.
* Sombras suaves.
* Profundidad visual.

### Interacciones

* Hover elegante.
* Elevación ligera.
* scale-102.
* Animaciones fluidas.
* Microinteracciones.

---

# PALETA DE COLORES PARA ESTADOS

🟢 Disponible

Verde esmeralda translúcido

🔴 Prestado / En Uso

Rojo coral translúcido

🟡 Reservado

Amarillo ámbar translúcido

⚪ Mantenimiento

Gris ceniza translúcido

🔵 Solicitud Pendiente

Azul institucional translúcido

---

# ROLES DEL SISTEMA

## Estudiante

Puede:

* Consultar herramientas disponibles.
* Solicitar préstamos.
* Ver historial.
* Gestionar favoritos.
* Recibir alertas.

## Encargado del Taller

Puede:

* Aprobar solicitudes.
* Rechazar solicitudes.
* Registrar devoluciones.
* Gestionar inventario.
* Enviar herramientas a mantenimiento.

## Administrador

Puede:

* Administrar usuarios.
* Administrar carreras.
* Administrar talleres.
* Gestionar reportes.
* Supervisar todo el sistema.

---

# NAVBAR SUPERIOR FIJA

Glassmorphism Premium.

Debe incluir:

* Buscador inteligente.
* Notificaciones con Badge.
* Avatar del usuario.
* Dropdown de perfil.
* Configuración.
* Cerrar sesión.
* Botón modo oscuro y claro.

---

# PANTALLA PRINCIPAL: INVENTARIO DE HERRAMIENTAS

NO utilizar apariencia de tienda online.

Mostrar un Grid responsive con tarjetas Glassmorphism.

Cada herramienta debe mostrar:

* Imagen.
* Nombre.
* Categoría.
* Código de inventario.
* Cantidad disponible.
* Estado actual.
* Ubicación del almacén.

Implementar:

* Skeleton loaders.
* Hover interactivo.
* Microanimaciones.
* Vista rápida.

---

# DETALLE DE HERRAMIENTA

Al hacer clic abrir un Modal o página de detalle.

Mostrar:

* Imagen grande.
* Descripción.
* Especificaciones técnicas.
* Marca.
* Código.
* Estado.
* Ubicación.
* Cantidad disponible.
* Tiempo máximo de préstamo.
* Historial reciente.
* Herramientas recomendadas para su taller.

Botón principal:

"Solicitar Préstamo"

---

# FORMULARIO DE SOLICITUD

Campos:

* Cantidad solicitada.
* Fecha de préstamo.
* Fecha estimada de devolución.
* Observaciones.

Mostrar:

* Resumen visual.
* Confirmación.
* Toast de éxito.

Validar:

* Disponibilidad.
* Carrera del estudiante.
* Taller autorizado.
* Cantidad disponible.

---

# PANEL DEL USUARIO

Layout con Sidebar Glassmorphism.

## Inicio

Dashboard con:

* Herramientas en posesión.
* Próximas devoluciones.
* Alertas.
* Estadísticas personales.
* Actividad reciente.

---

## Mis Préstamos

Tabla moderna con:

* Imagen.
* Herramienta.
* Fecha préstamo.
* Fecha devolución.
* Estado.

Estados:

* Activo
* Devuelto
* Atrasado
* Reservado
* Pendiente

Agregar:

* Buscador.
* Filtros.
* Paginación.

---

## Mi Cuenta

Mostrar:

* Foto.
* Nombre completo.
* Carnet.
* Correo institucional.
* Carrera.
* Taller asignado.
* Teléfono.

Permitir:

* Editar datos.
* Cambiar fotografía.

---

## Mi Carrera

Mostrar:

* Carrera.
* Especialidad.
* Taller.
* Herramientas autorizadas.
* Herramientas recomendadas.

---

## Herramientas Vistas

Carrusel horizontal.

Mostrar:

* Imagen.
* Nombre.
* Categoría.

---

## Mis Favoritos

Acceso rápido para solicitar herramientas frecuentes.

---

## Configuración

Permitir:

* Notificaciones.
* Tema oscuro.
* Tema claro.
* Cambio de contraseña.
* Seguridad.

---

# PANEL DEL ENCARGADO DEL TALLER

## Solicitudes

Tabla con:

* Alumno.
* Carrera.
* Herramienta.
* Fecha.
* Estado.

Acciones:

* Aprobar.
* Rechazar.
* Ver detalles.

---

## Préstamos Activos

Visualizar:

* Usuario.
* Herramienta.
* Fecha límite.
* Estado.

Registrar:

* Devoluciones.
* Retrasos.

---

## Inventario

CRUD completo.

Permitir:

* Agregar herramientas.
* Editar.
* Eliminar.
* Cambiar estados.
* Enviar a mantenimiento.

---

# PANEL ADMINISTRADOR

## Usuarios

Administrar:

* Estudiantes.
* Docentes.
* Encargados.
* Administradores.

Filtros:

* Carrera.
* Estado.

---

## Carreras

CRUD completo.

---

## Talleres

CRUD completo.

---

## Categorías

CRUD completo.

---

## Reportes

Mostrar gráficas modernas utilizando Recharts:

* Herramientas más prestadas.
* Préstamos por mes.
* Retrasos.
* Usuarios más activos.
* Herramientas en mantenimiento.

---

# SISTEMA DE NOTIFICACIONES

Implementar:

* Toasts.
* Alertas.
* Recordatorios.
* Confirmaciones.
* Avisos de retraso.
* Próximas devoluciones.

---

# MODELO DE DATOS

Entidades:

* Usuarios
* Roles
* Carreras
* Talleres
* Categorías
* Herramientas
* Solicitudes
* Préstamos
* Devoluciones
* Historial de movimientos
* Favoritos
* Notificaciones

---

# ARQUITECTURA DEL PROYECTO

src/

app/

components/

layouts/

pages/

routes/

hooks/

services/

store/

context/

types/

utils/

lib/

assets/

styles/

---

# COMPONENTES MODERNOS

Implementar:

* Cards Glassmorphism.
* Dialogs.
* Modales.
* Dropdowns.
* Tabs.
* Tooltips.
* Badges.
* Tables.
* Breadcrumbs.
* Skeleton loaders.
* Progress bars.
* Empty states elegantes.
* Gráficas modernas.

---

# EXPERIENCIA DE USUARIO

Agregar:

* Microinteracciones.
* Estados de carga.
* Confirmaciones visuales.
* Transiciones suaves.
* Accesibilidad.
* Navegación intuitiva.
* Animaciones fluidas con Framer Motion.

---

# RESPONSIVE

Debe funcionar perfectamente en:

* Desktop
* Tablet
* Smartphone

---

# IMPORTANTE

NO generes una tienda online.

NO diseñes una interfaz estilo Amazon, Mercado Libre o Shopify.

La experiencia debe parecer una plataforma empresarial moderna de gestión de inventario y préstamo de herramientas, inspirada en Apple Vision Pro, Microsoft Fluent Design, Notion, Linear y dashboards SaaS de 2025-2026.

Mantén un estilo Glassmorphism consistente en TODOS los componentes.

Prioriza la claridad, productividad y experiencia del usuario.

Todo el sistema debe estar orientado exclusivamente a la gestión, autorización, préstamo y devolución de herramientas.

Genera código limpio, modular, reutilizable, escalable y con tipado estricto en TypeScript.