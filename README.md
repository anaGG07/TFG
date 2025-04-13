# EYRA - Aplicación de Seguimiento de Salud Reproductiva

EYRA es una aplicación web (con futuro como aplicación móvil) para el seguimiento menstrual y salud reproductiva, desarrollada como Trabajo de Fin de Grado de Desarrollo de Aplicaciones Web.

## Estructura del Proyecto

- `eyra-backend`: API backend desarrollada con Symfony 7.2
- `eyra-frontend`: Aplicación frontend desarrollada con React + TypeScript

## Requisitos previos

- PHP 8.2 o superior
- Composer
- PostgreSQL
- Node.js (v18 o superior)
- npm (v8 o superior)

## Configuración del backend

1. Navega al directorio del backend:

```bash
cd eyra-backend
```

2. Instala las dependencias:

```bash
composer install
```

3. Crea las claves JWT:

```bash
mkdir -p config/jwt
openssl genrsa -out config/jwt/private.pem -aes256 4096
# Introduce la frase de paso configurada en .env (JWT_PASSPHRASE)
openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem
# Introduce la misma frase de paso
```

4. Configura tu base de datos en el archivo `.env` o `.env.local` (ya está configurado para PostgreSQL)

5. Crea la base de datos:

```bash
php bin/console doctrine:database:create
```

6. Ejecuta las migraciones:

```bash
php bin/console doctrine:migrations:migrate
```

7. Instala el componente Asset si aún no está instalado:

```bash
composer require symfony/asset
```

8. Inicia el servidor:

```bash
symfony serve -d
```

El backend estará disponible en `http://localhost:8000/api`

## Configuración del frontend

1. Navega al directorio del frontend:

```bash
cd eyra-frontend
```

2. Instala las dependencias:

```bash
npm install
```

3. Instala las dependencias adicionales:

```bash
npm install react-router-dom @tailwindcss/forms axios
```

4. Configura Tailwind CSS:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

5. Inicia el servidor de desarrollo:

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## Acceso a la API y documentación

- Documentación de la API: `http://localhost:8000/api/docs`
- Endpoints API: `http://localhost:8000/api`

## Uso de la aplicación

1. Regístrate como nuevo usuario en la aplicación frontend
2. Inicia sesión con tus credenciales
3. Desde el dashboard, podrás:
   - Ver y gestionar tu ciclo menstrual
   - Añadir información diaria sobre síntomas
   - Recibir recomendaciones personalizadas
   - Invitar a otras personas a seguir tu ciclo (parejas, etc.)
