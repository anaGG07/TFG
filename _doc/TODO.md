# PLAN DE IMPLEMENTACIÓN DE ENDPOINTS - EYRA BACKEND

Este plan está diseñado para completar la implementación de todos los endpoints pendientes en un plazo de 10 días.

## Visión General

- **Fecha Límite:** 10 días a partir de hoy
- **Prioridad:** Implementar primero las funcionalidades core para ciclos menstruales y algoritmo de predicción
- **Enfoque:** Primero completar endpoints críticos, luego los secundarios

## FASE 1 (Días 1-3): Endpoints Críticos para CRUD de Ciclos

### Día 1: Completar Ciclos Menstruales
- **Mañana:**
  - [ ] `/cycles` (GET) - Listar todos los ciclos del usuario
  - [ ] `/cycles/{id}` (GET) - Obtener un ciclo específico
  - [ ] `/cycles/{id}` (PUT) - Actualizar ciclo existente
  
- **Tarde:**
  - [ ] `/cycles/{id}` (DELETE) - Eliminar ciclo
  - [ ] `/cycles/end-cycle/{id}` (POST) - Finalizar ciclo actual
  - [ ] Refactorizar y mejorar `/cycles/predict` con algoritmo matemático básico

### Día 2: Implementar Días del Ciclo
- **Mañana:**
  - [ ] `/cycle-days` (GET) - Listar días de ciclo
  - [ ] `/cycle-days/{id}` (GET) - Obtener día específico
  - [ ] `/cycle-days` (POST) - Registrar nuevo día de ciclo
  
- **Tarde:**
  - [ ] `/cycle-days/{id}` (PUT) - Actualizar día de ciclo
  - [ ] `/cycle-days/{id}` (DELETE) - Eliminar día de ciclo
  - [ ] `/cycle-days/date/{date}` (GET) - Obtener día por fecha

### Día 3: Implementar Algoritmo de Predicción
- **Mañana:**
  - [ ] Crear servicio para algoritmo ARIMA/Wavelet para análisis de series temporales
  - [ ] Desarrollar clases de modelo matemático para predicciones
  
- **Tarde:**
  - [ ] `/cycles/prediction-details` (GET) - Detalles de predicción
  - [ ] `/cycles/sync-algorithm` (POST) - Recalcular algoritmo de predicción
  - [ ] `/cycles/statistics` (GET) - Estadísticas de ciclos

## FASE 2 (Días 4-6): Endpoints para Síntomas y Condiciones

### Día 4: Síntomas
- **Mañana:**
  - [ ] `/symptoms` (GET) - Listar categorías de síntomas
  - [ ] `/symptoms/log` (POST) - Registrar síntoma
  - [ ] `/symptoms/log/{id}` (PUT) - Actualizar registro de síntoma
  
- **Tarde:**
  - [ ] `/symptoms/log/{id}` (DELETE) - Eliminar registro de síntoma
  - [ ] `/symptoms/day/{cycleDayId}` (GET) - Obtener síntomas por día
  - [ ] `/symptoms/stats` (GET) - Estadísticas de síntomas

### Día 5: Condiciones Médicas (Admin)
- **Mañana:**
  - [ ] `/conditions` (POST) - Crear nueva condición (admin)
  - [ ] `/conditions/{id}` (PUT) - Actualizar condición (admin)
  - [ ] `/conditions/{id}` (DELETE) - Eliminar condición (admin)
  
- **Tarde:**
  - [ ] `/conditions/search` (GET) - Buscar condiciones
  - [ ] `/conditions/categories` (GET) - Listar categorías de condiciones

### Día 6: Completar Onboarding y Usuarios (Admin)
- **Mañana:**
  - [ ] `/onboarding` (GET) - Obtener datos de onboarding
  - [ ] `/onboarding/steps` (GET) - Obtener pasos de onboarding
  - [ ] `/onboarding/step/{step}` (POST) - Completar paso específico de onboarding
  
- **Tarde:**
  - [ ] `/password-reset/confirm` (POST) - Confirmar restablecimiento de contraseña
  - [ ] `/users` (GET) - Listar usuarios (admin)
  - [ ] `/users/{id}` (GET) - Obtener usuario por ID (admin)
  - [ ] `/users/{id}` (PUT) - Actualizar usuario (admin)
  - [ ] `/users/{id}` (DELETE) - Desactivar usuario (admin)

## FASE 3 (Días 7-8): Contenido y Invitados

### Día 7: Contenido y Favoritos
- **Mañana:**
  - [ ] `/content/search` (GET) - Buscar contenido
  - [ ] `/content/favorites` (GET) - Obtener contenido favorito
  - [ ] `/content/favorites/{id}` (POST) - Añadir a favoritos
  
- **Tarde:**
  - [ ] `/content/favorites/{id}` (DELETE) - Eliminar de favoritos
  - [ ] `/content/popular` (GET) - Obtener contenido popular
  - [ ] `/content/related/{id}` (GET) - Obtener contenido relacionado

### Día 8: Invitados y Accesos + Notificaciones
- **Mañana:**
  - [ ] `/guests/{id}` (GET) - Obtener detalle de un acceso específico
  - [ ] `/guests/available-users` (GET) - Listar usuarios disponibles para invitar
  - [ ] `/guests/accept/{id}` (POST) - Aceptar invitación
  - [ ] `/guests/decline/{id}` (POST) - Rechazar invitación
  
- **Tarde:**
  - [ ] `/notifications` (POST) - Crear nueva notificación (admin)
  - [ ] `/notifications/settings` (GET) - Obtener preferencias de notificaciones
  - [ ] `/notifications/settings` (PUT) - Actualizar preferencias de notificaciones

## FASE 4 (Días 9-10): Endpoints Especializados

### Día 9: Embarazo, Menopausia e Insights
- **Mañana:**
  - [ ] Implementación de diarios para embarazo y menopausia:
    - `/pregnancy/daily-log` (POST)
    - `/pregnancy/daily-log/{date}` (GET)
    - `/pregnancy/daily-logs/{pregnancyId}` (GET)
    - `/menopause/daily-log` (POST)
    - `/menopause/daily-log/{date}` (GET)
    - `/menopause/daily-logs` (GET)
  
- **Tarde:**
  - [ ] Implementación de insights avanzados:
    - `/insights/cycles` (GET)
    - `/insights/symptoms` (GET)
    - `/insights/hormone-levels` (GET)
    - `/insights/trends` (GET)

### Día 10: Niveles Hormonales y Consultas IA
- **Mañana:**
  - [ ] Implementación de niveles hormonales:
    - `/hormone-levels` (GET/POST)
    - `/hormone-levels/{id}` (GET/PUT/DELETE)
    - `/hormone-levels/types` (GET)
    - `/hormone-levels/chart` (GET)
    - `/hormone-levels/reference` (GET)
  
- **Tarde:**
  - [ ] Implementación de consultas IA:
    - `/ai/chat` (POST)
    - `/ai/history` (GET)
    - `/ai/history/{id}` (GET)
    - `/ai/suggestions` (GET)
    - `/ai/feedback` (POST)
  
- **Noche:**
  - [ ] Pruebas finales, corrección de errores y documentación

## Notas de Prioridad

1. **Endpoints Críticos** (Fase 1): 
   - Representan la funcionalidad central de seguimiento del ciclo menstrual.
   - El algoritmo de predicción debe implementarse temprano para que pueda ser probado adecuadamente.

2. **Endpoints Secundarios** (Fase 2 y 3):
   - Complementan la funcionalidad principal y enriquecen la experiencia de usuario.
   - Los endpoints administrativos pueden implementarse con menor prioridad.

3. **Endpoints Especializados** (Fase 4):
   - Estas funcionalidades pueden considerarse "premium" o complementarias.
   - Si el tiempo es limitado, pueden posponerse para una futura actualización.

## Consideraciones Técnicas

- **Reutilización de código:** Crear servicios compartidos para operaciones comunes (CRUD, validación, etc.)
- **Testing:** Implementar pruebas unitarias para los endpoints críticos, especialmente el algoritmo de predicción
- **Caché:** Implementar estrategias de caché para mejorar el rendimiento, particularmente para `/cycles/predict` y estadísticas
- **Batch processing:** Considerar procesamiento por lotes para actualizar predicciones en background
- **Estandarización de respuestas:** Mantener un formato consistente en todas las respuestas API

## Plan de Contingencia

Si no se pueden completar todos los endpoints en 10 días:

1. **Priorizar Fase 1 completa + partes críticas de Fase 2**
2. **Implementar versiones simplificadas** de los endpoints menos críticos
3. **Simular** temporalmente las respuestas de los endpoints de niveles hormonales y IA con datos estáticos

## Seguimiento del Progreso

- Revisar diariamente el progreso y ajustar el plan según sea necesario
- Documentar los endpoints completados y cualquier desafío encontrado
- Realizar pruebas de integración regularmente para asegurar la compatibilidad entre endpoints