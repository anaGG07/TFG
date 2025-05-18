# EYRA Backend - Documentación de Endpoints

Este documento contiene todos los endpoints disponibles en el backend de EYRA, organizados por controlador con sus respectivos métodos, parámetros de entrada y salidas, indicando cuáles están implementados y los que deben crearse para un CRUD completo.

## Índice
- [EYRA Backend - Documentación de Endpoints](#eyra-backend---documentación-de-endpoints)
  - [Índice](#índice)
  - [Autenticación y Perfil](#autenticación-y-perfil)
  - [Ciclos Menstruales](#ciclos-menstruales)
  - [Días del Ciclo](#días-del-ciclo)
  - [Síntomas](#síntomas)
  - [Invitados y Accesos](#invitados-y-accesos)
  - [Onboarding](#onboarding)
  - [Notificaciones](#notificaciones)
  - [Condiciones Médicas](#condiciones-médicas)
  - [Contenido](#contenido)
  - [Insights](#insights)
  - [Menopausia](#menopausia)
  - [Embarazo](#embarazo)
  - [Niveles Hormonales](#niveles-hormonales)
  - [Consultas IA](#consultas-ia)

## Autenticación y Perfil

| Endpoint | Método | Descripción | Parámetros de Entrada | Respuesta | Implementado |
|----------|--------|-------------|----------------------|-----------|--------------|
| `/login_check` | POST | Autenticar usuario (gestionado por firewall) | JSON: `{ "username": "email@ejemplo.com", "password": "contraseña" }` | JSON con token JWT + cookie de sesión | ✅ |
| `/register` | POST | Registrar nuevo usuario | JSON: `{ "email": "", "password": "", "username": "", "name": "", "lastName": "", "genderIdentity": "", "birthDate": "", "profileType": "" }` | JSON con información básica del usuario creado | ✅ |
| `/logout` | POST | Cerrar sesión actual | - | Mensaje de confirmación + eliminación de cookies | ✅ |
| `/logout-all` | POST | Cerrar todas las sesiones | - | Mensaje de confirmación | ✅ |
| `/profile` | GET | Obtener perfil del usuario | - | JSON con datos completos del perfil | ✅ |
| `/profile` | PUT | Actualizar perfil | JSON con campos a actualizar | JSON con perfil actualizado | ✅ |
| `/sav-onboarding` | POST | Completar el onboarding | JSON con datos de onboarding | Mensaje de confirmación | ✅ |
| `/password-change` | POST | Cambiar contraseña | JSON: `{ "currentPassword": "", "newPassword": "" }` | Mensaje de confirmación | ✅ |
| `/password-reset` | POST | Solicitar restablecimiento de contraseña | JSON: `{ "email": "" }` | Mensaje de confirmación | ✅ |
| `/password-reset/confirm` | POST | Confirmar restablecimiento de contraseña | JSON: `{ "token": "", "newPassword": "" }` | Mensaje de confirmación | ❌ |
| `/users` | GET | Listar usuarios (admin) | Query: `limit`, `page`, `role`, `profileType` | JSON con lista paginada de usuarios | ❌ |
| `/users/{id}` | GET | Obtener usuario por ID (admin) | ID en URL | JSON con datos del usuario | ❌ |
| `/users/{id}` | PUT | Actualizar usuario (admin) | JSON con campos a actualizar | JSON con usuario actualizado | ❌ |
| `/users/{id}` | DELETE | Desactivar usuario (admin) | ID en URL | Mensaje de confirmación | ❌ |

## Ciclos Menstruales

| Endpoint | Método | Descripción | Parámetros de Entrada | Respuesta | Implementado |
|----------|--------|-------------|----------------------|-----------|--------------|
| `/cycles/current` | GET | Obtener ciclo actual | - | JSON con datos del ciclo actual | ✅ |
| `/cycles/today` | GET | Obtener información del día actual | - | JSON con datos del día actual del ciclo | ✅ |
| `/cycles/recommendations` | GET | Obtener recomendaciones personalizadas | Query: `type` (opcional), `limit` (opcional, default=5) | JSON con recomendaciones basadas en la fase del ciclo | ✅ |
| `/cycles/calendar` | GET | Obtener calendario de ciclos | Query: `start` (fecha inicio), `end` (fecha fin) | JSON con días de ciclo en el rango especificado | ✅ |
| `/cycles/predict` | GET | Predecir próximo ciclo | - | JSON con predicción del próximo ciclo | ✅ |
| `/cycles/start-cycle` | POST | Iniciar nuevo ciclo | JSON: `{ "startDate": "" }` | JSON con datos del nuevo ciclo creado | ✅ |
| `/cycles` | GET | Listar todos los ciclos del usuario | Query: `limit`, `page`, `year`, `month` | JSON con lista de ciclos | ❌ |
| `/cycles/{id}` | GET | Obtener un ciclo específico | ID en URL | JSON con detalles del ciclo | ❌ |
| `/cycles/{id}` | PUT | Actualizar ciclo existente | JSON con campos a actualizar | JSON con ciclo actualizado | ❌ |
| `/cycles/{id}` | DELETE | Eliminar ciclo | ID en URL | Mensaje de confirmación | ❌ |
| `/cycles/end-cycle/{id}` | POST | Finalizar ciclo actual | JSON: `{ "endDate": "", "notes": "" }` | JSON con datos del ciclo finalizado | ❌ |
| `/cycles/statistics` | GET | Obtener estadísticas de ciclos | Query: `months` (período a analizar) | JSON con estadísticas de ciclos | ❌ |
| `/cycles/prediction-details` | GET | Obtener detalles de predicción avanzados | Query: `confidence_level` (opcional) | JSON con probabilidades diarias y factores que afectan la predicción | ❌ |
| `/cycles/sync-algorithm` | POST | Recalcular algoritmo de predicción | - | JSON con resumen de cambios en las predicciones | ❌ |

## Días del Ciclo

| Endpoint | Método | Descripción | Parámetros de Entrada | Respuesta | Implementado |
|----------|--------|-------------|----------------------|-----------|--------------|
| `/cycle-days` | GET | Listar días de ciclo | Query: `cycleId`, `startDate`, `endDate` | JSON con lista de días de ciclo | ❌ |
| `/cycle-days/{id}` | GET | Obtener día específico | ID en URL | JSON con detalles del día | ❌ |
| `/cycle-days` | POST | Registrar nuevo día de ciclo | JSON: `{ "cycleId": "", "date": "", "flow": "", "mood": "", "symptoms": [] }` | JSON con día creado | ❌ |
| `/cycle-days/{id}` | PUT | Actualizar día de ciclo | JSON con campos a actualizar | JSON con día actualizado | ❌ |
| `/cycle-days/{id}` | DELETE | Eliminar día de ciclo | ID en URL | Mensaje de confirmación | ❌ |
| `/cycle-days/date/{date}` | GET | Obtener día por fecha | Fecha en URL (YYYY-MM-DD) | JSON con detalles del día | ❌ |

## Síntomas

| Endpoint | Método | Descripción | Parámetros de Entrada | Respuesta | Implementado |
|----------|--------|-------------|----------------------|-----------|--------------|
| `/symptoms` | GET | Listar categorías de síntomas | - | JSON con lista de categorías de síntomas | ❌ |
| `/symptoms/log` | POST | Registrar síntoma | JSON: `{ "cycleDayId": "", "type": "", "intensity": "", "notes": "" }` | JSON con síntoma registrado | ❌ |
| `/symptoms/log/{id}` | PUT | Actualizar registro de síntoma | JSON con campos a actualizar | JSON con síntoma actualizado | ❌ |
| `/symptoms/log/{id}` | DELETE | Eliminar registro de síntoma | ID en URL | Mensaje de confirmación | ❌ |
| `/symptoms/day/{cycleDayId}` | GET | Obtener síntomas por día | ID del día en URL | JSON con síntomas del día | ❌ |
| `/symptoms/stats` | GET | Estadísticas de síntomas | Query: `months` (período a analizar) | JSON con estadísticas de síntomas | ❌ |

## Invitados y Accesos

| Endpoint | Método | Descripción | Parámetros de Entrada | Respuesta | Implementado |
|----------|--------|-------------|----------------------|-----------|--------------|
| `/guests` | GET | Listar accesos de invitados | - | JSON con lista de invitados con acceso | ✅ |
| `/guests` | POST | Crear nuevo acceso para invitado | JSON: `{ "guestId": "", "guestType": "", "accessTo": "", "expiresAt": "" }` | JSON con información del acceso creado | ✅ |
| `/guests/{id}` | DELETE | Revocar acceso de invitado | ID del acceso en URL | Mensaje de confirmación | ✅ |
| `/guests/{id}/modify` | PUT | Modificar acceso de invitado | JSON con campos a actualizar | JSON con acceso actualizado | ✅ |
| `/guests/invitations` | GET | Obtener invitaciones recibidas | - | JSON con lista de invitaciones | ✅ |
| `/guests/test-route` | GET | Ruta de prueba | - | Mensaje de prueba | ✅ |
| `/guests/{id}` | GET | Obtener detalle de un acceso específico | ID en URL | JSON con detalles del acceso | ❌ |
| `/guests/available-users` | GET | Listar usuarios disponibles para invitar | Query: `search` (opcional) | JSON con lista de usuarios | ❌ |
| `/guests/accept/{id}` | POST | Aceptar invitación | - | Mensaje de confirmación | ❌ |
| `/guests/decline/{id}` | POST | Rechazar invitación | - | Mensaje de confirmación | ❌ |

## Onboarding

| Endpoint | Método | Descripción | Parámetros de Entrada | Respuesta | Implementado |
|----------|--------|-------------|----------------------|-----------|--------------|
| `/onboarding` | POST | Completar proceso de onboarding | JSON con datos de onboarding completos | JSON con confirmación y datos de usuario actualizados | ✅ |
| `/onboarding` | GET | Obtener datos de onboarding | - | JSON con datos de onboarding actuales | ❌ |
| `/onboarding/steps` | GET | Obtener pasos de onboarding | - | JSON con pasos del proceso de onboarding | ❌ |
| `/onboarding/step/{step}` | POST | Completar paso específico de onboarding | JSON con datos del paso | JSON con confirmación | ❌ |

## Notificaciones

| Endpoint | Método | Descripción | Parámetros de Entrada | Respuesta | Implementado |
|----------|--------|-------------|----------------------|-----------|--------------|
| `/notifications` | GET | Listar notificaciones | Query: `type`, `context`, `limit`, `page`, `target` (opcionales) | JSON con notificaciones paginadas | ✅ |
| `/notifications/unread` | GET | Obtener notificaciones no leídas | Query: `type`, `context` (opcionales) | JSON con notificaciones no leídas | ✅ |
| `/notifications/high-priority` | GET | Obtener notificaciones de alta prioridad | - | JSON con notificaciones prioritarias | ✅ |
| `/notifications/{id}` | GET | Obtener una notificación específica | ID en URL | JSON con detalles de la notificación | ✅ |
| `/notifications/read/{id}` | POST | Marcar notificación como leída | ID en URL | Mensaje de confirmación | ✅ |
| `/notifications/read-all` | POST | Marcar todas como leídas | JSON: `{ "type": "", "context": "" }` (opcionales) | Mensaje de confirmación y contador | ✅ |
| `/notifications/dismiss/{id}` | POST | Descartar notificación | ID en URL | Mensaje de confirmación | ✅ |
| `/notifications/{id}` | DELETE | Eliminar notificación | ID en URL | Mensaje de confirmación | ✅ |
| `/notifications/by-related/{entityType}/{entityId}` | GET | Obtener notificaciones relacionadas con una entidad | `entityType` y `entityId` en URL | JSON con notificaciones relacionadas | ✅ |
| `/notifications/count` | GET | Contar notificaciones no leídas | - | JSON con contadores por tipo y contexto | ✅ |
| `/notifications/partner-test/{userId}` | POST | Crear notificación de prueba para pareja (admin) | `userId` en URL | JSON con datos de la notificación creada | ✅ |
| `/notifications` | POST | Crear nueva notificación (admin) | JSON: `{ "userId": "", "type": "", "title": "", "message": "", "priority": "" }` | JSON con notificación creada | ❌ |
| `/notifications/settings` | GET | Obtener preferencias de notificaciones | - | JSON con preferencias de notificaciones | ❌ |
| `/notifications/settings` | PUT | Actualizar preferencias de notificaciones | JSON con preferencias | JSON con preferencias actualizadas | ❌ |

## Condiciones Médicas

| Endpoint | Método | Descripción | Parámetros de Entrada | Respuesta | Implementado |
|----------|--------|-------------|----------------------|-----------|--------------|
| `/conditions` | GET | Listar condiciones médicas | - | JSON con lista de condiciones médicas | ✅ |
| `/conditions/{id}` | GET | Obtener condición específica | ID en URL | JSON con detalles de la condición | ✅ |
| `/conditions/user` | GET | Obtener condiciones del usuario | - | JSON con condiciones del usuario | ✅ |
| `/conditions/user/add` | POST | Añadir condición al usuario | JSON: `{ "conditionId": "", "startDate": "", "endDate": "", "notes": "" }` | JSON con condición añadida | ✅ |
| `/conditions/user/{id}` | PUT | Actualizar condición del usuario | JSON con campos a actualizar | JSON con condición actualizada | ✅ |
| `/conditions/user/{id}` | DELETE | Eliminar condición del usuario | ID en URL | Mensaje de confirmación | ✅ |
| `/conditions/user/active` | GET | Obtener condiciones activas del usuario | - | JSON con condiciones activas | ✅ |
| `/conditions/content/{id}` | GET | Obtener contenido relacionado con una condición | ID en URL | JSON con contenido relacionado | ✅ |
| `/conditions/notifications/{id}` | GET | Obtener notificaciones relacionadas con una condición | ID en URL | JSON con notificaciones relacionadas | ✅ |
| `/conditions` | POST | Crear nueva condición (admin) | JSON: `{ "name": "", "description": "", "symptoms": [], "recommendations": [] }` | JSON con condición creada | ❌ |
| `/conditions/{id}` | PUT | Actualizar condición (admin) | JSON con campos a actualizar | JSON con condición actualizada | ❌ |
| `/conditions/{id}` | DELETE | Eliminar condición (admin) | ID en URL | Mensaje de confirmación | ❌ |
| `/conditions/search` | GET | Buscar condiciones | Query: `query` | JSON con resultados de búsqueda | ❌ |
| `/conditions/categories` | GET | Listar categorías de condiciones | - | JSON con categorías | ❌ |

## Contenido

| Endpoint | Método | Descripción | Parámetros de Entrada | Respuesta | Implementado |
|----------|--------|-------------|----------------------|-----------|--------------|
| `/content` | GET | Listar contenido | Query: `type`, `phase`, `condition`, `limit` | JSON con lista de contenido | ✅ |
| `/content/{id}` | GET | Obtener contenido específico | ID en URL | JSON con detalles del contenido | ✅ |
| `/content/phase/{phase}` | GET | Obtener contenido por fase del ciclo | `phase` en URL, Query: `type`, `limit` | JSON con contenido para la fase | ✅ |
| `/content` | POST | Crear nuevo contenido (admin) | JSON: `{ "title": "", "description": "", "content": "", "type": "", "targetPhase": "", "tags": [], "imageUrl": "", "relatedConditions": [] }` | JSON con contenido creado | ✅ |
| `/content/{id}` | PUT | Actualizar contenido (admin) | JSON con campos a actualizar | JSON con contenido actualizado | ✅ |
| `/content/{id}` | DELETE | Eliminar contenido (admin) | ID en URL | Mensaje de confirmación | ✅ |
| `/content/search` | GET | Buscar contenido | Query: `query`, `type` | JSON con resultados de búsqueda | ❌ |
| `/content/favorites` | GET | Obtener contenido favorito | - | JSON con contenido favorito | ❌ |
| `/content/favorites/{id}` | POST | Añadir a favoritos | ID en URL | Mensaje de confirmación | ❌ |
| `/content/favorites/{id}` | DELETE | Eliminar de favoritos | ID en URL | Mensaje de confirmación | ❌ |
| `/content/popular` | GET | Obtener contenido popular | Query: `limit` | JSON con contenido popular | ❌ |
| `/content/related/{id}` | GET | Obtener contenido relacionado | ID en URL, Query: `limit` | JSON con contenido relacionado | ❌ |

## Insights

| Endpoint | Método | Descripción | Parámetros de Entrada | Respuesta | Implementado |
|----------|--------|-------------|----------------------|-----------|--------------|
| `/insights/summary` | GET | Obtener resumen de insights | - | JSON con resumen de ciclos | ✅ |
| `/insights/predictions` | GET | Obtener predicciones | - | JSON con predicciones | ✅ |
| `/insights/patterns` | GET | Obtener patrones de síntomas | - | JSON con patrones identificados | ✅ |
| `/insights/cycles` | GET | Obtener análisis de ciclos | Query: `months` (período a analizar) | JSON con análisis de ciclos | ❌ |
| `/insights/symptoms` | GET | Obtener análisis de síntomas | Query: `months` (período a analizar) | JSON con análisis de síntomas | ❌ |
| `/insights/hormone-levels` | GET | Obtener análisis de niveles hormonales | Query: `months` (período a analizar) | JSON con análisis de hormonas | ❌ |
| `/insights/trends` | GET | Obtener tendencias a largo plazo | Query: `years` (período a analizar) | JSON con tendencias | ❌ |
| `/insights/reports` | GET | Obtener informes generados | - | JSON con lista de informes | ❌ |
| `/insights/reports` | POST | Generar nuevo informe | JSON: `{ "type": "", "dateRange": { "start": "", "end": "" } }` | JSON con informe generado | ❌ |
| `/insights/reports/{id}` | GET | Obtener informe específico | ID en URL | JSON con detalles del informe | ❌ |
| `/insights/reports/{id}` | DELETE | Eliminar informe | ID en URL | Mensaje de confirmación | ❌ |

## Menopausia

| Endpoint | Método | Descripción | Parámetros de Entrada | Respuesta | Implementado |
|----------|--------|-------------|----------------------|-----------|--------------|
| `/menopause` | GET | Obtener registro de menopausia | - | JSON con registro de menopausia | ✅ |
| `/menopause` | POST | Crear/actualizar registro de menopausia | JSON: `{ "hotFlashes": "", "moodSwings": "", "vaginalDryness": "", "insomnia": "", "hormoneTherapy": "", "notes": "" }` | JSON con registro creado/actualizado | ✅ |
| `/menopause` | PUT | Actualizar registro de menopausia | JSON con campos a actualizar | JSON con registro actualizado | ✅ |
| `/menopause/info` | GET | Obtener información sobre menopausia | - | JSON con información educativa | ✅ |
| `/menopause/symptoms` | GET | Obtener manejo de síntomas | - | JSON con información sobre síntomas | ✅ |
| `/menopause/daily-log` | POST | Registrar diario de síntomas | JSON: `{ "date": "", "symptoms": [], "intensity": "", "notes": "" }` | JSON con registro diario creado | ❌ |
| `/menopause/daily-log/{date}` | GET | Obtener registro diario por fecha | Fecha en URL (YYYY-MM-DD) | JSON con registro del día | ❌ |
| `/menopause/daily-logs` | GET | Listar registros diarios | Query: `startDate`, `endDate`, `limit`, `page` | JSON con registros diarios | ❌ |
| `/menopause/daily-log/{id}` | PUT | Actualizar registro diario | JSON con campos a actualizar | JSON con registro actualizado | ❌ |
| `/menopause/daily-log/{id}` | DELETE | Eliminar registro diario | ID en URL | Mensaje de confirmación | ❌ |
| `/menopause/stats` | GET | Obtener estadísticas de síntomas | Query: `months` (período a analizar) | JSON con estadísticas | ❌ |
| `/menopause/treatments` | GET | Listar tratamientos | - | JSON con tratamientos disponibles | ❌ |
| `/menopause/treatments` | POST | Registrar tratamiento | JSON: `{ "type": "", "startDate": "", "endDate": "", "dosage": "", "notes": "" }` | JSON con tratamiento registrado | ❌ |

## Embarazo

| Endpoint | Método | Descripción | Parámetros de Entrada | Respuesta | Implementado |
|----------|--------|-------------|----------------------|-----------|--------------|
| `/pregnancy` | GET | Listar registros de embarazo | - | JSON con lista de embarazos | ✅ |
| `/pregnancy/{id}` | GET | Obtener registro específico | ID en URL | JSON con detalles del embarazo | ✅ |
| `/pregnancy` | POST | Crear nuevo registro de embarazo | JSON: `{ "startDate": "", "dueDate": "", "week": "", "symptoms": [], "fetalMovements": "", "ultrasoundDate": "", "notes": "" }` | JSON con registro creado | ✅ |
| `/pregnancy/{id}` | PUT | Actualizar registro de embarazo | JSON con campos a actualizar | JSON con registro actualizado | ✅ |
| `/pregnancy/{id}` | DELETE | Eliminar registro de embarazo | ID en URL | Mensaje de confirmación | ✅ |
| `/pregnancy/weekly/{week}` | GET | Obtener información semanal | `week` en URL (1-42) | JSON con información de la semana | ✅ |
| `/pregnancy/calculate-due-date` | POST | Calcular fecha probable de parto | JSON: `{ "lastPeriodDate": "" }` | JSON con cálculo | ✅ |
| `/pregnancy/daily-log` | POST | Registrar diario de embarazo | JSON: `{ "pregnancyId": "", "date": "", "symptoms": [], "fetalMovements": "", "notes": "" }` | JSON con registro diario creado | ❌ |
| `/pregnancy/daily-log/{date}` | GET | Obtener registro diario por fecha | Fecha en URL (YYYY-MM-DD) | JSON con registro del día | ❌ |
| `/pregnancy/daily-logs/{pregnancyId}` | GET | Listar registros diarios | `pregnancyId` en URL, Query: `startDate`, `endDate` | JSON con registros diarios | ❌ |
| `/pregnancy/checkups` | POST | Registrar control médico | JSON: `{ "pregnancyId": "", "date": "", "type": "", "results": "", "notes": "" }` | JSON con control registrado | ❌ |
| `/pregnancy/checkups/{pregnancyId}` | GET | Listar controles médicos | `pregnancyId` en URL | JSON con lista de controles | ❌ |
| `/pregnancy/checklist` | GET | Obtener checklist de embarazo | Query: `week` | JSON con checklist | ❌ |

## Niveles Hormonales

| Endpoint | Método | Descripción | Parámetros de Entrada | Respuesta | Implementado |
|----------|--------|-------------|----------------------|-----------|--------------|
| `/hormone-levels` | GET | Listar registros de niveles hormonales | Query: `startDate`, `endDate`, `type` | JSON con registros hormonales | ❌ |
| `/hormone-levels` | POST | Registrar nivel hormonal | JSON: `{ "date": "", "type": "", "value": "", "unit": "", "source": "", "notes": "" }` | JSON con registro creado | ❌ |
| `/hormone-levels/{id}` | GET | Obtener registro específico | ID en URL | JSON con detalles del registro | ❌ |
| `/hormone-levels/{id}` | PUT | Actualizar registro | JSON con campos a actualizar | JSON con registro actualizado | ❌ |
| `/hormone-levels/{id}` | DELETE | Eliminar registro | ID en URL | Mensaje de confirmación | ❌ |
| `/hormone-levels/types` | GET | Listar tipos de hormonas | - | JSON con tipos de hormonas | ❌ |
| `/hormone-levels/chart` | GET | Obtener datos para gráfico | Query: `startDate`, `endDate`, `type` | JSON con datos para visualización | ❌ |
| `/hormone-levels/reference` | GET | Obtener valores de referencia | Query: `type`, `age` | JSON con valores de referencia | ❌ |

## Consultas IA

| Endpoint | Método | Descripción | Parámetros de Entrada | Respuesta | Implementado |
|----------|--------|-------------|----------------------|-----------|--------------|
| `/ai/chat` | POST | Enviar consulta a IA | JSON: `{ "query": "", "context": "" }` | JSON con respuesta de IA | ❌ |
| `/ai/history` | GET | Obtener historial de consultas | Query: `limit`, `page` | JSON con historial de consultas | ❌ |
| `/ai/history/{id}` | GET | Obtener consulta específica | ID en URL | JSON con detalles de la consulta | ❌ |
| `/ai/suggestions` | GET | Obtener sugerencias de consultas | Query: `context` | JSON con sugerencias | ❌ |
| `/ai/feedback` | POST | Enviar feedback sobre respuesta | JSON: `{ "queryId": "", "helpful": true/false, "feedback": "" }` | Mensaje de confirmación | ❌ |

---

**Nota:** La mayoría de los endpoints requieren autenticación mediante JWT. Para utilizarlos, es necesario obtener un token a través del endpoint `/login_check` y enviarlo en las solicitudes posteriores, ya sea como cookie o en el encabezado de autorización.

**Leyenda:**
- ✅ Endpoint ya implementado
- ❌ Endpoint por implementar