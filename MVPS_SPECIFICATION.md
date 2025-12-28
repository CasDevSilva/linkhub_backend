# ESPECIFICACIONES - 3 MVPs FULLSTACK

## DISTRIBUCIÓN DE TECNOLOGÍAS

| MVP | Base de Datos | ORM | Backend Deploy | Frontend Deploy |
|-----|---------------|-----|----------------|-----------------|
| **Linkhub** | Supabase (PostgreSQL) | Prisma | Railway | Vercel |
| **Webhook Playground** | MongoDB Atlas | Mongoose | Render | Netlify |
| **Shorty** | Turso (SQLite) | Drizzle | Fly.io | Cloudflare Pages |

### ¿Por qué esta distribución?

**Diversidad de bases de datos:**
- PostgreSQL (SQL relacional) → Enterprise standard
- MongoDB (NoSQL documental) → Ya lo conoces, refuerzas
- SQLite/Turso (SQL distribuido) → Edge computing, tendencia 2024-2025

**Diversidad de ORMs:**
- Prisma → El más popular para SQL
- Mongoose → Ya lo conoces
- Drizzle → Alternativa moderna, type-safe, más ligero que Prisma

**Diversidad de deploy:**
- No saturas ningún servicio gratuito
- Demuestras adaptabilidad
- Cada servicio tiene fortalezas diferentes

---
---

# 1. LINKHUB

## Descripción
Plataforma para crear páginas de enlaces personalizadas (estilo Linktree) con analytics de clicks por hora, dispositivo y referrer.

## Stack

### Backend
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "@prisma/client": "^5.7.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.0",
    "nanoid": "^5.0.0",
    "ua-parser-js": "^1.0.0",
    "express-rate-limit": "^7.1.0",
    "@supabase/supabase-js": "^2.39.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0"
  },
  "devDependencies": {
    "prisma": "^5.7.0",
    "nodemon": "^3.0.0"
  }
}
```

### Frontend
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "zustand": "^4.4.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "lucide-react": "^0.294.0",
    "react-hot-toast": "^2.4.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## Modelos de Datos (Prisma/PostgreSQL)

### schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  password    String
  username    String   @unique  // para URL: /@username
  displayName String?
  bio         String?
  avatar      String?
  theme       String   @default("default") // default, dark, minimal, neon
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  links       Link[]
  clicks      Click[]
}

model Link {
  id        String   @id @default(cuid())
  userId    String
  title     String
  url       String
  icon      String?
  order     Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  clicks    Click[]
  
  @@index([userId])
}

model Click {
  id        String   @id @default(cuid())
  linkId    String
  userId    String   // dueño del link (para queries rápidas)
  timestamp DateTime @default(now())
  referrer  String?
  userAgent String?
  device    String?  // mobile, tablet, desktop
  browser   String?
  os        String?
  country   String?
  ipHash    String?  // hasheado para privacidad
  
  link      Link     @relation(fields: [linkId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([linkId])
  @@index([userId])
  @@index([timestamp])
}
```

---

## API Endpoints

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Login, retorna JWT |
| GET | `/api/auth/me` | Usuario actual (protected) |

### Users
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users/:username` | Perfil público (para página de links) |
| PUT | `/api/users/profile` | Actualizar perfil (protected) |
| PUT | `/api/users/theme` | Cambiar tema (protected) |

### Links
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/links` | Listar mis links (protected) |
| POST | `/api/links` | Crear link (protected) |
| PUT | `/api/links/:id` | Actualizar link (protected) |
| DELETE | `/api/links/:id` | Eliminar link (protected) |
| PUT | `/api/links/reorder` | Reordenar links (protected) |

### Analytics
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/track/:linkId` | Registrar click (público) |
| GET | `/api/analytics/overview` | Resumen general (protected) |
| GET | `/api/analytics/clicks` | Clicks por período (protected) |
| GET | `/api/analytics/devices` | Distribución por dispositivo (protected) |
| GET | `/api/analytics/referrers` | Top referrers (protected) |

### Public
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/@:username` | Página pública de links |

---

## Estructura de Carpetas

```
linkhub/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Prisma client
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── links.js
│   │   │   └── analytics.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── linkController.js
│   │   │   └── analyticsController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   └── parseUserAgent.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── LinkCard.jsx
│   │   │   ├── LinkForm.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   └── Chart.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Links.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── PublicPage.jsx
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   └── linkStore.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Variables de Entorno

### Backend (.env)
```
PORT=5000
DATABASE_URL="postgresql://user:pass@host:5432/linkhub?pgbouncer=true"
DIRECT_URL="postgresql://user:pass@host:5432/linkhub"
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## Deploy

| Componente | Servicio | Tier |
|------------|----------|------|
| Database | Supabase | Free (500MB) |
| Backend | Railway | Free ($5 credit/month) |
| Frontend | Vercel | Free |

---
---

# 2. WEBHOOK PLAYGROUND

## Descripción
Plataforma para recibir, inspeccionar y reenviar webhooks. Útil para debugging de integraciones con servicios externos (Stripe, GitHub, etc.).

## Stack

### Backend
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^8.0.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.0",
    "nanoid": "^5.0.0",
    "axios": "^1.6.0",
    "ws": "^8.14.0",
    "express-rate-limit": "^7.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

### Frontend
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "zustand": "^4.4.0",
    "lucide-react": "^0.294.0",
    "react-hot-toast": "^2.4.0",
    "react-json-view-lite": "^1.2.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## Modelos de Datos (MongoDB)

### Endpoint
```javascript
{
  _id: ObjectId,
  slug: String,            // unique, nanoid (ej: "abc123xyz")
  name: String,            // nombre descriptivo opcional
  createdAt: Date,
  expiresAt: Date,         // opcional, auto-delete
  requestCount: Number     // contador
}
```

### Request
```javascript
{
  _id: ObjectId,
  endpointId: ObjectId,    // ref: Endpoint
  method: String,          // GET, POST, PUT, DELETE, etc.
  headers: Object,         // todos los headers
  query: Object,           // query params
  body: Mixed,             // body (JSON, text, etc.)
  contentType: String,     // content-type header
  ip: String,
  timestamp: Date
}
```

---

## API Endpoints

### Endpoints Management
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/endpoints` | Crear nuevo endpoint |
| GET | `/api/endpoints` | Listar mis endpoints |
| GET | `/api/endpoints/:slug` | Detalle de endpoint |
| DELETE | `/api/endpoints/:slug` | Eliminar endpoint |

### Requests
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/endpoints/:slug/requests` | Listar requests recibidos |
| GET | `/api/requests/:id` | Detalle de un request |
| DELETE | `/api/requests/:id` | Eliminar request |
| POST | `/api/requests/:id/replay` | Reenviar request a URL |

### Webhook Receiver (público)
| Método | Ruta | Descripción |
|--------|------|-------------|
| ANY | `/hook/:slug` | Recibir webhook (cualquier método) |

---

## Estructura de Carpetas

```
webhook-playground/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── Endpoint.js
│   │   │   └── Request.js
│   │   ├── routes/
│   │   │   ├── endpoints.js
│   │   │   ├── requests.js
│   │   │   └── webhook.js
│   │   ├── controllers/
│   │   │   ├── endpointController.js
│   │   │   ├── requestController.js
│   │   │   └── webhookController.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── websocket/
│   │   │   └── index.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── EndpointCard.jsx
│   │   │   ├── RequestList.jsx
│   │   │   ├── RequestDetail.jsx
│   │   │   └── JsonViewer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── EndpointView.jsx
│   │   │   └── RequestView.jsx
│   │   ├── store/
│   │   │   └── endpointStore.js
│   │   ├── hooks/
│   │   │   └── useWebSocket.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Variables de Entorno

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/webhook-playground
NODE_ENV=development
BASE_URL=http://localhost:5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_HOOK_URL=http://localhost:5000/hook
VITE_WS_URL=ws://localhost:5000
```

---

## Deploy

| Componente | Servicio | Tier |
|------------|----------|------|
| Database | MongoDB Atlas | Free (512MB) |
| Backend | Render | Free |
| Frontend | Netlify | Free |

---
---

# 3. SHORTY

## Descripción
Acortador de URLs con analytics de clicks, custom slugs, y enlaces con expiración.

## Stack

### Backend
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "@libsql/client": "^0.4.0",
    "drizzle-orm": "^0.29.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.0",
    "nanoid": "^5.0.0",
    "ua-parser-js": "^1.0.0",
    "valid-url": "^1.0.9",
    "express-rate-limit": "^7.1.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.20.0",
    "nodemon": "^3.0.0"
  }
}
```

### Frontend
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "zustand": "^4.4.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "lucide-react": "^0.294.0",
    "react-hot-toast": "^2.4.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## Modelos de Datos (Drizzle/SQLite)

### schema.ts
```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const urls = sqliteTable('urls', {
  id: text('id').primaryKey(),
  originalUrl: text('original_url').notNull(),
  shortCode: text('short_code').unique().notNull(),
  customSlug: text('custom_slug'),
  title: text('title'),
  clicks: integer('clicks').default(0),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).defaultNow()
});

export const clicks = sqliteTable('clicks', {
  id: text('id').primaryKey(),
  urlId: text('url_id').references(() => urls.id, { onDelete: 'cascade' }),
  timestamp: integer('timestamp', { mode: 'timestamp' }).defaultNow(),
  referrer: text('referrer'),
  userAgent: text('user_agent'),
  device: text('device'),
  browser: text('browser'),
  os: text('os'),
  country: text('country'),
  ipHash: text('ip_hash')
});
```

---

## API Endpoints

### URLs
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/urls` | Crear URL corta |
| GET | `/api/urls` | Listar URLs |
| GET | `/api/urls/:id` | Detalle de URL |
| PUT | `/api/urls/:id` | Actualizar URL |
| DELETE | `/api/urls/:id` | Eliminar URL |

### Analytics
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/urls/:id/stats` | Stats de una URL |
| GET | `/api/urls/:id/clicks` | Clicks por período |

### Redirect (público)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/:code` | Redirect a URL original |

---

## Estructura de Carpetas

```
shorty/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.js         # Drizzle schema
│   │   │   ├── index.js          # Drizzle client
│   │   │   └── migrations/
│   │   ├── routes/
│   │   │   ├── urls.js
│   │   │   ├── analytics.js
│   │   │   └── redirect.js
│   │   ├── controllers/
│   │   │   ├── urlController.js
│   │   │   ├── analyticsController.js
│   │   │   └── redirectController.js
│   │   ├── middleware/
│   │   │   ├── validateUrl.js
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── generateCode.js
│   │   │   └── parseUserAgent.js
│   │   └── index.js
│   ├── drizzle.config.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── UrlForm.jsx
│   │   │   ├── UrlCard.jsx
│   │   │   ├── UrlTable.jsx
│   │   │   └── StatsCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── UrlDetail.jsx
│   │   ├── store/
│   │   │   └── urlStore.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Variables de Entorno

### Backend (.env)
```
PORT=5000
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
NODE_ENV=development
BASE_URL=http://localhost:5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_SHORT_URL=http://localhost:5000
```

---

## Deploy

| Componente | Servicio | Tier |
|------------|----------|------|
| Database | Turso | Free (8GB) |
| Backend | Fly.io | Free (3 VMs) |
| Frontend | Cloudflare Pages | Free |

---
---

# RESUMEN COMPARATIVO

| Aspecto | Linkhub | Webhook Playground | Shorty |
|---------|---------|-------------------|--------|
| Database | PostgreSQL (Supabase) | MongoDB Atlas | SQLite (Turso) |
| ORM | Prisma | Mongoose | Drizzle |
| Backend Deploy | Railway | Render | Fly.io |
| Frontend Deploy | Vercel | Netlify | Cloudflare Pages |
| Complejidad | Media-Alta | Media | Baja |
| Tiempo estimado | 8 hrs | 7 hrs | 5-6 hrs |

---

# VALOR PARA PORTFOLIO

Al completar los 3 MVPs demuestras:

### Bases de Datos
- ✅ PostgreSQL (SQL relacional - enterprise)
- ✅ MongoDB (NoSQL - startups)
- ✅ SQLite/Turso (Edge - tendencia)

### ORMs
- ✅ Prisma (el más popular)
- ✅ Mongoose (NoSQL standard)
- ✅ Drizzle (moderno, type-safe)

### Deploy Platforms
- ✅ Railway, Render, Fly.io (backend)
- ✅ Vercel, Netlify, Cloudflare Pages (frontend)

### Features
- ✅ Auth JWT
- ✅ Analytics/Tracking
- ✅ Real-time (WebSockets)
- ✅ CRUD completo
- ✅ Public/Private routes

---

# ORDEN DE DESARROLLO SUGERIDO

1. **Shorty** (5-6 hrs) - Más simple, aprende Turso + Drizzle
2. **Webhook Playground** (7 hrs) - MongoDB (ya conoces), WebSockets nuevo
3. **Linkhub** (8 hrs) - Más complejo, Prisma + PostgreSQL + Auth completo

Total: ~20-21 hrs

---

# TIERS GRATUITOS

| Servicio | Límite Free | Suficiente para MVP |
|----------|-------------|---------------------|
| Supabase | 500MB DB, 1GB storage | ✅ |
| MongoDB Atlas | 512MB | ✅ |
| Turso | 8GB, 1B row reads | ✅ |
| Railway | $5/month credit | ✅ |
| Render | 750 hrs/month | ✅ |
| Fly.io | 3 VMs shared | ✅ |
| Vercel | 100GB bandwidth | ✅ |
| Netlify | 100GB bandwidth | ✅ |
| Cloudflare Pages | Unlimited | ✅ |
