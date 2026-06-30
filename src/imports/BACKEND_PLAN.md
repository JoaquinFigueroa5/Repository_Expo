# PLAN — REMA v2: Backend Node.js + Integración Frontend

## Stack Backend

| Tecnología | Propósito |
|---|---|
| Node.js + TypeScript | Runtime |
| Express.js | Framework HTTP |
| Prisma | ORM + Migraciones |
| MySQL | Base de datos (compatibilidad con `Rema.sql`) |
| JWT + bcryptjs | Autenticación |
| Zod | Validación de schemas |
| cors | CORS para desarrollo |

---

## 1. MODELO DE DATOS COMPLETO — Prisma Schema

### Enums globales

```prisma
enum ToolStatus {
  AVAILABLE
  IN_USE
  MAINTENANCE
  RESERVED
}

enum LoanStatus {
  ACTIVE
  RETURNED
  OVERDUE
}

enum RequestStatus {
  PENDING
  APPROVED
  REJECTED
}

enum UserRole {
  STUDENT
  TEACHER
  COORDINATOR
  ADMIN
}

enum NotificationType {
  ALERT
  REMINDER
  INFO
}
```

---

### 1.1 User — Usuarios

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  carnet    String?
  phone     String?
  photo     String?
  career    String
  workshop  String?
  role      UserRole @default(STUDENT)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  requests         Request[]
  requestReviews   RequestReview[]
  loans            Loan[]
  favorites        Favorite[]
  notifications    Notification[]
  movements        Movement[]
}
```

**Mapeo `Rema.sql`:**

| `usuarios` columna | Modelo | Notas |
|---|---|---|
| `id_usuario` | `id` | |
| `nombre` | `name` | |
| `contraseña` | `password` | bcrypt hash |
| `correo_institucional` | `email` | |
| `carrera` | `career` | |
| `id_rol` | `role` (enum) | Alumno→STUDENT, Maestro→TEACHER, Coordinador→COORDINATOR |
| ❌ | `carnet` | Nuevo |
| ❌ | `phone` | Nuevo |
| ❌ | `photo` | Nuevo |
| ❌ | `workshop` | Nuevo |

### 1.2 Role — Roles (enum, no tabla)

Mapeo `Rema.sql`:
- `Alumno` → `STUDENT`
- `Maestro` → `TEACHER`
- `Coordinador` → `COORDINATOR`
- Nuevo: `ADMIN`

### 1.3 Career — Carreras

```prisma
model Career {
  id    Int    @id @default(autoincrement())
  name  String @unique
  color String?
  icon  String?

  workshopAssignments WorkshopCareer[]
}
```

Seed:
```
{ name: "Computación e Informática", color: "#0A84FF", icon: "💻" }
{ name: "Mecánica Automotriz",       color: "#FF9F0A", icon: "⚙️" }
{ name: "Electricidad y Electrónica", color: "#FFD60A", icon: "⚡" }
```

### 1.4 Category — Categorías

```prisma
model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  icon  String?
  color String?

  tools Tool[]
}
```

Seed:
```
{ name: "Computación",   icon: "💻", color: "#0A84FF" }
{ name: "Mecánica",      icon: "⚙️", color: "#FF9F0A" }
{ name: "Electricidad",  icon: "⚡", color: "#FFD60A" }
```

### 1.5 Workshop — Talleres

```prisma
model Workshop {
  id          Int    @id @default(autoincrement())
  name        String @unique
  description String?
  location    String?

  careers WorkshopCareer[]
}
```

### 1.6 WorkshopCareer — Carreras por Taller (pivote)

```prisma
model WorkshopCareer {
  workshopId Int
  careerName String

  workshop   Workshop @relation(fields: [workshopId], references: [id])

  @@id([workshopId, careerName])
}
```

### 1.7 Tool — Herramientas

```prisma
model Tool {
  id        Int        @id @default(autoincrement())
  name      String
  cat       String
  code      String     @unique
  desc      String?
  brand     String?
  location  String
  totalQty  Int
  available Int
  status    ToolStatus @default(AVAILABLE)
  image     String?
  maxDays   Int        @default(7)
  specs     Json?
  careers   Json
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  categoryId Int?
  category   Category?    @relation(fields: [categoryId], references: [id])
  requests   RequestItem[]
  loans      Loan[]
  favorites  Favorite[]
  movements  Movement[]
}
```

**Mapeo `Rema.sql`:**

| `herramientas` columna | Modelo | Notas |
|---|---|---|
| `id_herramienta` | `id` | |
| `nombre` | `name` | |
| `descripcion` | `desc` | |
| `stock` | `totalQty` | |
| `disponibilidad` (boolean) | `available` (número) | TRUE→stock, FALSE→0 |
| `no_estanteria` | `location` | |
| `carrera` (texto) | `careers` (JSON array) | |
| `solo_maestros` | valida rol en backend | No campo directo |
| ❌ | `cat`, `code`, `brand`, `image`, `maxDays`, `specs` | Nuevos campos |

**Mapeo frontend:**

| `Tool` (types) | Modelo |
|---|---|
| `id` | `id` |
| `name` | `name` |
| `cat` | `cat` |
| `code` | `code` |
| `desc` | `desc` |
| `brand` | `brand` |
| `location` | `location` |
| `totalQty` | `totalQty` |
| `available` | `available` |
| `status` | `status` (enum) |
| `image` | `image` |
| `maxDays` | `maxDays` |
| `specs` | `specs` (Json) |
| `careers` | `careers` (Json) |

### 1.8 Request — Solicitudes

```prisma
model Request {
  id        Int           @id @default(autoincrement())
  userId    Int
  status    RequestStatus @default(PENDING)
  reqDate   DateTime      @default(now())
  notes     String?
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  user      User          @relation(fields: [userId], references: [id])
  items     RequestItem[]
  review    RequestReview?
  loan      Loan?
}
```

**Mapeo frontend (`AdminReq`):**

| `AdminReq` (types) | Ruta en DB |
|---|---|
| `id` | Request.id |
| `toolId` | RequestItem.toolId |
| `qty` | RequestItem.qty |
| `startDate` | RequestItem.startDate |
| `endDate` | RequestItem.dueDate |
| `notes` | Request.notes |
| `status` | Request.status |
| `reqDate` | Request.reqDate |
| `student` | User.name (join) |
| `career` | User.career (join) |

### 1.9 RequestItem — Herramientas solicitadas (pivote)

```prisma
model RequestItem {
  id        Int      @id @default(autoincrement())
  requestId Int
  toolId    Int
  qty       Int
  startDate DateTime
  dueDate   DateTime

  request   Request  @relation(fields: [requestId], references: [id])
  tool      Tool     @relation(fields: [toolId], references: [id])
}
```

### 1.10 RequestReview — Revisión de solicitud

```prisma
model RequestReview {
  id            Int           @id @default(autoincrement())
  requestId     Int           @unique
  coordinatorId Int
  action        RequestStatus // APPROVED | REJECTED
  comment       String?
  reviewedAt    DateTime      @default(now())

  request       Request       @relation(fields: [requestId], references: [id])
  coordinator   User          @relation(fields: [coordinatorId], references: [id])
}
```

### 1.11 Loan — Préstamos

```prisma
model Loan {
  id         Int        @id @default(autoincrement())
  requestId  Int?       @unique
  userId     Int
  toolId     Int
  qty        Int
  loanDate   DateTime
  dueDate    DateTime
  returnDate DateTime?
  status     LoanStatus @default(ACTIVE)
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt

  user       User       @relation(fields: [userId], references: [id])
  tool       Tool       @relation(fields: [toolId], references: [id])
  request    Request?   @relation(fields: [requestId], references: [id])
  movements  Movement[]
}
```

### 1.12 Movement — Historial de movimientos

```prisma
model Movement {
  id          Int      @id @default(autoincrement())
  loanId      Int
  userId      Int?
  toolId      Int
  type        String   // "LOAN" | "RETURN" | "MAINTENANCE" | "RESERVED"
  description String?
  createdAt   DateTime @default(now())

  loan        Loan     @relation(fields: [loanId], references: [id])
  user        User?    @relation(fields: [userId], references: [id])
  tool        Tool     @relation(fields: [toolId], references: [id])
}
```

### 1.13 Favorite — Favoritos

```prisma
model Favorite {
  userId    Int
  toolId    Int
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
  tool      Tool     @relation(fields: [toolId], references: [id])

  @@id([userId, toolId])
}
```

### 1.14 Notification — Notificaciones

```prisma
model Notification {
  id        Int              @id @default(autoincrement())
  userId    Int
  title     String
  message   String
  type      NotificationType @default(INFO)
  read      Boolean          @default(false)
  link      String?
  createdAt DateTime         @default(now())

  user      User             @relation(fields: [userId], references: [id])
}
```

---

## 2. DIAGRAMA DE RELACIONES

```
User ──< Request ──< RequestItem >── Tool
 │        │
 │        └── RequestReview >── User (coordinator)
 │
 ├──< Loan >── Tool
 │    │
 │    └──< Movement >── Tool, User
 │
 ├──< Favorite >── Tool
 │
 └──< Notification

Category >── Tool

Career ──< WorkshopCareer >── Workshop

(User.role) ── enum: STUDENT | TEACHER | COORDINATOR | ADMIN
```

---

## 3. TABLA RESUMEN: MODELOS vs FUENTES

| Modelo (Prisma) | `Rema.sql` | Frontend types | Frontend data | Seed |
|---|---|---|---|---|
| **User** | ✅ `usuarios` | ❌ (CURRENT_USER) | ✅ `data/user.ts` | 3 usuarios |
| **Role** (enum) | ✅ `roles` | ❌ | ❌ | — |
| **Career** | ❌ (texto suelto) | ✅ `Career` | ✅ `CAREERS_DEFAULT` | 3 carreras |
| **Category** | ❌ | ❌ | ✅ `categories.ts` | 3 categorías |
| **Workshop** | ❌ | ❌ | ❌ | 2 talleres |
| **WorkshopCareer** | ❌ | ❌ | ❌ | 3 relaciones |
| **Tool** | ✅ `herramientas` | ✅ `Tool` | ✅ `TOOLS0` (12) | 22 + 12 herramientas |
| **Request** | ✅ `solicitudes` | ✅ `AdminReq` | ✅ `ADMIN_REQS0` (3) | 3 solicitudes |
| **RequestItem** | ❌ (embebido) | ❌ (embebido) | ❌ (embebido) | 3 items |
| **RequestReview** | ❌ (id_coordinador) | ❌ | ❌ | 1 review |
| **Loan** | ❌ | ✅ `Loan` | ✅ `LOANS0` (4) | 4 préstamos |
| **Movement** | ❌ | ❌ | ❌ | 4 movimientos |
| **Favorite** | ❌ | `favorites: number[]` | AppContext | 2 favoritos |
| **Notification** | ❌ | `ToastItem` (solo UI) | ❌ | — |
| **Report** | ✅ `reportes` | ❌ (vista esbozada) | ❌ | — |

---

## 4. API ENDPOINTS COMPLETOS

### 4.1 Auth (`/api/auth`)

```
POST   /api/auth/login         → { email, password } → { token, user }
POST   /api/auth/register      → { name, email, password, career } → { token, user }
GET    /api/auth/me            → { user }  (requiere JWT)
PUT    /api/auth/password      → { oldPassword, newPassword } → { message }
```

### 4.2 Tools (`/api/tools`)

```
GET    /api/tools              → Tool[] (query: ?cat, ?career, ?search, ?status)
GET    /api/tools/:id          → Tool + recentMovements (últimos 3 movimientos)
POST   /api/tools              → Tool  (solo COORDINATOR, ADMIN)
PUT    /api/tools/:id          → Tool  (solo COORDINATOR, ADMIN)
DELETE /api/tools/:id          → 204   (solo ADMIN)
PATCH  /api/tools/:id/status   → { status } → Tool
```

### 4.3 Requests (`/api/requests`)

```
GET    /api/requests           → Request[] (query: ?status, ?userId)
POST   /api/requests           → { toolId, qty, startDate, endDate, notes } → Request
PATCH  /api/requests/:id/approve → { coordinatorId } → Request (solo COORDINATOR, ADMIN)
PATCH  /api/requests/:id/reject  → { comment? } → Request (solo COORDINATOR, ADMIN)
```

### 4.4 Loans (`/api/loans`)

```
GET    /api/loans              → Loan[] (query: ?status, ?userId, ?overdue)
POST   /api/loans              → { requestId?, toolId, userId, qty, loanDate, dueDate } → Loan
PATCH  /api/loans/:id/return   → { returnDate } → Loan
```

### 4.5 User-specific (`/api/user`)

```
GET    /api/user/loans         → Loan[] (del token, filtro ?status)
GET    /api/user/requests      → Request[] (del token, filtro ?status)
GET    /api/user/favorites     → Tool[] (favoritos del token)
POST   /api/user/favorites/:toolId → { message }
DELETE /api/user/favorites/:toolId → 204
PUT    /api/user/profile       → { name?, phone?, carnet? } → User
```

### 4.6 Admin (`/api/admin`)

```
GET    /api/admin/stats        → { totalTools, available, inUse, maintenance, pendingReqs, activeLoans, totalUsers }

GET    /api/admin/users        → User[] (query: ?role, ?career)
POST   /api/admin/users        → User
PUT    /api/admin/users/:id    → User
DELETE /api/admin/users/:id    → 204

GET    /api/admin/careers      → Career[]
POST   /api/admin/careers      → Career
PUT    /api/admin/careers/:id  → Career
DELETE /api/admin/careers/:id  → 204

GET    /api/admin/categories   → Category[]
POST   /api/admin/categories   → Category
PUT    /api/admin/categories/:id → Category
DELETE /api/admin/categories/:id → 204

GET    /api/admin/workshops    → Workshop[]
POST   /api/admin/workshops    → Workshop
PUT    /api/admin/workshops/:id → Workshop
DELETE /api/admin/workshops/:id → 204
```

### 4.7 Reports (`/api/reports`)

```
GET    /api/reports/top-tools       → [{ name, count }]
GET    /api/reports/loans-by-month  → [{ month, count, year }]
GET    /api/reports/delays          → { totalOverdue, totalActive, rate }
GET    /api/reports/active-users    → [{ name, loanCount }]
```

### 4.8 Notifications (`/api/notifications`)

```
GET    /api/notifications           → Notification[] (query: ?unreadOnly)
PATCH  /api/notifications/:id/read  → Notification
```

---

## 5. ESTRUCTURA DEL BACKEND

```
BackendExpoMel
├── package.json
├── tsconfig.json
├── .env
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── index.ts
│   ├── config/
│   │   └── env.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── roles.ts
│   │   ├── validate.ts
│   │   └── errorHandler.ts
│   ├── routes/
│   │   ├── index.ts              # Router principal
│   │   ├── auth.routes.ts
│   │   ├── tools.routes.ts
│   │   ├── requests.routes.ts
│   │   ├── loans.routes.ts
│   │   ├── user.routes.ts
│   │   ├── admin.routes.ts
│   │   ├── reports.routes.ts
│   │   └── notifications.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── tools.controller.ts
│   │   ├── requests.controller.ts
│   │   ├── loans.controller.ts
│   │   ├── user.controller.ts
│   │   ├── admin.controller.ts
│   │   ├── reports.controller.ts
│   │   └── notifications.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── tool.service.ts
│   │   ├── request.service.ts
│   │   ├── loan.service.ts
│   │   ├── notification.service.ts
│   │   ├── stats.service.ts
│   │   └── movement.service.ts
│   ├── validators/
│   │   ├── auth.schema.ts
│   │   ├── tool.schema.ts
│   │   ├── request.schema.ts
│   │   └── user.schema.ts
│   ├── errors/
│   │   └── AppError.ts
│   ├── types/
│   │   ├── express.d.ts
│   │   └── index.ts
│   └── utils/
│       ├── response.ts           # Formateador de respuestas
│       └── jwt.ts                # Helpers JWT
└── tests/
```

---

## 6. FORMATO DE RESPUESTA CONSISTENTE

Todas las respuestas siguen la misma estructura:

```typescript
// Éxito — objeto único
{ success: true, data: T }

// Éxito — lista
{ success: true, data: T[], meta?: { total: number, page: number, limit: number } }

// Error
{ success: false, error: { code: string, message: string, details?: any[] } }
```

**Helpers en `src/utils/response.ts`:**

```typescript
export function ok<T>(data: T, meta?: PaginationMeta) {
  return { success: true, data, ...(meta && { meta }) }
}

export function created<T>(data: T) {
  return { success: true, data }
}

export function noContent() {
  return { success: true, data: null }
}

export function fail(code: string, message: string, details?: any) {
  return { success: false, error: { code, message, ...(details && { details }) } }
}
```

---

## 7. MANEJO DE ERRORES CENTRALIZADO

### `src/errors/AppError.ts`

```typescript
export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly details?: any

  constructor(statusCode: number, code: string, message: string, details?: any) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }

  static notFound(entity: string) {
    return new AppError(404, 'NOT_FOUND', `${entity} no encontrado`)
  }

  static badRequest(message: string, details?: any) {
    return new AppError(400, 'BAD_REQUEST', message, details)
  }

  static unauthorized(message = 'No autorizado') {
    return new AppError(401, 'UNAUTHORIZED', message)
  }

  static forbidden(message = 'Acceso denegado') {
    return new AppError(403, 'FORBIDDEN', message)
  }

  static conflict(message: string) {
    return new AppError(409, 'CONFLICT', message)
  }

  static validation(details: any) {
    return new AppError(422, 'VALIDATION_ERROR', 'Error de validación', details)
  }
}
```

### `src/middleware/errorHandler.ts`

```typescript
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  // AppError conocido
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(fail(err.code, err.message, err.details))
  }

  // Errores Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') return res.status(409).json(fail('DUPLICATE', 'El registro ya existe'))
    if (err.code === 'P2025') return res.status(404).json(fail('NOT_FOUND', 'Registro no encontrado'))
    if (err.code === 'P2003') return res.status(400).json(fail('FK_ERROR', 'Error de referencia'))
  }

  // Error Zod
  if (err instanceof ZodError) {
    return res.status(422).json(fail('VALIDATION_ERROR', 'Error de validación', err.errors))
  }

  // Error genérico
  console.error('Unhandled error:', err)
  return res.status(500).json(fail('INTERNAL_ERROR', 'Error interno del servidor'))
}
```

### Códigos de error estándar

| Código | HTTP | Cuándo ocurre |
|---|---|---|
| `NOT_FOUND` | 404 | Recurso no existe |
| `BAD_REQUEST` | 400 | Parámetros inválidos |
| `VALIDATION_ERROR` | 422 | Zod validation fail |
| `UNAUTHORIZED` | 401 | Token inválido/expirado |
| `FORBIDDEN` | 403 | Rol no autorizado |
| `DUPLICATE` | 409 | Unique constraint |
| `INSUFFICIENT_STOCK` | 400 | qty > available |
| `CAREER_MISMATCH` | 400 | Herramienta no pertenece a la carrera del user |
| `TOOL_IN_MAINTENANCE` | 400 | Herramienta en mantenimiento |
| `ALREADY_ACTIONED` | 409 | Solicitud ya aprobada/rechazada |
| `INTERNAL_ERROR` | 500 | Error no manejado |

---

## 8. CAPA DE SERVICIOS — Lógica de negocio

Cada servicio encapsula las reglas de negocio y operaciones de base de datos.

### `src/services/auth.service.ts`

```typescript
export class AuthService {
  async register(data: RegisterInput): Promise<{ token: string; user: UserSafe }> {
    // 1. Verificar email único
    // 2. Hashear password con bcrypt
    // 3. Crear User en DB
    // 4. Generar JWT { userId, role }
    // 5. Retornar { token, user } (sin password)
  }

  async login(data: LoginInput): Promise<{ token: string; user: UserSafe }> {
    // 1. Buscar user por email
    // 2. Comparar password con bcrypt
    // 3. Generar JWT
    // 4. Retornar { token, user }
  }

  async getMe(userId: number): Promise<UserSafe> {
    // 1. Buscar user por id
    // 2. Excluir password del response
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
    // 1. Verificar oldPassword
    // 2. Hashear newPassword
    // 3. Actualizar en DB
  }
}
```

### `src/services/tool.service.ts`

```typescript
export class ToolService {
  async list(filters: ToolFilters): Promise<Tool[]> {
    // 1. Construir where clause dinámico:
    //    - Por categoría (?cat)
    //    - Por carrera (?career → filtrar careers JSON)
    //    - Por búsqueda (?search → name o code contiene)
    //    - Por estado (?status)
    // 2. Order by name ASC
    // 3. Retornar tools con categoría incluida
  }

  async getById(id: number): Promise<ToolWithHistory> {
    // 1. Buscar tool con category + últimos 3 movements
    // 2. Lanzar AppError.notFound si no existe
  }

  async create(data: CreateToolInput): Promise<Tool> {
    // 1. Validar code único
    // 2. Crear tool
    // 3. Si categoryId, verificar que categoría exista
  }

  async update(id: number, data: UpdateToolInput): Promise<Tool> {
    // 1. Verificar que tool existe
    // 2. Si cambia code, verificar uniqueness
    // 3. Actualizar tool
  }

  async delete(id: number): Promise<void> {
    // 1. Verificar que tool existe
    // 2. Verificar que tool no tiene loans activos
    // 3. Eliminar (o soft delete si se requiere)
  }

  async changeStatus(id: number, status: ToolStatus): Promise<Tool> {
    // 1. Verificar que tool existe
    // 2. Validar transición de estado permitida
    //    - AVAILABLE ↔ IN_USE, MAINTENANCE, RESERVED
    //    - IN_USE → MAINTENANCE (solo si todas las copias están devueltas)
    // 3. Actualizar status
    // 4. Crear Movement si aplica (MAINTENANCE, RESERVED)
  }

  async validateAvailability(toolId: number, qty: number): Promise<void> {
    // 1. Buscar tool
    // 2. Verificar status === AVAILABLE
    // 3. Verificar qty <= available
    // 4. Lanzar AppError si alguna falla
  }

  async validateCareerAccess(toolId: number, userCareer: string): Promise<void> {
    // 1. Buscar tool
    // 2. Verificar que userCareer esté en tool.careers (JSON array)
    // 3. Lanzar AppError si no coincide
  }
}
```

### `src/services/request.service.ts`

```typescript
export class RequestService {
  async list(filters: { status?: RequestStatus; userId?: number }): Promise<Request[]> {
    // 1. Construir where clause
    // 2. Incluir user (name, career), items (con tool), review
    // 3. Order by reqDate DESC
  }

  async create(userId: number, data: CreateRequestInput): Promise<Request> {
    // 1. Obtener user (con career)
    // 2. Validar que user.role === STUDENT (solo estudiantes crean solicitudes)
    // 3. Por cada tool en la solicitud:
    //    a. toolService.validateAvailability(toolId, qty)
    //    b. toolService.validateCareerAccess(toolId, user.career)
    //    c. Verificar dueDate - startDate <= tool.maxDays
    // 4. Crear Request + RequestItem en transacción Prisma
    // 5. notificationService.notifyCoordinators('NUEVA_SOLICITUD', request)
    // 6. Retornar request con relaciones
  }

  async approve(requestId: number, coordinatorId: number): Promise<Request> {
    // 1. Buscar Request con items + tool
    // 2. Verificar status === PENDING
    // 3. Validar disponibilidad actual (pudo cambiar desde la creación)
    // 4. En transacción:
    //    a. Request.status = APPROVED
    //    b. Crear RequestReview { coordinatorId, action: APPROVED }
    //    c. Crear Loan { requestId, userId, toolId, qty, loanDate, dueDate }
    //    d. Tool.available -= qty
    //    e. Si Tool.available === 0 → Tool.status = IN_USE
    //    f. Crear Movement { type: "LOAN", description: "Préstamo por solicitud #X" }
    // 5. notificationService.notifyUser(request.userId, 'SOLICITUD_APROBADA')
    // 6. Retornar request actualizado
  }

  async reject(requestId: number, coordinatorId: number, comment?: string): Promise<Request> {
    // 1. Verificar status === PENDING
    // 2. En transacción:
    //    a. Request.status = REJECTED
    //    b. Crear RequestReview { coordinatorId, action: REJECTED, comment }
    // 3. notificationService.notifyUser(request.userId, 'SOLICITUD_RECHAZADA')
    // 4. Retornar request actualizado
  }
}
```

### `src/services/loan.service.ts`

```typescript
export class LoanService {
  async list(filters: { status?: LoanStatus; userId?: number; overdue?: boolean }): Promise<Loan[]> {
    // 1. Si overdue === true, filtrar dueDate < now y status !== RETURNED
    // 2. Incluir user (name), tool (name, image)
    // 3. Order by loanDate DESC
  }

  async create(data: CreateLoanInput): Promise<Loan> {
    // 1. Validar disponibilidad de la herramienta
    // 2. Crear Loan
    // 3. Tool.available -= qty
    // 4. Si Tool.available === 0 → Tool.status = IN_USE
    // 5. Crear Movement { type: "LOAN" }
    // 6. Retornar loan con relaciones
  }

  async return(loanId: number, returnDate: string): Promise<Loan> {
    // 1. Buscar loan con tool
    // 2. Verificar status === ACTIVE
    // 3. En transacción:
    //    a. Loan.returnDate = returnDate
    //    b. Loan.status = RETURNED
    //    c. Tool.available += qty
    //    d. Tool.status = AVAILABLE (si estaba IN_USE y available > 0)
    //    e. Crear Movement { type: "RETURN", description: "Devuelto el ..." }
    // 4. notificationService.notifyUser(loan.userId, 'DEVOLUCION_REGISTRADA')
    // 5. Retornar loan actualizado
  }

  async checkOverdueLoans(): Promise<number> {
    // 1. Buscar loans con dueDate < now y status === ACTIVE
    // 2. Actualizar status = OVERDUE
    // 3. Para cada uno, notificar al usuario
    // 4. Retornar cantidad de loans marcados
  }

  async getUpcomingReturns(daysAhead: number = 2): Promise<Loan[]> {
    // 1. Buscar loans con dueDate entre hoy y hoy+daysAhead, status === ACTIVE
    // 2. Retornar para envío de recordatorios
  }
}
```

### `src/services/notification.service.ts`

```typescript
export class NotificationService {
  async create(userId: number, title: string, message: string, type: NotificationType, link?: string): Promise<Notification> {
    // Crear notificación en DB
  }

  async notifyCoordinators(title: string, message: string, link?: string): Promise<void> {
    // Buscar todos los usuarios con role COORDINATOR o ADMIN
    // Crear notificación para cada uno
  }

  async notifyRequestApproved(request: Request): Promise<void> {
    // Notificar al estudiante que su solicitud fue aprobada
    // Incluir link a /account/loans
  }

  async notifyRequestRejected(request: Request, comment?: string): Promise<void> {
    // Notificar al estudiante que su solicitud fue rechazada
  }

  async notifyLoanReturned(loan: Loan): Promise<void> {
    // Notificar que la devolución fue registrada
  }

  async notifyDueSoon(loan: Loan): Promise<void> {
    // Notificar que el préstamo vence pronto
  }

  async notifyOverdue(loan: Loan): Promise<void> {
    // Notificar que el préstamo está vencido
  }
}
```

### `src/services/stats.service.ts`

```typescript
export class StatsService {
  async getDashboardStats(): Promise<DashboardStats> {
    // 1. Contar tools por status
    // 2. Contar loans activos
    // 3. Contar requests pending
    // 4. Contar total users
    // 5. Retornar { totalTools, available, inUse, maintenance, pendingReqs, activeLoans, totalUsers }
  }

  async getTopTools(limit: number = 5): Promise<{ name: string; count: number }[]> {
    // GROUP BY toolId en Loan, COUNT, ORDER BY count DESC, LIMIT
  }

  async getLoansByMonth(): Promise<{ year: number; month: number; count: number }[]> {
    // GROUP BY YEAR(loanDate), MONTH(loanDate), COUNT
  }

  async getDelays(): Promise<{ totalOverdue: number; totalActive: number; rate: number }> {
    // Contar loans OVERDUE, ACTIVE, calcular tasa de retraso
  }

  async getActiveUsers(limit: number = 5): Promise<{ name: string; loanCount: number }[]> {
    // GROUP BY userId en Loan, COUNT, ORDER BY count DESC, LIMIT
  }
}
```

---

## 9. CONTROLADORES — Pseudocódigo detallado

Cada controlador sigue el patrón:
1. Extraer datos validados del body/params/query
2. Llamar al servicio correspondiente
3. Formatear respuesta con helper `ok()`, `created()`, etc.
4. Catch errors → `next(err)` (los captura errorHandler)

### `auth.controller.ts`

```
POST /login
  1. validate(loginSchema) → { email, password }
  2. authService.login(email, password)
  3. res.json(ok({ token, user }))

POST /register
  1. validate(registerSchema) → { name, email, password, career }
  2. authService.register(data)
  3. res.status(201).json(created({ token, user }))

GET /me
  1. req.userId (del middleware auth)
  2. authService.getMe(req.userId)
  3. res.json(ok(user))

PUT /password
  1. validate(passwordSchema) → { oldPassword, newPassword }
  2. authService.changePassword(req.userId, oldPassword, newPassword)
  3. res.json(ok({ message: "Contraseña actualizada" }))
```

### `tools.controller.ts`

```
GET /tools
  1. Extraer query: cat?, career?, search?, status?
  2. toolService.list({ cat, career, search, status })
  3. res.json(ok(tools))

GET /tools/:id
  1. Validar id numérico (Zod)
  2. toolService.getById(id)
  3. res.json(ok(tool))

POST /tools
  1. validate(createToolSchema) → data
  2. toolService.create(data)
  3. res.status(201).json(created(tool))

PUT /tools/:id
  1. validate(updateToolSchema) → data
  2. toolService.update(id, data)
  3. res.json(ok(tool))

DELETE /tools/:id
  1. toolService.delete(id)
  2. res.status(204).json(noContent())

PATCH /tools/:id/status
  1. validate(statusSchema) → { status }
  2. toolService.changeStatus(id, status)
  3. res.json(ok(tool))
```

### `requests.controller.ts`

```
GET /requests
  1. Extraer query: status?, userId?
  2. requestService.list({ status, userId })
  3. res.json(ok(requests))

POST /requests
  1. validate(createRequestSchema) → data
  2. requestService.create(req.userId, data)
  3. res.status(201).json(created(request))

PATCH /requests/:id/approve
  1. requestService.approve(id, req.userId)
  2. res.json(ok(request))

PATCH /requests/:id/reject
  1. validate(rejectSchema) → { comment? }
  2. requestService.reject(id, req.userId, comment)
  3. res.json(ok(request))
```

### `loans.controller.ts`

```
GET /loans
  1. Extraer query: status?, userId?, overdue?
  2. loanService.list({ status, userId, overdue })
  3. res.json(ok(loans))

POST /loans
  1. validate(createLoanSchema) → data
  2. loanService.create(data)
  3. res.status(201).json(created(loan))

PATCH /loans/:id/return
  1. validate(returnSchema) → { returnDate }
  2. loanService.return(id, returnDate)
  3. res.json(ok(loan))
```

### `user.controller.ts`

```
GET /user/loans
  1. req.userId + query: status?
  2. loanService.list({ userId: req.userId, status })
  3. res.json(ok(loans))

GET /user/requests
  1. req.userId + query: status?
  2. requestService.list({ userId: req.userId, status })
  3. res.json(ok(requests))

GET /user/favorites
  1. Buscar favorites por userId
  2. Retornar tools (join)
  3. res.json(ok(tools))

POST /user/favorites/:toolId
  1. Crear favorite con upsert (evita duplicados)
  2. res.json(ok({ message: "Agregado a favoritos" }))

DELETE /user/favorites/:toolId
  1. Eliminar favorite por compound key
  2. res.status(204).json(noContent())

PUT /user/profile
  1. validate(updateProfileSchema) → data
  2. Actualizar user en DB
  3. res.json(ok(user))
```

### `admin.controller.ts`

```
GET /admin/stats
  1. statsService.getDashboardStats()
  2. res.json(ok(stats))

// Users CRUD
GET    /admin/users → userService.list(filters)
POST   /admin/users → validate(createUserSchema) → userService.create(data) → 201
PUT    /admin/users/:id → validate(updateUserSchema) → userService.update(id, data)
DELETE /admin/users/:id → userService.delete(id) → 204

// Careers CRUD
GET    /admin/careers → prisma.career.findMany()
POST   /admin/careers → validate(careerSchema) → prisma.career.create()
PUT    /admin/careers/:id → prisma.career.update()
DELETE /admin/careers/:id → prisma.career.delete()

// Categories CRUD (ídem careers)
// Workshops CRUD (ídem careers)
```

### `reports.controller.ts`

```
GET /reports/top-tools       → statsService.getTopTools()        → res.json(ok(data))
GET /reports/loans-by-month  → statsService.getLoansByMonth()    → res.json(ok(data))
GET /reports/delays          → statsService.getDelays()          → res.json(ok(data))
GET /reports/active-users    → statsService.getActiveUsers()     → res.json(ok(data))
```

### `notifications.controller.ts`

```
GET /notifications
  1. Extraer query: unreadOnly?
  2. prisma.notification.findMany({ where: { userId: req.userId, ...(unreadOnly && { read: false }) }, orderBy: { createdAt: 'desc' } })
  3. res.json(ok(notifications))

PATCH /notifications/:id/read
  1. prisma.notification.update({ where: { id }, data: { read: true } })
  2. res.json(ok(notification))
```

---

## 10. TRANSICIONES DE ESTADO

```
Tool:
  AVAILABLE ──→ IN_USE       (cuando se crea un préstamo y available === 0)
  AVAILABLE ──→ MAINTENANCE  (acción manual del encargado)
  AVAILABLE ──→ RESERVED     (acción manual del encargado)
  IN_USE ──→ AVAILABLE       (cuando se devuelve y available > 0)
  IN_USE ──→ MAINTENANCE     (acción manual, solo si todas las copias están de vuelta)
  MAINTENANCE ──→ AVAILABLE  (acción manual)
  RESERVED ──→ AVAILABLE     (acción manual)

Loan:
  ACTIVE ──→ RETURNED        (devolución registrada)
  ACTIVE ──→ OVERDUE         (automático: dueDate < now)

Request:
  PENDING ──→ APPROVED       (acción del coordinador/admin)
  PENDING ──→ REJECTED       (acción del coordinador/admin)
  (Una vez APPROVED o REJECTED, no se puede cambiar)
```

Validaciones en cada transición:

| Transición | Quién | Validaciones |
|---|---|---|
| Tool → MAINTENANCE | COORDINATOR, ADMIN | Tool debe existir |
| Tool → AVAILABLE | COORDINATOR, ADMIN | Tool debe estar en MAINTENANCE o RESERVED |
| Request → APPROVED | COORDINATOR, ADMIN | Status debe ser PENDING, stock suficiente |
| Request → REJECTED | COORDINATOR, ADMIN | Status debe ser PENDING |
| Loan → RETURNED | COORDINATOR, ADMIN | Status debe ser ACTIVE |
| Loan → OVERDUE | Sistema (cron) | dueDate < now, status ACTIVE |

---

## 11. AUTOMATIZACIÓN DE NOTIFICACIONES

| Evento | Notificación | Para quién |
|---|---|---|
| `POST /requests` | "Nueva solicitud de préstamo de [herramienta]" | Todos los COORDINATORs y ADMINs |
| `PATCH /requests/:id/approve` | "Tu solicitud de [herramienta] fue aprobada. Recógela en [ubicación]" | Estudiante que solicitó |
| `PATCH /requests/:id/reject` | "Tu solicitud de [herramienta] fue rechazada. Motivo: [comment]" | Estudiante que solicitó |
| `PATCH /loans/:id/return` | "Tu devolución de [herramienta] fue registrada correctamente" | Estudiante que tenía el préstamo |
| Préstamo vence en 2 días | "[Herramienta] debe devolverse el [fecha]" | Estudiante con el préstamo |
| Préstamo vencido | "[Herramienta] está atrasada. Regulariza tu situación" | Estudiante con el préstamo |

**Implementación:** Las notificaciones automáticas se disparan desde los servicios (después de cada acción). Los recordatorios de vencimiento se ejecutan vía un endpoint o script que se puede llamar con un cron.

---

## 12. SEED COMPLETO — `prisma/seed.ts`

```typescript
async function main() {
  // 1. Crear carreras (3)
  // 2. Crear categorías (3)
  // 3. Crear talleres (2) + WorkshopCareer (3)
  // 4. Crear usuarios (3):
  //    - ADMIN:  "REMA", "supportrema@gmail.com", role ADMIN
  //    - COORDINATOR: "Maestro/a", "educacionvirtual@emilianisomascos.edu.gt", role COORDINATOR
  //    - STUDENT: "Clarence Hernandez", "clarence.hernandez@emilianisomascos.edu.gt", role STUDENT
  // 5. Crear herramientas:
  //    - 22 herramientas desde Rema.sql (Mecánica, Electricidad)
  //    - 12 herramientas desde TOOLS0 (Computación, Mecánica, Electricidad)
  // 6. Crear préstamos (4 desde LOANS0)
  // 7. Crear solicitudes (3 desde ADMIN_REQS0)
  // 8. Crear favoritos (2)
  // 9. Crear movimientos históricos (4)
}
```

**Mapeo de datos `Rema.sql` a modelo Tool:**

Cada herramienta de `Rema.sql` se transforma:
- `nombre` → `name`
- `descripcion` → `desc`
- `stock` → `totalQty`, `available`
- `no_estanteria` → `location`
- `carrera` → `careers` (se parsea como JSON array separando por comas)
- `solo_maestros` → se omite (se valida por rol)
- `cat` → se infiere de la carrera: "Mecanica" → "Mecánica", "Electricidad" → "Electricidad"
- `code` → se genera: "MEC-001", "MEC-002", etc.
- `brand` → null
- `image` → URL de Unsplash por defecto
- `maxDays` → 7
- `specs` → null

---

## 13. MIDDLEWARE — Implementación

### `auth.ts`

```typescript
export async function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    throw AppError.unauthorized()
  }

  try {
    const token = header.split(' ')[1]
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload
    req.userId = payload.userId
    req.userRole = payload.role
    next()
  } catch {
    throw AppError.unauthorized('Token inválido o expirado')
  }
}
```

### `roles.ts`

```typescript
export function requireRole(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.userRole!)) {
      throw AppError.forbidden('No tienes permisos para esta acción')
    }
    next()
  }
}
```

### `validate.ts`

```typescript
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (err) {
      next(err) // ZodError atrapado por errorHandler
    }
  }
}
```

---

## 14. VARIABLES DE ENTORNO — `.env`

```env
# Base de datos
DATABASE_URL="mysql://root:@localhost:3306/REMA"

# JWT
JWT_SECRET="rema-jwt-secret-key-change-in-production"
JWT_EXPIRES_IN="24h"

# Servidor
PORT=3001
NODE_ENV="development"

# Frontend (CORS)
FRONTEND_URL="http://localhost:5173"
```

### `src/config/env.ts`

```typescript
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('24h'),
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
})

export const env = envSchema.parse(process.env)
```

---

## 15. SCRIPTS npm — `server/package.json`

```json
{
  "name": "rema-server",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "prisma migrate reset --force",
    "db:studio": "prisma studio",
    "db:generate": "prisma generate"
  },
  "dependencies": {
    "@prisma/client": "^6.x",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "express": "^4.21.x",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.24.x"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.x",
    "@types/cors": "^2.8.x",
    "@types/express": "^5.x",
    "@types/jsonwebtoken": "^9.x",
    "@types/node": "^22.x",
    "prisma": "^6.x",
    "tsx": "^4.x",
    "typescript": "^5.x"
  }
}
```

---

## 16. ESTRUCTURA DE ARCHIVOS FRONTEND A CREAR

### `src/lib/api.ts` — Cliente HTTP completo

```typescript
type ApiResponse<T> = { success: true; data: T; meta?: PaginationMeta }
  | { success: false; error: ApiError }

class ApiClient {
  private base: string
  private tokenKey = 'rema_token'

  constructor() {
    this.base = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }

  setToken(token: string | null) {
    if (token) localStorage.setItem(this.tokenKey, token)
    else localStorage.removeItem(this.tokenKey)
  }

  private async request<T>(method: string, path: string, body?: unknown, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.base}${path}`)
    if (params) Object.entries(params).forEach(([k, v]) => v && url.searchParams.set(k, v))

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    const token = this.getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    const json: ApiResponse<T> = await res.json()

    if (!json.success) {
      if (json.error.code === 'UNAUTHORIZED') {
        this.setToken(null)
        window.location.href = '/login'
      }
      throw new ApiError(json.error)
    }

    return json.data
  }

  get<T>(path: string, params?: Record<string, string>) { return this.request<T>('GET', path, undefined, params) }
  post<T>(path: string, body?: unknown) { return this.request<T>('POST', path, body) }
  put<T>(path: string, body?: unknown) { return this.request<T>('PUT', path, body) }
  patch<T>(path: string, body?: unknown) { return this.request<T>('PATCH', path, body) }
  delete(path: string) { return this.request<void>('DELETE', path) }
}

export const api = new ApiClient()
```

### `src/lib/auth.ts` — Helpers de autenticación

```typescript
export function getToken(): string | null {
  return localStorage.getItem('rema_token')
}

export function setToken(token: string) {
  localStorage.setItem('rema_token', token)
}

export function clearToken() {
  localStorage.removeItem('rema_token')
}

export function decodeToken(token: string): { userId: number; role: string } | null {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  const token = getToken()
  if (!token) return false
  const payload = decodeToken(token)
  if (!payload) return false
  return true
}
```

### Hooks TanStack Query — Implementación completa

**`src/hooks/useAuth.ts`**

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { setToken, clearToken } from '../lib/auth'

interface User {
  id: number; name: string; email: string; career: string
  carnet?: string; phone?: string; photo?: string; workshop?: string; role: string
}

interface LoginInput { email: string; password: string }
interface RegisterInput { name: string; email: string; password: string; career: string }
interface AuthResponse { token: string; user: User }

export function useAuth() {
  const qc = useQueryClient()

  const login = useMutation({
    mutationFn: (data: LoginInput) => api.post<AuthResponse>('/auth/login', data),
    onSuccess: (res) => {
      setToken(res.token)
      qc.setQueryData(['auth', 'me'], res.user)
    },
  })

  const register = useMutation({
    mutationFn: (data: RegisterInput) => api.post<AuthResponse>('/auth/register', data),
    onSuccess: (res) => {
      setToken(res.token)
      qc.setQueryData(['auth', 'me'], res.user)
    },
  })

  const me = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.get<User>('/auth/me'),
    enabled: !!getToken(),
    staleTime: 5 * 60 * 1000,
  })

  const logout = () => {
    clearToken()
    qc.clear()
    window.location.href = '/login'
  }

  return { login, register, me, logout, user: me.data }
}
```

**`src/hooks/useTools.ts`**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Tool } from '../types'

interface ToolFilters { cat?: string; career?: string; search?: string; status?: string }

export function useTools(filters?: ToolFilters) {
  return useQuery({
    queryKey: ['tools', filters],
    queryFn: () => api.get<Tool[]>('/tools', filters as Record<string, string>),
    staleTime: 30_000,
  })
}

export function useTool(id: number) {
  return useQuery({
    queryKey: ['tools', id],
    queryFn: () => api.get<Tool>(`/tools/${id}`),
    enabled: !!id,
  })
}

interface CreateToolInput {
  name: string; cat: string; code: string; totalQty: number
  desc?: string; brand?: string; location?: string; image?: string
  maxDays?: number; careers?: string[]; specs?: { k: string; v: string }[]
}

export function useCreateTool() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateToolInput) => api.post<Tool>('/tools', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tools'] }),
  })
}

export function useUpdateTool() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateToolInput> }) =>
      api.put<Tool>(`/tools/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tools'] }),
  })
}

export function useDeleteTool() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/tools/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tools'] }),
  })
}

export function useChangeToolStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.patch<Tool>(`/tools/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tools'] }),
  })
}
```

**`src/hooks/useLoans.ts`**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Loan } from '../types'

interface LoanFilters { status?: string; userId?: number; overdue?: boolean }

export function useLoans(filters?: LoanFilters) {
  return useQuery({
    queryKey: ['loans', filters],
    queryFn: () => api.get<Loan[]>('/loans', filters as Record<string, string>),
    staleTime: 15_000,
  })
}

export function useCreateLoan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { toolId: number; userId: number; qty: number; loanDate: string; dueDate: string }) =>
      api.post<Loan>('/loans', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['loans'] })
      qc.invalidateQueries({ queryKey: ['tools'] })
    },
  })
}

export function useReturnLoan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, returnDate }: { id: number; returnDate: string }) =>
      api.patch<Loan>(`/loans/${id}/return`, { returnDate }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['loans'] })
      qc.invalidateQueries({ queryKey: ['tools'] })
    },
  })
}
```

**`src/hooks/useRequests.ts`**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { AdminReq } from '../types'

interface RequestFilters { status?: string; userId?: number }

export function useRequests(filters?: RequestFilters) {
  return useQuery({
    queryKey: ['requests', filters],
    queryFn: () => api.get<AdminReq[]>('/requests', filters as Record<string, string>),
    staleTime: 15_000,
  })
}

export function useCreateRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { toolId: number; qty: number; startDate: string; endDate: string; notes?: string }) =>
      api.post<AdminReq>('/requests', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['requests'] }),
  })
}

export function useApproveRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.patch<AdminReq>(`/requests/${id}/approve`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['requests'] })
      qc.invalidateQueries({ queryKey: ['loans'] })
      qc.invalidateQueries({ queryKey: ['tools'] })
    },
  })
}

export function useRejectRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, comment }: { id: number; comment?: string }) =>
      api.patch<AdminReq>(`/requests/${id}/reject`, { comment }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['requests'] }),
  })
}
```

**`src/hooks/useFavorites.ts`**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Tool } from '../types'

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => api.get<Tool[]>('/user/favorites'),
    staleTime: 60_000,
  })
}

export function useAddFavorite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (toolId: number) => api.post(`/user/favorites/${toolId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites'] }),
  })
}

export function useRemoveFavorite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (toolId: number) => api.delete(`/user/favorites/${toolId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites'] }),
  })
}
```

**`src/hooks/useProfile.ts`**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name?: string; phone?: string; carnet?: string }) =>
      api.put('/user/profile', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['auth', 'me'] }),
  })
}
```

**`src/hooks/useStats.ts`**

```typescript
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

interface DashboardStats {
  totalTools: number; available: number; inUse: number
  maintenance: number; pendingReqs: number; activeLoans: number; totalUsers: number
}

interface TopTool { name: string; count: number }
interface LoanByMonth { year: number; month: number; count: number }
interface Delays { totalOverdue: number; totalActive: number; rate: number }
interface ActiveUser { name: string; loanCount: number }

export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.get<DashboardStats>('/admin/stats'),
    staleTime: 30_000,
  })
}

export function useTopTools() {
  return useQuery({
    queryKey: ['reports', 'top-tools'],
    queryFn: () => api.get<TopTool[]>('/reports/top-tools'),
    staleTime: 60_000,
  })
}

export function useLoansByMonth() {
  return useQuery({
    queryKey: ['reports', 'loans-by-month'],
    queryFn: () => api.get<LoanByMonth[]>('/reports/loans-by-month'),
    staleTime: 60_000,
  })
}

export function useDelays() {
  return useQuery({
    queryKey: ['reports', 'delays'],
    queryFn: () => api.get<Delays>('/reports/delays'),
    staleTime: 60_000,
  })
}

export function useActiveUsers() {
  return useQuery({
    queryKey: ['reports', 'active-users'],
    queryFn: () => api.get<ActiveUser[]>('/reports/active-users'),
    staleTime: 60_000,
  })
}
```

**`src/hooks/useNotifications.ts`**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'

interface Notification {
  id: number; title: string; message: string; type: string
  read: boolean; link?: string; createdAt: string
}

export function useNotifications(unreadOnly = false) {
  return useQuery({
    queryKey: ['notifications', { unreadOnly }],
    queryFn: () => api.get<Notification[]>('/notifications', { unreadOnly: String(unreadOnly) }),
    staleTime: 10_000,
    refetchInterval: 30_000,
  })
}

export function useUnreadCount() {
  const { data } = useNotifications(true)
  return data?.length ?? 0
}

export function useMarkNotificationRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}
```

---

## 17. ARCHIVOS FRONTEND A MODIFICAR

| Archivo | Cambio |
|---|---|
| `src/app/App.tsx` | Envolver con `<QueryClientProvider>` |
| `src/app/context/AppContext.tsx` | Eliminar datos (tools, loans, etc.), dejar solo UI: view, accountSection, adminPage, toasts, selectedTool, loanForm, loanFormTool, loanStep, editTool, newCatName, newCareerForm, searchQ, activeCat, showLoginPass, showRegPass, showRegPass2, selectedCareer, verifyCode, searchFocused |
| `src/app/components/views/auth/Login.tsx` | `useAuth().login.mutateAsync(data)` en vez de `update({ view: 'catalog' })` |
| `src/app/components/views/auth/Register.tsx` | `useAuth().register.mutateAsync(data)` |
| `src/app/components/views/catalog/CatalogView.tsx` | `useTools({ cat, search, status })` en vez de `state.tools` y `state.searchQ` |
| `src/app/components/views/catalog/ToolModal.tsx` | `useTool(id)` en vez de `state.selectedTool` |
| `src/app/components/views/catalog/LoanFormModal.tsx` | `useCreateRequest().mutateAsync(data)` en vez de `submitLoan()` local |
| `src/app/components/views/account/AccountView.tsx` | Hooks por sub-vista (useLoans, useFavorites, useUpdateProfile, useAuth) |
| `src/app/components/views/admin/AdminView.tsx` | Hooks por sub-vista (useTools, useCreateTool, useUpdateTool, useDeleteTool, useChangeToolStatus, useRequests, useApproveRequest, useRejectRequest, useDashboardStats, useTopTools, useLoansByMonth, useDelays, useActiveUsers) |

---

## 18. ARCHIVOS FRONTEND A ELIMINAR

```
src/app/data/tools.ts
src/app/data/loans.ts
src/app/data/user.ts
src/app/data/categories.ts
```

---

## 19. ORDEN DE IMPLEMENTACIÓN

### Fase 0 — Setup Backend (1 día)

| Paso | Descripción |
|---|---|
| 0.1 | `mkdir BackendMelExpo`, `npm init`, instalar dependencias |
| 0.2 | Configurar tsconfig.json, .env, src/config/env.ts |
| 0.3 | Escribir Prisma schema completo con 14 modelos |
| 0.4 | `prisma migrate dev --name init` |
| 0.5 | Escribir seed.ts con datos de Rema.sql + frontend |
| 0.6 | Configurar Express: app.listen, cors, JSON parser |
| 0.7 | Implementar AppError class + errorHandler middleware |
| 0.8 | Implementar response helpers (ok, created, noContent, fail) |
| 0.9 | Implementar middleware: auth, roles, validate |

### Fase 1 — API Core (3 días)

| Paso | Descripción | Depende |
|---|---|---|
| 1.1 | Auth: validators, controller, service (login, register, me, password) | 0.9 |
| 1.2 | Tools: validators, controller, service (list con filtros, getById, CRUD, changeStatus) | 0.9 |
| 1.3 | Requests: validators, controller, service (create con validación, approve, reject) | 1.2 |
| 1.4 | Loans: validators, controller, service (list, create, return) | 1.3 |
| 1.5 | User: controller + service (profile, favorites) | 0.9 |
| 1.6 | Admin: controller + service (stats, users CRUD, careers CRUD, categories CRUD, workshops CRUD) | 1.2 |
| 1.7 | Reports: controller + service (top-tools, loans-by-month, delays, active-users) | 1.4 |
| 1.8 | Notifications: controller + service (list, markRead, create) | 0.9 |
| 1.9 | Integrar NotificationService en RequestService + LoanService | 1.3, 1.4, 1.8 |

### Fase 2 — Conexión Frontend (2 días)

| Paso | Descripción | Depende |
|---|---|---|
| 2.1 | Crear `src/lib/api.ts` + `src/lib/auth.ts` | — |
| 2.2 | Crear todos los hooks TanStack Query | 2.1 |
| 2.3 | Agregar `<QueryClientProvider>` en App.tsx | 2.1 |
| 2.4 | Migrar Login + Register → `useAuth()` | Fase 1, 2.2 |
| 2.5 | Migrar CatalogView + ToolModal → `useTools()` | Fase 1, 2.2 |
| 2.6 | Migrar LoanFormModal → `useCreateRequest()` | Fase 1, 2.2 |
| 2.7 | Migrar AccountView → hooks | Fase 1, 2.2 |
| 2.8 | Migrar AdminView → hooks | Fase 1, 2.2 |
| 2.9 | Limpiar AppContext + eliminar `data/*.ts` | 2.4-2.8 |

### Fase 3 — Verificación (1 día)

| Paso | Descripción |
|---|---|
| 3.1 | Probar flujo completo: register → login → catalog → solicitar → admin aprueba → préstamo activo → devolver |
| 3.2 | Probar filtros y búsqueda en catálogo |
| 3.3 | Probar CRUD admin (tools, users, careers, categories, workshops) |
| 3.4 | Probar favoritos (agregar, quitar, listar) |
| 3.5 | Probar reports con datos reales |
| 3.6 | Probar notificaciones (automáticas en approve/reject/return) |
| 3.7 | `npm run build` frontend — sin errores |

---

## 20. REGLAS DE NEGOCIO — Validación completa

| # | Regla | Dónde se valida | Error code |
|---|---|---|---|
| 1 | Solo estudiantes pueden crear solicitudes | RequestService.create | FORBIDDEN |
| 2 | Estudiante solo solicita herramientas de su carrera | RequestService.create (tool.careers JSON incluye user.career) | CAREER_MISMATCH |
| 3 | Estudiante solo solicita herramientas de su taller | RequestService.create (si user.workshop existe, verificar contra tool.location) | WORKSHOP_MISMATCH |
| 4 | Cantidad solicitada ≤ disponibles | RequestService.create + LoanService.create | INSUFFICIENT_STOCK |
| 5 | Fecha devolución > fecha préstamo | Zod schema (dueDate > startDate) | VALIDATION_ERROR |
| 6 | Días de préstamo ≤ maxDays de la herramienta | RequestService.create | EXCEEDS_MAX_DAYS |
| 7 | Herramienta en mantenimiento no se puede solicitar | RequestService.create (tool.status === MAINTENANCE) | TOOL_IN_MAINTENANCE |
| 8 | Solo COORDINATOR/ADMIN aprueba/rechaza | Middleware requireRole('COORDINATOR', 'ADMIN') | FORBIDDEN |
| 9 | Solicitud solo se puede aprobar/rechazar si está PENDING | RequestService.approve/reject | ALREADY_ACTIONED |
| 10 | Devolución solo si el préstamo está ACTIVE | LoanService.return | LOAN_NOT_ACTIVE |
| 11 | Herramienta `solo_maestros` → solo TEACHER/COORDINATOR/ADMIN | RequestService.create (validar tool.careers o campo especial) | FORBIDDEN |
| 12 | Al aprobar solicitud: si tool.available es insuficiente, rechazar automáticamente | RequestService.approve | INSUFFICIENT_STOCK |
| 13 | Devolución: tool.available += qty, si available > 0 → status = AVAILABLE | LoanService.return | — |
| 14 | No duplicar favoritos | Prisma compound key @@id + upsert | — |
| 15 | Cada préstamo/devolución crea un Movement automáticamente | LoanService.create + LoanService.return | — |
| 16 | Préstamo vencido → status OVERDUE si dueDate < now | LoanService.list + cron checkOverdueLoans | — |

---

## 21. ESTRATEGIA DE INDEXACIÓN (Prisma)

```prisma
model User {
  @@index([email])
  @@index([role])
  @@index([career])
}

model Tool {
  @@index([status])
  @@index([cat])
  @@index([code])
  @@index([name])
  @@index([careers])  // Índice JSON (MySQL 8+)
}

model Request {
  @@index([userId])
  @@index([status])
  @@index([reqDate])
}

model RequestItem {
  @@index([toolId])
  @@index([requestId])
}

model Loan {
  @@index([userId])
  @@index([toolId])
  @@index([status])
  @@index([dueDate])
  @@index([loanDate])
}

model Movement {
  @@index([toolId])
  @@index([loanId])
  @@index([createdAt])
}

model Notification {
  @@index([userId])
  @@index([read])
  @@index([createdAt])
}
```

---

## 22. CONSIDERACIONES DE DESPLIEGUE

- **Base de datos:** MySQL 8+ (compatible con `Rema.sql` existente)
- **Node:** 18+ requerido
- **Build:** `npm run build` (tsc), luego `node dist/index.js`
- **Migraciones:** `prisma migrate deploy` en producción
- **Seed:** `prisma db seed` solo para desarrollo/testing
- **CORS:** En producción, restringir `FRONTEND_URL` al dominio real
- **JWT:** Cambiar `JWT_SECRET` por una clave segura en producción
- **Logging:** Agregar morgan o winston para producción
- **Rate limiting:** Considerar express-rate-limit para endpoints de auth
- **Cron:** Recordatorios de vencimiento → setInterval en un worker separado o usando node-cron
