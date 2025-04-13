# Documentación Técnica Backend EYRA

## Descripción General

EYRA es una aplicación de seguimiento menstrual integral que acompaña a la mujer a lo largo de su vida, proporcionando seguimiento de ciclos menstruales, embarazo, menopausia y condiciones de salud relacionadas. La aplicación también se enfoca en inclusividad para personas en transición de género y ofrece funcionalidades para parejas y control parental.

## Arquitectura

El backend de EYRA está desarrollado con un enfoque orientado a API RESTful utilizando las siguientes tecnologías:

### Tecnologías Principales

- **Framework**: Symfony 6.2
- **API**: API Platform 3.0
- **Base de Datos**: MySQL 8.0
- **Autenticación**: JWT con sistema de Refresh Tokens
- **Documentación**: OpenAPI/Swagger

### Estructura del Proyecto

```
eyra-backend/
├── config/                  # Configuración de Symfony y API Platform
├── migrations/              # Migraciones de base de datos
├── public/                  # Punto de entrada de la aplicación
├── src/
│   ├── ApiResource/         # Recursos personalizados para API Platform
│   ├── Command/             # Comandos de consola
│   ├── Controller/          # Controladores de la aplicación
│   ├── Entity/              # Entidades y modelos de datos
│   ├── Enum/                # Enumeraciones para tipos predefinidos
│   ├── Repository/          # Repositorios para acceso a datos
│   ├── Security/            # Componentes de seguridad
│   └── Service/             # Servicios de lógica de negocio
└── vendor/                  # Dependencias de terceros
```

## Modelo de Datos

### Entidades Principales

#### User
Representa a un usuario de la aplicación, ya sea usuario principal, pareja o padre/madre.
- Atributos clave: email, password, username, name, lastName, genderIdentity, birthDate, profileType
- Relaciones: MenstrualCycle, UserCondition, Notification, GuestAccess

#### MenstrualCycle
Registra un ciclo menstrual completo.
- Atributos clave: startDate, endDate, duration, notes, estimatedNextStart, averageCycleLength
- Relaciones: User, CycleDay

#### CycleDay
Representa un día específico dentro de un ciclo.
- Atributos clave: date, dayNumber, phase, mood, symptoms, notes
- Relaciones: MenstrualCycle

#### Condition
Define una condición médica que puede afectar al usuario.
- Atributos clave: name, description, isChronic
- Relaciones: UserCondition, Content

#### UserCondition
Asocia una condición médica con un usuario específico.
- Atributos clave: startDate, endDate, notes
- Relaciones: User, Condition

#### Content
Contenido educativo e informativo para los usuarios.
- Atributos clave: title, body, type, tags
- Relaciones: Condition, CyclePhase

#### Notification
Sistema unificado de notificaciones y alertas.
- Atributos clave: message, type, priority, context, read, scheduledFor, targetUserType
- Relaciones: User, Condition (opcional), RelatedEntity (polimórfica)

#### PregnancyLog
Seguimiento de embarazo.
- Atributos clave: startDate, dueDate, week, symptoms, fetalMovements, ultrasoundDate, notes
- Relaciones: User

#### MenopauseLog
Seguimiento de menopausia.
- Atributos clave: hotFlashes, moodSwings, vaginalDryness, insomnia, hormoneTherapy, notes
- Relaciones: User

#### GuestAccess
Gestiona el acceso de invitados (parejas o control parental).
- Atributos clave: accessType, permissions, active
- Relaciones: User (owner), User (guest)

#### RefreshToken
Gestiona los tokens de autenticación para mantener la sesión.
- Atributos clave: token, expiresAt, ipAddress, userAgent
- Relaciones: User

## API Endpoints

### Autenticación y Usuarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/register | Registro de nuevo usuario |
| POST | /api/login | Inicio de sesión |
| POST | /api/refresh-token | Actualización de token JWT |
| POST | /api/logout | Cierre de sesión |
| POST | /api/logout-all | Cierre de todas las sesiones |
| GET | /api/profile | Obtener perfil del usuario autenticado |
| PUT | /api/profile | Actualizar perfil |
| POST | /api/password-change | Cambiar contraseña |
| POST | /api/password-reset | Solicitar restablecimiento de contraseña |
| GET | /api/active-sessions | Listar sesiones activas |

### Ciclos Menstruales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/cycles/current | Obtener ciclo actual |
| GET | /api/cycles/today | Obtener información del día actual |
| GET | /api/cycles/recommendations | Obtener recomendaciones personalizadas |
| GET | /api/cycles/calendar | Obtener datos de calendario |
| GET | /api/cycles/predict | Predecir próximo ciclo |
| POST | /api/cycles/start-cycle | Iniciar nuevo ciclo |
| GET | /api/menstrual_cycles | Listar todos los ciclos |
| GET | /api/menstrual_cycles/{id} | Obtener ciclo específico |
| POST | /api/menstrual_cycles | Crear nuevo ciclo |
| PUT | /api/menstrual_cycles/{id} | Actualizar ciclo |
| DELETE | /api/menstrual_cycles/{id} | Eliminar ciclo |

### Condiciones Médicas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/conditions | Listar todas las condiciones |
| GET | /api/conditions/{id} | Obtener condición específica |
| GET | /api/conditions/user | Obtener condiciones del usuario |
| POST | /api/conditions/user/add | Añadir condición al usuario |
| PUT | /api/conditions/user/{id} | Actualizar condición del usuario |
| DELETE | /api/conditions/user/{id} | Eliminar condición del usuario |
| GET | /api/conditions/user/active | Listar condiciones activas |
| GET | /api/conditions/content/{id} | Obtener contenido relacionado |

### Embarazo

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/pregnancy | Listar registros de embarazo |
| GET | /api/pregnancy/{id} | Obtener registro específico |
| POST | /api/pregnancy | Crear registro de embarazo |
| PUT | /api/pregnancy/{id} | Actualizar registro |
| DELETE | /api/pregnancy/{id} | Eliminar registro |
| GET | /api/pregnancy/weekly/{week} | Información semanal |
| POST | /api/pregnancy/calculate-due-date | Calcular fecha probable de parto |

### Menopausia

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/menopause | Obtener registro de menopausia |
| POST | /api/menopause | Crear o actualizar registro |
| PUT | /api/menopause | Actualizar registro |
| GET | /api/menopause/info | Obtener información educativa |
| GET | /api/menopause/symptoms | Obtener gestión de síntomas |

### Notificaciones

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/notifications | Obtener notificaciones |
| GET | /api/notifications/unread | Obtener notificaciones no leídas |
| POST | /api/notifications/read/{id} | Marcar como leída |
| POST | /api/notifications/read-all | Marcar todas como leídas |
| DELETE | /api/notifications/{id} | Eliminar notificación |

### Invitados y Acceso

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/guests | Listar invitados |
| POST | /api/guests/invite | Invitar usuario |
| PUT | /api/guests/{id}/permissions | Actualizar permisos |
| DELETE | /api/guests/{id} | Eliminar invitado |

## Servicios Principales

### CycleCalculatorService
Realiza cálculos relacionados con ciclos menstruales, predicciones y estimaciones.

```php
// Métodos principales
public function predictNextCycle(User $user): array;
public function startNewCycle(User $user, \DateTime $startDate): MenstrualCycle;
public function calculatePhase(MenstrualCycle $cycle, int $dayNumber): CyclePhase;
```

### ContentRecommendationService
Genera recomendaciones personalizadas de contenido basadas en el perfil del usuario.

```php
// Métodos principales
public function getPersonalizedRecommendations(User $user, ?ContentType $type = null, int $limit = 5): array;
public function getRecommendationsForPhase(CyclePhase $phase, int $limit = 3): array;
```

### NotificationService
Gestiona la creación y envío de notificaciones a los usuarios.

```php
// Métodos principales
public function createNotification(User $user, string $message, NotificationType $type): Notification;
public function scheduleNotification(User $user, string $message, \DateTime $scheduledFor): Notification;
public function sendNotificationsToGuests(User $owner, string $message, GuestAccessType $accessType): int;
```

### TokenService
Gestiona la autenticación y tokens JWT y refresh tokens.

```php
// Métodos principales
public function createJwtToken(User $user): string;
public function createRefreshToken(User $user, Request $request = null): RefreshToken;
public function validateRefreshToken(string $token): ?User;
public function revokeRefreshToken(string $token): bool;
public function revokeAllUserTokens(User $user): int;
```

## Seguridad

### Autenticación
El sistema utiliza JWT (JSON Web Tokens) para la autenticación, complementado con un sistema de refresh tokens para mantener sesiones activas de forma segura. 

Los tokens JWT tienen una vida útil corta (30 minutos), mientras que los refresh tokens se almacenan en la base de datos y pueden durar más tiempo (30 días por defecto).

### Permisos y Roles
Se implementan diversos niveles de acceso:
- ROLE_USER: Usuario estándar
- ROLE_GUEST: Usuario invitado (pareja)
- ROLE_PARENT: Usuario con control parental
- ROLE_ADMIN: Administrador del sistema

### Validación
Se implementa validación rigurosa tanto a nivel de entidad (utilizando las anotaciones de validación de Symfony) como a nivel de controlador.

## Gestión de Caché

Para optimizar el rendimiento, se implementa caché a nivel de consulta en los repositorios principales:

```php
// Ejemplo de uso de caché
public function findCurrentForUser(User $user): ?CycleDay
{
    $today = new \DateTime('today');
    $cacheKey = "current_day_user_{$user->getId()}_date_{$today->format('Ymd')}";
    
    return $this->createQueryBuilder('cd')
        ->join('cd.cycle', 'c')
        ->andWhere('c.user = :user')
        ->andWhere('cd.date = :today')
        ->setParameter('user', $user)
        ->setParameter('today', $today)
        ->getQuery()
        ->enableResultCache(86400, $cacheKey) // Cache durante 24 horas
        ->getOneOrNullResult();
}
```

## Documentación de API

La API está documentada utilizando OpenAPI/Swagger, con configuración detallada en `/config/packages/api_platform.yaml`. 

Acceso a la documentación interactiva: `/api/docs`

## Configuración y Despliegue

### Requisitos del Sistema
- PHP 8.1 o superior
- MySQL 8.0 o superior
- Composer
- Symfony CLI (para desarrollo)

### Instalación para Desarrollo

```bash
# Clonar repositorio
git clone https://github.com/username/eyra-backend.git
cd eyra-backend

# Instalar dependencias
composer install

# Configurar variables de entorno (copiar .env a .env.local)
cp .env .env.local
# Editar .env.local con las credenciales de base de datos

# Crear base de datos
php bin/console doctrine:database:create

# Ejecutar migraciones
php bin/console doctrine:migrations:migrate

# Cargar datos iniciales (opcional)
php bin/console doctrine:fixtures:load

# Iniciar servidor de desarrollo
symfony server:start
```

### Despliegue en Producción

Para despliegue en producción, se recomienda:
1. Utilizar un servidor web como Nginx o Apache
2. Configurar PHP-FPM para procesamiento de PHP
3. Configurar certificados SSL
4. Establecer variables de entorno apropiadas (APP_ENV=prod)
5. Optimizar el autoloader de Composer (`composer install --optimize-autoloader --no-dev`)

## Buenas Prácticas Implementadas

- **Arquitectura en capas**: Separación clara entre controladores, servicios y repositorios
- **Inyección de dependencias**: Uso del contenedor de servicios de Symfony
- **Validación robusta**: A nivel de entidad y controlador
- **Gestión de errores**: Respuestas de error estructuradas y consistentes
- **Optimización de rendimiento**: Uso de caché y consultas optimizadas
- **Seguridad**: Implementación de JWT con refresh tokens, validación de input

## Recursos Utilizados Durante el Desarrollo

### Documentación Oficial

- [Symfony Documentation](https://symfony.com/doc/current/index.html)
- [API Platform Documentation](https://api-platform.com/docs/)
- [Doctrine ORM Documentation](https://www.doctrine-project.org/projects/doctrine-orm/en/latest/index.html)
- [JWT Authentication](https://github.com/lexik/LexikJWTAuthenticationBundle/blob/master/Resources/doc/index.md)

### Artículos y Tutoriales

- "RESTful API Design with Symfony" - Les-Tilleuls.coop
- "Implementing Refresh Tokens with JWT Authentication in Symfony" - Digital Ocean
- "Advanced Doctrine Performance Optimization" - Symfony Cast
- "Designing a Health Tracking API" - API Design Blog

### Literatura Técnica

- "REST API Design Rulebook" - Mark Masse
- "Design Patterns: Elements of Reusable Object-Oriented Software" - Gang of Four
- "Clean Code: A Handbook of Agile Software Craftsmanship" - Robert C. Martin
- "Domain-Driven Design: Tackling Complexity in the Heart of Software" - Eric Evans

## Extensibilidad y Futuras Mejoras

### Arquitectura para Evolución

El backend se ha diseñado teniendo en cuenta la escalabilidad y extensibilidad:

1. **Integración de IA**:
   - Punto de extensión para conectar con servicios de IA a través de una interfaz de servicio

2. **Aplicación Móvil**:
   - API preparada para ser consumida por aplicaciones móviles
   - Sistema de autenticación compatible con clientes móviles

3. **Funcionalidades Futuras**:
   - Estructura para añadir nuevos tipos de seguimiento
   - Sistema flexible de notificaciones para incluir nuevos canales (push, SMS)
   - Modelo de datos extensible para nuevas relaciones entre entidades

### Próximos Pasos Recomendados

1. Implementar tests unitarios y funcionales
2. Añadir sistema de localización para internacionalización
3. Implementar integración con servicios de IA para recomendaciones personalizadas
4. Desarrollar gestor de eventos para desacoplar procesos asíncronos
5. Implementar sistema de analíticas para seguimiento de uso

## Problemas Conocidos y Soluciones

### Limitaciones Actuales

- **Rendimiento con conjuntos grandes de datos**: Optimizar consultas y considerar particionamiento
- **Concurrencia de escritura**: Implementar bloqueo optimista en entidades críticas
- **Webhook para notificaciones externas**: Pendiente de implementación

### Soluciones Recomendadas

- Implementar sistema de cola para procesos pesados
- Considerar migración a arquitectura CQRS para separar lecturas y escrituras
- Implementar más capas de caché, especialmente para datos relativamente estáticos

## Licencia y Atribuciones

Este proyecto es propiedad intelectual de su creador original y se distribuye bajo una licencia privada. No se permite su redistribución o uso sin autorización expresa.

---

Documentación preparada por [Tu Nombre]  
Última actualización: [Fecha]

Para consultas técnicas: [tu-email@dominio.com]