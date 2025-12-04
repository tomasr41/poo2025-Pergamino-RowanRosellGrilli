# Guía de Instalación y Ejecución

## Requisitos Previos

- Node.js versión 16 o superior
- npm o yarn
- Backend de Spring Boot ejecutándose (por defecto en `http://localhost:8080`)

## Pasos de Instalación

### 1. Navegar a la carpeta del proyecto
```bash
cd frontend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

Edita el archivo `.env` si tu backend está en una URL diferente:
```
VITE_API_URL=http://localhost:8080
```

### 4. Ejecutar en modo desarrollo
```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

### 5. Compilar para producción (Opcional)
```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## Verificación de la Instalación

1. Abre tu navegador en `http://localhost:3000`
2. Deberías ver la pantalla de login
3. Intenta iniciar sesión con las credenciales de prueba:

**Administrador:**
- Email: `admin@mail.com`
- Contraseña: `admin123`

**Participante:**
- Email: `ana@mail.com`
- Contraseña: `1234`

Si no funcionan estas credenciales, verifica que tu backend tenga el `DataLoader` activo.

## Solución de Problemas Comunes

### Error de conexión con el backend

Si ves errores de red o CORS:

1. Verifica que el backend está ejecutándose en `http://localhost:8080`
2. Asegúrate de que el backend tenga configurado CORS para permitir peticiones desde `http://localhost:3000`
3. Verifica que la URL en `.env` sea correcta

### Página en blanco

1. Abre la consola del navegador (F12)
2. Busca errores en la pestaña "Console"
3. Verifica que todas las dependencias se instalaron correctamente: `npm install`

### Token inválido o expirado

Si después de iniciar sesión te redirige al login:

1. Borra el localStorage del navegador
2. Verifica que el backend esté generando tokens JWT correctamente
3. Intenta iniciar sesión nuevamente

## Estructura de Rutas

- `/login` - Página de inicio de sesión
- `/register` - Registro de participantes
- `/admin/tournaments` - Panel de administración de torneos
- `/admin/accounts` - Gestión de cuentas de administradores
- `/participant/tournaments` - Torneos disponibles para participantes
- `/participant/inscriptions` - Historial de inscripciones

## Tecnologías Utilizadas

- React 18 + TypeScript
- Vite (Build tool)
- Tailwind CSS
- React Router DOM
- Axios
- Context API

## Siguiente Paso

Una vez que la aplicación esté funcionando, puedes:

1. Crear torneos como administrador
2. Agregar competencias a los torneos
3. Publicar los torneos
4. Registrar participantes
5. Inscribir participantes a competencias
