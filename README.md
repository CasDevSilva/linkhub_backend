# LinkHub Backend

API REST para plataforma de enlaces personalizados con analytics.

## Stack
- Node.js + Express 5
- PostgreSQL + Prisma 7
- JWT Authentication

## Setup
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Generar Prisma Client y sincronizar DB
npm run db:push

# Desarrollo
npm run dev

# Producción
npm start
```

## Endpoints

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Usuario actual |

### Users
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users/:username` | Perfil público |
| PUT | `/api/users/profile` | Actualizar perfil |
| PUT | `/api/users/theme` | Cambiar tema |

### Links
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/links` | Listar links |
| POST | `/api/links` | Crear link |
| PUT | `/api/links/:id` | Actualizar link |
| DELETE | `/api/links/:id` | Eliminar link |
| PUT | `/api/links/reorder` | Reordenar |

### Analytics
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/analytics/overview` | Resumen |
| GET | `/api/analytics/clicks` | Timeline |
| GET | `/api/analytics/devices` | Por dispositivo |
| GET | `/api/analytics/referrers` | Top referrers |

### Track
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/track/:linkId` | Registrar click |

### Public
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/@:username` | Página pública |

## Scripts
```bash
npm run dev      # Desarrollo con watch
npm start        # Producción
npm run db:push  # Sincronizar schema
npm run db:studio # Prisma Studio
```