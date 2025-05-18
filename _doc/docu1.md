# Documentación TFG - Plataforma EIRA: Despliegue, Configuración y Resolución de Errores

## 1. Introducción

La presente documentación describe el proceso de despliegue, configuración y corrección de errores en la plataforma web **EIRA**, desarrollada como parte del Trabajo de Fin de Grado. El objetivo principal es dejar constancia técnica del entorno de ejecución y de las decisiones implementadas en la infraestructura frontend, backend y de servicios complementarios (NGINX, Docker, certificados SSL, entre otros).

## 2. Tecnologías utilizadas

- **Frontend**: React + TypeScript + Vite
- **Backend**: Symfony 6 + PHP 8.2 + PostgreSQL
- **Servidor web**: NGINX
- **Contenedores**: Docker + Docker Compose
- **Certificados SSL**: Let's Encrypt (via Certbot)
- **Autenticación**: JWT (LexikJWTAuthenticationBundle)
- **ORM**: Doctrine

## 3. Arquitectura general

El proyecto se estructura mediante contenedores Docker que se comunican entre sí en una red interna definida por Docker Compose:

- `eyra-web`: contiene la aplicación frontend React.
- `eyra-api`: contiene el backend Symfony.
- `eyra-db`: base de datos PostgreSQL.
- `eyra-proxy`: servidor NGINX que redirige tráfico y maneja certificados SSL.

## 4. Configuración y despliegue

### 4.1 Docker Compose

Se define en `docker-compose.yml` los servicios anteriormente descritos, asignando volúmenes, puertos y dependencias. El backend se configura con `php-fpm` para escuchar en el puerto 9000.

### 4.2 Servidor NGINX

NGINX actúa como proxy inverso y gestor de certificados SSL. Se define la redirección de HTTP a HTTPS y el reenvío de rutas `/api/` hacia el backend mediante:

```nginx
location /api/ {
  proxy_pass http://eyra-api:9000;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

Se configuró adicionalmente una directiva para servir los ficheros de validación de Certbot desde `/usr/share/nginx/html`:

```nginx
location /.well-known/acme-challenge/ {
  root /usr/share/nginx/html;
}
```

### 4.3 Certificados SSL

Se generaron correctamente mediante Certbot con modo `--webroot`, tras validar que el archivo `test.txt` era accesible públicamente desde:

```
https://eyraclub.es/.well-known/acme-challenge/test.txt
```

## 5. Problemas detectados y soluciones aplicadas

### 5.1 Frontend

- **Doble prefijo `/api/api/`**: Se corregió la construcción de la URL base en `httpClient.ts` para evitar redundancias.
- **Import.meta fuera de módulos**: El error `Cannot use 'import.meta' outside a module` se resolvió usando variables de entorno correctamente injectadas por Vite.
- **Failed to fetch**: Se debía a CORS y falta de conexión con el backend, posteriormente resueltos.

### 5.2 Backend Symfony

- **Errores 401 - JWT Token not found**: Se verificó la configuración del LexikJWTAuthenticationBundle, incluyendo los endpoints `/api/register` y `/api/login` en el `access_control`.
- **Errores 500**: Se debían a la ausencia de campos obligatorios (`gender_identity`, `birthDate`, etc.). Se solucionó ajustando el body JSON enviado desde frontend.

### 5.3 Configuración CORS

Se ajustó `nelmio_cors.yaml` con el siguiente origen permitido:

```yaml
allow_origin: ['^https?://(localhost|eyraclub\.es)(:[0-9]+)?$']
```

### 5.4 Cookies HTTP-only y SameSite

El backend genera las cookies JWT con la opción `SameSite=Lax` para evitar rechazos por navegadores modernos. Además, se forzó el uso de `credentials: 'include'` en todas las peticiones desde frontend.

### 5.5 Errores en fetch y parsing JSON

Se mejoró el `httpClient.ts` para manejar errores de red, parseo y respuestas no JSON:

```ts
try {
  return await response.json();
} catch (e) {
  const text = await response.text();
  throw new Error(`Respuesta no válida del servidor: ${text}`);
}
```

## 6. Validación de funcionalidades

Se realizaron las siguientes pruebas manuales:

- Registro de usuario: validaciones backend y mensajes de error claros.
- Inicio de sesión con JWT.
- Peticiones protegidas: validación de token.
- Cookies persistentes HTTP-only.
- Acceso correcto desde `https://eyraclub.es/`

## 7. Conclusiones

Este proceso de despliegue y resolución de errores ha sido fundamental para comprender el funcionamiento conjunto de servidores, contenedores y servicios web seguros. La configuración adecuada de certificados, CORS, seguridad con JWT y manejo de errores robusto constituyen pilares clave para el funcionamiento fiable de una API REST en producción.

El resultado ha sido un entorno desplegado en la nube funcional, seguro, y correctamente documentado, cumpliendo los objetivos técnicos del Trabajo de Fin de Grado.

