# Control de Cambios - EYRA Backend

Este documento registra todos los cambios realizados durante el desarrollo del backend de EYRA.

## v0.7.0 - 31/05/2025

| Archivo | Descripción | Tipo de Fichero | Tipo de Cambio |
|---------|-------------|-----------------|----------------|
| GuestAccess.php | Añadido campo guestPreferences (JSON) para preferencias del invitado en calendario compartido | Entidad | Nueva funcionalidad |
| Version20250531000002.php | Migración para añadir columna guest_preferences a tabla guest_access | Migración | Nueva funcionalidad |
| CalendarAccessService.php | Nuevo servicio para gestionar acceso al calendario compartido con sistema de doble filtrado | Servicio | Nueva funcionalidad |
| GuestController.php | Añadidos 4 nuevos endpoints: GET/PUT preferences, PUT permissions, GET available-permissions | Controlador | Nueva funcionalidad |
| CycleController.php | Modificado endpoint /cycles/calendar para incluir datos de anfitriones (hostCycles) | Controlador | Mejora |
| CalendarAccessService.php | Implementado sistema de filtrado: permisos del anfitrión ∩ preferencias del invitado | Servicio | Nueva funcionalidad |
| CalendarAccessService.php | Soporte para permisos granulares: fases, detalles, síntomas, notas, estados de ánimo | Servicio | Nueva funcionalidad |

## v0.6.0 - 31/05/2025

| Archivo | Descripción | Tipo de Fichero | Tipo de Cambio |
|---------|-------------|-----------------|----------------|
| Condition.php | Añadidos campos category y severity para clasificar condiciones médicas | Entidad | Nueva funcionalidad |
| ConditionCategory.php | Nuevo enum con 11 categorías de condiciones médicas (ginecológicas, hormonales, etc.) | Enum | Nueva funcionalidad |
| ConditionSeverity.php | Nuevo enum con 4 niveles de severidad (leve, moderada, severa, crítica) | Enum | Nueva funcionalidad |
| ConditionRepository.php | Añadidos métodos search(), getUniqueCategories() y findByCategory() | Repositorio | Nueva funcionalidad |
| ConditionController.php | Implementados 5 endpoints de administración para admins: POST, PUT, DELETE, search, categories | Controlador | Nueva funcionalidad |
| Version20250531000001.php | Migración para añadir campos category y severity con índices y datos iniciales | Migración | Nueva funcionalidad |
| nixpacks.toml | Configuración de Nixpacks para deployment en Railway con PHP 8.2 | Configuración | Nueva funcionalidad |
| .railway.toml | Configuración alternativa de Railway para usar Dockerfile existente | Configuración | Nueva funcionalidad |
| HealthController.php | Nuevo controlador con endpoints de health check para verificación de deployment | Controlador | Nueva funcionalidad |
| start.sh | Script de inicio personalizado para Railway con migraciones automáticas | Script | Nueva funcionalidad |
| Dockerfile.railway | Dockerfile optimizado para Railway con PHP-CLI y servidor built-in | Docker | Nueva funcionalidad |
| Dockerfile.hybrid | Dockerfile alternativo que adapta el existente para Railway | Docker | Nueva funcionalidad |
| railway-start.sh | Script de inicio robusto con verificaciones y migraciones | Script | Nueva funcionalidad |
| entrypoint-railway.sh | Entrypoint modificado para usar servidor built-in en lugar de PHP-FPM | Script | Nueva funcionalidad |
| .dockerignore | Archivo para optimizar build de Docker excluyendo archivos innecesarios | Configuración | Nueva funcionalidad |
| Dockerfile.production | Dockerfile PRINCIPAL para Railway - optimizado y con generación JWT automática | Docker | Nueva funcionalidad |
| RAILWAY.md | Documentación específica para deployment en Railway con Docker | Documentación | Nueva funcionalidad |
| railway-start.sh | Script de inicio MEJORADO con diagnósticos avanzados y manejo robusto de errores | Script | Mejora |
| .railway.toml | Configuración SIMPLIFICADA para forzar uso de Docker en Railway | Configuración | Mejora |
| package.json | Archivo movido a .backup - causaba detección errónea como proyecto Node.js | Corrección | Corrección de error |
| package-lock.json | Archivo movido a .backup - causaba detección errónea como proyecto Node.js | Corrección | Corrección de error |
| .railwayapp | Archivo indicador para Railway de que es proyecto PHP/Docker | Configuración | Nueva funcionalidad |
| Dockerfile | Dockerfile estándar (nombre principal) para Railway | Docker | Nueva funcionalidad |
| .dockerignore | Actualizado para excluir archivos Node.js que no deberían estar en backend PHP | Configuración | Mejora |

## v0.5.0 - 29/05/2025

| Archivo | Descripción | Tipo de Fichero | Tipo de Cambio |
|---------|-------------|-----------------|----------------|
| PasswordResetToken.php | Nueva entidad para gestionar tokens de reset de contraseña con expiración y seguridad | Entidad | Nueva funcionalidad |
| PasswordResetTokenRepository.php | Repositorio con métodos especializados para validar y gestionar tokens de reset | Repositorio | Nueva funcionalidad |
| EmailService.php | Nuevo servicio para envío de emails (reset de contraseña, bienvenida, recordatorios) | Servicio | Nueva funcionalidad |
| base.html.twig | Template base para emails con diseño responsive y branding de EYRA | Template | Nueva funcionalidad |
| password_reset.html.twig | Template específico para emails de reset de contraseña con instrucciones claras | Template | Nueva funcionalidad |
| welcome.html.twig | Template de bienvenida para nuevos usuarios con guía de primeros pasos | Template | Nueva funcionalidad |
| cycle_reminder.html.twig | Template para recordatorios de ciclo (período próximo, ovulación, retrasos) | Template | Nueva funcionalidad |
| AuthController.php | Implementación completa de reset de contraseña con envío de emails reales | Controlador | Mejora |
| AuthController.php | Nuevo endpoint /password-reset/confirm para completar el proceso de reset | Controlador | Nueva funcionalidad |
| AuthController.php | Añadido envío automático de email de bienvenida en el registro | Controlador | Mejora |
| Version20250529000001.php | Migración para crear tabla password_reset_tokens con índices optimizados | Migración | Nueva funcionalidad |
| CleanExpiredResetTokensCommand.php | Comando de consola para limpiar tokens expirados automáticamente | Comando | Nueva funcionalidad |
| TestEmailUrlsCommand.php | Comando para verificar y probar configuración de URLs de frontend | Comando | Nueva funcionalidad |
| EmailService.php | URLs del frontend ahora configurables mediante variables de entorno | Servicio | Mejora |
| .env | Añadidas variables FRONTEND_BASE_URL, FRONTEND_RESET_PASSWORD_PATH, FRONTEND_DASHBOARD_PATH | Configuración | Mejora |
| welcome.html.twig | Template actualizado para usar URL configurable del dashboard | Template | Mejora |
| cycle_reminder.html.twig | Template actualizado para usar URL configurable del calendario | Template | Mejora |

## v0.4.0 - 28/05/2025

| Archivo | Descripción | Tipo de Fichero | Tipo de Cambio |
|---------|-------------|-----------------|----------------|
| InvitationCode.php | Creada nueva entidad para gestionar códigos de invitación temporales | Entidad | Nueva funcionalidad |
| InvitationCodeRepository.php | Creado repositorio para gestionar códigos de invitación con métodos especializados | Repositorio | Nueva funcionalidad |
| InvitationCodeService.php | Creado servicio para lógica de negocio de códigos de invitación | Servicio | Nueva funcionalidad |
| InvitationCodeController.php | Creado controlador con endpoints para generar, verificar, canjear y revocar códigos | Controlador | Nueva funcionalidad |
| GuestAccess.php | Añadida relación con InvitationCode para rastrear códigos canjeados | Entidad | Mejora |
| GuestType.php | Añadido nuevo tipo HEALTHCARE_PROVIDER para profesionales de salud | Enum | Mejora |
| Version20250528000001.php | Migración para crear tabla invitation_code y modificar guest_access | Migración | Nueva funcionalidad |
| EYRA-Invitation-Codes.postman_collection.json | Colección completa de Postman para probar sistema de códigos de invitación | Testing | Nueva funcionalidad |
| EYRA-Invitation-Codes.postman_environment.json | Entorno de Postman con variables para facilitar las pruebas | Testing | Nueva funcionalidad |
| README-Invitation-Codes-Testing.md | Guía completa para probar el sistema de códigos de invitación | Documentación | Nueva funcionalidad |
| Endpoints.md | Corregidos 6 endpoints de días del ciclo marcados incorrectamente como pendientes | Documentación | Corrección de error |
| Endpoints.md | Corregidas rutas de administración de /admin/users/* a /api/admin/users/* | Documentación | Corrección de error |
| Endpoints.md | Añadido campo avatar a respuestas de endpoints de usuario | Documentación | Mejora |
| Endpoints.md | Actualizados contadores: 69 implementados (+6), 33 pendientes (-6) | Documentación | Corrección de error |
| nelmio_api_doc.yaml | Configuración completa de NelmioApiDocBundle para Swagger/OpenAPI | Configuración | Nueva funcionalidad |
| nelmio_api_doc.yaml (routes) | Rutas para acceder a Swagger UI en /api/doc | Configuración | Nueva funcionalidad |
| ejemplo_controlador_documentado.php | Ejemplo completo de InvitationCodeController con atributos OpenAPI | Documentación | Nueva funcionalidad |
| GUIA_COMPLETA_SWAGGER.md | Guía paso a paso para configurar Swagger con todos los endpoints | Documentación | Nueva funcionalidad |

## v0.3.11 - 28/05/2025

| Archivo | Descripción | Tipo de Fichero | Tipo de Cambio |
|---------|-------------|-----------------|----------------|
| User.php | Añadido campo avatar (JSONB) para personalización del avatar del usuario | Entidad | Nueva funcionalidad |
| Version20250528000000.php | Migración para añadir campo avatar a la tabla user | Migración | Nueva funcionalidad |
| AuthController.php | Actualizado endpoints GET y PUT /profile para incluir campo avatar | Controlador | Mejora |
| AuthController.php | Modificado endpoint /register para inicializar avatar automáticamente | Controlador | Mejora |
| AuthController.php | Corregido manejo de avatar para aceptar tanto objetos como strings JSON | Controlador | Corrección de error |
| AdminController.php | Actualizado endpoints admin/users para soportar campo avatar | Controlador | Mejora |
| AdminController.php | Mejorado el manejo de avatar para soportar diferentes formatos de entrada | Controlador | Mejora |

## v0.3.10 - 28/05/2025

| Archivo | Descripción | Tipo de Fichero | Tipo de Cambio |
|---------|-------------|-----------------|----------------|
| AdminController.php | Creado nuevo controlador para administrar usuarios | Controlador | Nueva funcionalidad |
| AdminController.php | Corregido conflicto de nombres de método: renombrado getUser a getUserById | Controlador | Corrección de error |
| OnboardingController.php | Implementado nuevo endpoint GET para obtener todos los datos de onboarding | Controlador | Nueva funcionalidad |
| ConditionController.php | Actualizado endpoint `/conditions` para devolver todas las condiciones (activas e inactivas) | Controlador | Mejora |
| ConditionController.php | Implementado endpoint `/conditions/active` para obtener solo condiciones activas | Controlador | Nueva funcionalidad |
| ActiveConditionsController.php | Creado nuevo controlador para el endpoint `/conditions-active` | Controlador | Nueva funcionalidad |
| ActiveConditionProvider.php | Implementado proveedor para API Platform que filtra condiciones activas | Servicio | Nueva funcionalidad |
| CycleCalculatorService.php | Corregida la lectura de valores del onboarding | Servicio | Corrección de error |
| services.yaml | Configurado proveedor API Platform para condiciones activas | Configuración | Mejora |

## v0.3.7 - 27/05/2025

| Archivo | Descripción | Tipo de Fichero | Tipo de Cambio |
|---------|-------------|-----------------|----------------|
| OnboardingController.php | Añadido procesamiento del campo isPersonal que no estaba siendo manejado | Controlador | Corrección de error |

## v0.3.6 - 25/05/2025

| Archivo | Descripción | Tipo de Fichero | Tipo de Cambio |
|---------|-------------|-----------------|----------------|
| CycleDayController.php | Creación del controlador para gestionar días del ciclo con endpoints CRUD completos | Controlador | Nueva funcionalidad |
| Version20250525060001.php | Migración para corregir campos entity en tablas symptom_log y hormone_level | Migración | Corrección de error |
| CycleController.php | Actualizado con comentarios de documentación según el formato establecido | Controlador | Documentación |
| OnboardingController.php | Actualizado con comentarios de documentación según el formato establecido | Controlador | Documentación |
| CycleDay.php | Actualizado con comentarios de documentación según el formato establecido | Entidad | Documentación |
| MenstrualCycle.php | Actualizado con comentarios de documentación según el formato establecido | Entidad | Documentación |
| MenstrualCycleRepository.php | Actualizado con comentarios de documentación según el formato establecido | Repositorio | Documentación |
| CycleCalculatorService.php | Actualizado con comentarios de documentación según el formato establecido | Servicio | Documentación |
| CyclePhaseService.php | Actualizado con comentarios de documentación según el formato establecido | Servicio | Documentación |

## v0.3.5 - 24/05/2025

| Archivo | Descripción | Tipo de Fichero | Tipo de Cambio |
|---------|-------------|-----------------|----------------|
| composer.json | Añadida dependencia symfony/uid para resolver error ClassNotFoundError en endpoint onboarding | Configuración | Corrección de error |
| composer.json | ~~Downgrade de lexik/jwt-authentication-bundle a v2.16 para evitar dependencia de ext-sodium~~ REVERTIDO | Configuración | ~~Corrección de error~~ |
| composer.json | Añadida configuración platform.ext-sodium para simular la extensión mientras se habilita en XAMPP | Configuración | Corrección temporal |
| OnboardingController.php | Corregido manejo del array devuelto por startNewCycle() que causaba error "Call to a member function getId() on array" | Controlador | Corrección de error |
| HABILITAR_SODIUM_XAMPP.md | Creado archivo con instrucciones para habilitar ext-sodium en XAMPP | Documentación | Nueva funcionalidad |

## v0.3.4 - 23/05/2025

| Archivo | Descripción | Tipo de Fichero | Tipo de Cambio |
|---------|-------------|-----------------|----------------|
| MenstrualCycle.php | Corregido import del enum CyclePhase para usar el namespace correcto App\Enum\CyclePhase | Entidad | Corrección de error |

## v0.3.3 - 23/05/2025

| Archivo | Descripción | Tipo de Fichero | Tipo de Cambio |
|---------|-------------|-----------------|----------------|
| EYRA API 230525.postman_collection.json | Actualizada colección de Postman para incluir endpoints de predicción avanzada y reflejar el modelo basado en fases | Documentación/Testing | Actualización |

## v0.3.2 - 23/05/2025

| Archivo | Descripción | Tipo de Fichero | Tipo de Cambio |
|---------|-------------|-----------------|----------------|
| Version20250523000002.php | Migración corregida para eliminar campos obsoletos, con detección dinámica de restricciones | Migración | Corrección de errores |
| MigrateToCyclePhasesCommand.php | Comando para migrar datos del modelo antiguo al nuevo modelo basado en fases | Comando | Nueva funcionalidad |

## v0.3.1 - 23/05/2025

| Archivo | Descripción | Tipo de Fichero | Tipo de Cambio |
|---------|-------------|-----------------|----------------|
| CyclePhaseService.php | Nuevo servicio para gestionar cambios coordinados entre fases del ciclo | Servicio | Nueva funcionalidad |

## v0.3.0 - 23/05/2025

| Archivo | Descripción | Tipo de Fichero | Tipo de Cambio |
|---------|-------------|-----------------|----------------|
| Version20250523000001.php | Migración para eliminar campos obsoletos tras implementar el nuevo modelo basado en fases | Migración | Refactorización |
| CycleDay.php | Eliminados campos obsoletos 'cycle' y 'phase' | Entidad | Refactorización |
| CycleDayController.php | Actualizado para trabajar con fases en lugar de ciclos | Controlador | Refactorización |

## v0.2.0 - 23/05/2025

| Archivo | Descripción | Tipo de Fichero | Tipo de Cambio |
|---------|-------------|-----------------|----------------|
| Version20250523000000.php | Migración para implementar nuevo modelo de ciclos basado en fases | Migración | Nueva funcionalidad |
| MenstrualCycle.php | Añadidos campos 'phase' y 'cycleId' para implementar modelo basado en fases | Entidad | Nueva funcionalidad |
| CycleDay.php | Añadida relación con fase del ciclo (cyclePhase) | Entidad | Nueva funcionalidad |
| MenstrualCycleRepository.php | Añadidos métodos para trabajar con el nuevo modelo de fases | Repositorio | Nueva funcionalidad |
| CycleCalculatorService.php | Modificado para implementar el modelo basado en fases | Servicio | Nueva funcionalidad |
| CycleController.php | Actualizado para trabajar con el nuevo modelo basado en fases | Controlador | Nueva funcionalidad |

## v0.1.0 - 22/05/2025

| Archivo | Descripción | Tipo de Fichero | Tipo de Cambio |
|---------|-------------|-----------------|----------------|
| .env | Corregida discrepancia en rutas de claves JWT | Configuración | Corrección de error |
| Endpoints.md | Documentado endpoint `/cycles/predict` con formato de respuesta detallado | Documentación | Mejora de documentación |
| Endpoints.md | Documentados endpoints `/cycles/prediction-details` y `/cycles/sync-algorithm` | Documentación | Mejora de documentación |


### Dependencias y Configuración - v0.1.0

| Componente | Descripción | Versión | Comando Ejecutado |
|------------|-------------|---------|-------------------|


## Convención de Versionado

El proyecto sigue el versionado semántico:

- *MAYOR.MENOR.PARCHE* (ejemplo: 1.4.2)
- *MAYOR*: Cambios incompatibles con versiones anteriores
- *MENOR*: Nuevas funcionalidades compatibles con versiones anteriores
- *PARCHE*: Correcciones de errores compatibles con versiones anteriores

## Formato de Comentarios

En cada archivo modificado o añadido se incluirá un comentario con el siguiente formato:

/* ! dd/mm/yyyy [Explicación de la implementación] v.X.Y.Z */


## Notas sobre Dependencias

### Modificación v0.3.11
- *Motivo de actualización*: Implementación de la funcionalidad de personalización de avatar para los usuarios
- *Mejoras realizadas*:
  1. Nuevo campo avatar en la entidad User con estructura JSON predefinida
  2. Validación de la estructura del JSON tanto a nivel de base de datos como de entidad
  3. Valores predeterminados para usuarios existentes
  4. Soporte para diferentes formatos de entrada (array PHP o string JSON)
- *Código implementado*:
  - User.php: Añadido campo avatar como tipo JSON con anotaciones para API Platform
  - Version20250528000000.php: Migración para añadir el campo a la base de datos con restricción CHECK
  - AuthController.php: Actualizado para manejar el avatar en los endpoints de perfil y registro
  - AdminController.php: Actualizado para manejar el avatar en los endpoints de administración
- *Cambios de dependencias*:
  - Ninguno
- *Impacto*: Permite a los usuarios personalizar su avatar con múltiples características (color de piel, ojos, pelo, etc.)

### Modificación v0.3.10
- *Motivo de actualización*: Implementación del endpoint GET de onboarding, mejoras en la gestión de condiciones médicas activas y nuevo controlador para administración de usuarios
- *Mejoras realizadas*:
  1. Nuevo endpoint para obtener toda la información de onboarding del usuario
  2. Múltiples endpoints para obtener condiciones médicas activas
  3. Corrección en la lectura de valores personalizados del onboarding
  4. Nuevo controlador AdminController con endpoints para administrar usuarios
  5. Corrección de error en AdminController por conflicto de nombre con método heredado getUser()
- *Código implementado*:
  - OnboardingController: Añadido método `getOnboardingData()` para obtener todos los datos de configuración
  - ActiveConditionsController: Nuevo controlador para endpoint independiente de condiciones activas
  - ActiveConditionProvider: Proveedor para API Platform que filtra automáticamente por state=true
  - CycleCalculatorService: Corregido para usar el operador de fusión de null `??` y utilizar los valores del onboarding
  - AdminController: Nuevo controlador con endpoints para listar, obtener, editar y desactivar usuarios
- *Cambios de dependencias*:
  - Ninguno
- *Impacto*: Mejora significativa en la accesibilidad de los datos de configuración, condiciones médicas y administración de usuarios

### Modificación v0.3.5
- *Motivo de actualización*: Varios errores en el endpoint de onboarding - ClassNotFoundError y error de tipo de retorno
- *Error resuelto*: 
  1. "Attempted to load class 'Uuid' from namespace 'Symfony\Component\Uid'" al llamar al endpoint /onboarding
  2. "Call to a member function getId() on array" en OnboardingController línea 232
- *Dependencias actualizadas*: 
  - Añadido: symfony/uid v7.2.*
- *Configuración temporal añadida*:
  - composer.json: platform.ext-sodium = "7.2" (simula la extensión sodium mientras se habilita en XAMPP)
- *Código corregido*:
  - OnboardingController: Actualizado para manejar correctamente el array devuelto por CycleCalculatorService::startNewCycle()
- *Documentación añadida*:
  - HABILITAR_SODIUM_XAMPP.md: Instrucciones para habilitar ext-sodium en XAMPP y mantener lexik/jwt-authentication-bundle v3.1.1
- *Impacto*: Resuelve los errores del endpoint onboarding. Para el error de ext-sodium, se proporcionan instrucciones para habilitarla en XAMPP