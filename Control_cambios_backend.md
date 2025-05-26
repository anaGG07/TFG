# Control de Cambios - EYRA Backend

Este documento registra todos los cambios realizados durante el desarrollo del backend de EYRA.

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