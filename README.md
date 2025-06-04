# EYRA - Aplicación de Seguimiento de Salud Reproductiva

EYRA es una aplicación web completa para el seguimiento menstrual y salud reproductiva, desarrollada como Trabajo de Fin de Grado de Desarrollo de Aplicaciones Web. La aplicación está diseñada con un enfoque en la experiencia de usuario y la privacidad, proporcionando herramientas intuitivas para el seguimiento del ciclo menstrual.

## 🌐 Acceso Directo

**URL de la aplicación**: [https://eyraclub.es/](https://eyraclub.es/)

### Credenciales de prueba
- **Usuario administrador**: `admin@gmail.com`
- **Contraseña**: `123456Aa!`

## 📋 Características principales

- **Dashboard personalizado**: Vista general del ciclo menstrual con información visual
- **Calendario inteligente**: Seguimiento diario con predicciones basadas en patrones
- **Gestión de síntomas**: Registro detallado de síntomas físicos y emocionales
- **Red Tent (Biblioteca)**: Contenido educativo y recursos sobre salud reproductiva
- **Sistema de acompañantes**: Invitación a parejas o personas de confianza
- **Panel de administración**: Gestión completa de usuarios y contenido
- **Diseño responsive**: Interfaz adaptada para desktop, tablet y móvil
- **Estilo neumórfico**: Diseño moderno siguiendo la guía de estilos EYRA

## 🛠️ Tecnologías utilizadas

### Backend
- **Framework**: Symfony 7.2
- **Base de datos**: PostgreSQL
- **Autenticación**: JWT (JSON Web Tokens)
- **API**: RESTful con documentación automática

### Frontend
- **Framework**: React 18 + TypeScript
- **Estilos**: Tailwind CSS 
- **Enrutamiento**: React Router
- **Estado global**: Context API
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React

## 🏗️ Estructura del Proyecto

```
EYRA/
├── eyra-backend/          # API backend con Symfony
│   ├── src/
│   ├── config/
│   ├── migrations/
│   └── public/
├── eyra-frontend/         # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── features/      # Funcionalidades específicas
│   │   ├── context/       # Contextos de React
│   │   ├── hooks/         # Hooks personalizados
│   │   └── types/         # Definiciones TypeScript
│   └── public/
└── documentacion/         # Documentación del proyecto
```

## 🚀 Instalación y configuración local

### Requisitos previos

- PHP 8.2 o superior
- Composer
- PostgreSQL
- Node.js (v18 o superior)
- npm (v8 o superior)

### Configuración del backend

1. Navega al directorio del backend:
```bash
cd eyra-backend
```

2. Instala las dependencias:
```bash
composer install
```

3. Configura el archivo `.env` con tu configuración de base de datos:
```bash
DATABASE_URL="postgresql://username:password@127.0.0.1:5432/eyra_db"
```

4. Crea las claves JWT:
```bash
mkdir -p config/jwt
openssl genrsa -out config/jwt/private.pem -aes256 4096
openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem
```

5. Crea la base de datos y ejecuta las migraciones:
```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

6. Carga los datos de prueba (opcional):
```bash
php bin/console doctrine:fixtures:load
```

7. Inicia el servidor:
```bash
symfony serve -d
```

### Configuración del frontend

1. Navega al directorio del frontend:
```bash
cd eyra-frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno para desarrollo en `.env`:
```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 📖 Uso de la aplicación

### Para usuarios nuevos:
1. Accede a [https://eyraclub.es/](https://eyraclub.es/)
2. Regístrate con tu email y contraseña
3. Completa el proceso de onboarding
4. Comienza a registrar tu información diaria

### Para administradores:
1. Inicia sesión con las credenciales de administrador
2. Accede al panel de administración desde el menú
3. Gestiona usuarios, contenido y configuraciones del sistema

## 🎨 Guía de diseño

EYRA sigue una guía de estilos específica basada en:
- **Neumorfismo suave**: Sombras y efectos 3D sutiles
- **Paleta de colores**: Tonos rojos (#C62328) sobre fondos claros (#e7e0d5)
- **Tipografía**: Playfair Display para títulos, Inter para texto
- **Sin scroll**: Todas las vistas se adaptan a la altura de pantalla
- **Responsive**: Adaptación completa a móvil, tablet y desktop

## 🔧 API y documentación

- **Documentación de la API**: `https://eyraclub.es/api/docs`
- **Endpoints principales**:
  - Autenticación: `/api/auth`
  - Usuarios: `/api/users`
  - Ciclos: `/api/cycles`
  - Contenido: `/api/content`

## 👥 Funcionalidades de usuario

### Dashboard
- Vista general del ciclo actual
- Predicciones inteligentes
- Acceso rápido a funciones principales

### Calendario
- Registro diario de síntomas y estado de ánimo
- Visualización de fases del ciclo
- Predicciones basadas en patrones históricos

### Red Tent
- Biblioteca de contenido educativo
- Artículos sobre salud reproductiva
- Recursos y herramientas

### Sistema de acompañantes
- Invitación a parejas o personas de confianza
- Compartir información relevante del ciclo
- Gestión de permisos y privacidad

## 🔐 Seguridad y privacidad

- Autenticación JWT segura
- Cifrado de datos sensibles
- Cumplimiento con regulaciones de privacidad
- Control granular de permisos

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: Experiencia completa con navegación lateral
- **Tablet**: Menú lateral deslizable
- **Móvil**: Navegación inferior y diseño compacto

## 🤝 Contribución

Este proyecto es parte de un Trabajo de Fin de Grado. Para consultas o colaboraciones, contacta con el equipo de desarrollo.

## 📄 Licencia

Proyecto académico desarrollado para el Grado en Desarrollo de Aplicaciones Web.

---

**EYRA** - *Tu ciclo, tu poder, tu bienestar.*