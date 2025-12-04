# Sistema de Gestión de Torneos Deportivos - Frontend

Aplicación web React para la gestión de torneos deportivos con roles de Administrador y Participante.

## Stack Tecnológico

- **React 18** con **TypeScript**
- **Vite** (Build tool)
- **Tailwind CSS** (Estilos)
- **React Router DOM** (Navegación)
- **Axios** (Consumo de API REST)

## Características

### Rol Administrador
- Login exclusivo para administradores
- CRUD completo de Torneos (Crear, Editar, Eliminar, Publicar)
- CRUD completo de Competencias dentro de cada torneo
- Gestión de cuentas de administradores

### Rol Participante
- Registro de nuevos usuarios
- Login de participantes
- Visualización de torneos publicados
- Visualización de competencias disponibles
- Inscripción a competencias con cálculo automático de descuentos
- Historial de inscripciones

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` y configurar la URL de tu API backend:
```
VITE_API_URL=http://localhost:8080
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Compilar para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── AdminLayout.tsx
│   │   ├── ParticipantLayout.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Spinner.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/          # Context API
│   │   └── AuthContext.tsx
│   ├── pages/             # Páginas principales
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── admin/
│   │   │   ├── AdminTournaments.tsx
│   │   │   ├── TournamentCompetitions.tsx
│   │   │   ├── AdminAccounts.tsx
│   │   │   ├── TournamentFormModal.tsx
│   │   │   └── CompetitionFormModal.tsx
│   │   └── participant/
│   │       ├── ParticipantTournaments.tsx
│   │       ├── TournamentDetail.tsx
│   │       └── ParticipantInscriptions.tsx
│   ├── services/          # Servicios de API
│   │   ├── axios.ts
│   │   ├── authService.ts
│   │   ├── adminService.ts
│   │   └── participantService.ts
│   ├── types/             # TypeScript interfaces
│   │   └── index.ts
│   ├── config/            # Configuración
│   │   └── constants.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Uso

### Credenciales de Prueba

Si tu backend tiene el DataLoader activo, puedes usar:

**Administrador:**
- Email: `admin@mail.com`
- Contraseña: `admin123`

**Participante:**
- Email: `ana@mail.com`
- Contraseña: `1234`

### Flujo de Trabajo

1. **Administrador:**
   - Login en `/login` seleccionando "Administrador"
   - Crear torneos desde el panel de administración
   - Agregar competencias a cada torneo
   - Publicar torneos para hacerlos visibles a participantes

2. **Participante:**
   - Registrarse en `/register`
   - Login en `/login` seleccionando "Participante"
   - Ver torneos disponibles
   - Inscribirse a competencias
   - Ver historial de inscripciones

## Configuración de API

El frontend consume los siguientes endpoints del backend:

- `POST /admin/auth` - Login de administrador
- `POST /participant/auth` - Login de participante
- `POST /participant` - Registro de participante
- `GET /admin/tournaments` - Listar todos los torneos (admin)
- `POST /admin/tournaments` - Crear torneo
- `PUT /admin/tournaments/:id` - Actualizar torneo
- `DELETE /admin/tournaments/:id` - Eliminar torneo
- `PATCH /admin/tournaments/:id/published` - Publicar torneo
- `GET /tournaments` - Listar torneos publicados (participante)
- `GET /tournament/:id/competitions` - Listar competencias
- `POST /tournament/:id/competitions/:compId/inscription` - Inscribirse
- `GET /inscriptions` - Ver mis inscripciones

## Características Técnicas

- **Autenticación con JWT:** El token se almacena en localStorage y se inyecta automáticamente en cada petición mediante Axios interceptors
- **Rutas Protegidas:** Componente `ProtectedRoute` que valida autenticación y rol
- **Context API:** Manejo global del estado de autenticación
- **Componentes Reutilizables:** Button, Card, Modal, Input, Spinner
- **Diseño Responsivo:** Totalmente adaptable a móviles, tablets y desktop
- **TypeScript:** Tipado fuerte en toda la aplicación

## Personalización

### Cambiar colores primarios

Edita `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Cambia estos valores
        500: '#0ea5e9',
        600: '#0284c7',
        // ...
      },
    },
  },
}
```

### Cambiar URL de API

Edita el archivo `.env`:

```
VITE_API_URL=https://tu-api.com
```
