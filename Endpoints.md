# 📋 EYRA Backend - Endpoints y Campos Requeridos

> **Proyecto:** EYRA - Aplicación de Seguimiento Menstrual  
> **Última actualización:** 22/05/2025  
> **Total Endpoints:** 87 | **Implementados:** 46 ✅ | **Pendientes:** 41 ❌

---

## 📊 **Resumen por Sección**

| Sección | Implementados | Pendientes | Total |
|---------|:-------------:|:----------:|:-----:|
| Autenticación y Perfil | 9 | 5 | 14 |
| Ciclos Menstruales | 12 | 0 | 12 |
| Días del Ciclo | 0 | 6 | 6 |
| Síntomas | 0 | 6 | 6 |
| Invitados y Accesos | 6 | 4 | 10 |
| Onboarding | 1 | 3 | 4 |
| Notificaciones | 10 | 3 | 13 |
| Condiciones Médicas | 9 | 5 | 14 |
| Contenido | 6 | 6 | 12 |
| Insights | 3 | 8 | 11 |
| Menopausia | 5 | 7 | 12 |
| Embarazo | 7 | 5 | 12 |
| Niveles Hormonales | 0 | 8 | 8 |
| Consultas IA | 0 | 5 | 5 |

---

## 🔐 **Autenticación y Perfil**

### ✅ **Implementados**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/login_check` | `POST` | `{"email": "String (email válido)", "password": "String"}` | Autenticar usuario | `{"message": "String", "user": {"id": "Integer", "email": "String", "username": "String", "name": "String", "lastName": "String", "roles": ["Array de String"], "profileType": "String", "birthDate": "String (YYYY-MM-DD)", "createdAt": "String (ISO 8601)", "updatedAt": "String (ISO 8601)", "state": "Boolean", "onboardingCompleted": "Boolean"}}` + cookie de sesión |
| `/register` | `POST` | `{"email": "String (email válido)","password": "String (mínimo 8 caracteres)","username": "String","name": "String","lastName": "String","birthDate": "String (YYYY-MM-DD)","profileType": "String (Enum: profile_women, profile_men, profile_nb, profile_transgender, profile_custom, profile_parent, profile_partner, profile_provider, profile_guest)"}` | Registrar nuevo usuario | `{"message": "String","user": {"id": "Integer","email": "String","username": "String"}}` |
| `/logout` | `POST` | - | Cerrar sesión actual | `{"message": "String"}` + eliminación de cookies |
| `/logout-all` | `POST` | - | Cerrar todas las sesiones | Mensaje de confirmación |
| `/profile` | `GET` | - | Obtener perfil del usuario | `{"user": {"id": "Integer", "email": "String", "username": "String", "name": "String", "lastName": "String", "roles": ["Array de String"], "profileType": "String", "birthDate": "String (YYYY-MM-DD)", "createdAt": "String (ISO 8601)", "updatedAt": "String (ISO 8601)", "state": "Boolean", "onboardingCompleted": "Boolean", "onboarding": {"completed": "Boolean"}}}` |
| `/profile` | `PUT` | `{"username": "String", "name": "String", "lastName": "String", "genderIdentity": "String", "birthDate": "String (YYYY-MM-DD)"}` | Actualizar perfil | `{"message": "String", "user": {"id": "Integer", "email": "String", "roles": ["Array de String"], "username": "String", "name": "String", "lastName": "String", "profileType": "String", "birthDate": "String (ISO 8601)", "createdAt": "String (ISO 8601)", "updatedAt": "String (ISO 8601)", "state": "Boolean", "onboardingCompleted": "Boolean", "onboarding": "Object o null"}}` |
| `/password-change` | `POST` | `{"currentPassword": "String", "newPassword": "String"}` | Cambiar contraseña | `{"message": "String"}` |
| `/password-reset` | `POST` | `{"email": "String (email válido)"}` | Solicitar restablecimiento | `{"message": "String"}` |

### ❌ **Pendientes**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/password-reset/confirm` | `POST` | `{"token": "", "newPassword": ""}` | Confirmar restablecimiento | Mensaje de confirmación |
| `/users` | `GET` | Query: `limit, page, role, profileType` | Listar usuarios (admin) | JSON con lista paginada de usuarios |
| `/users/{id}` | `GET` | ID en URL | Obtener usuario por ID (admin) | JSON con datos del usuario |
| `/users/{id}` | `PUT` | JSON con campos a actualizar | Actualizar usuario (admin) | JSON con usuario actualizado |
| `/users/{id}` | `DELETE` | ID en URL | Desactivar usuario (admin) | Mensaje de confirmación |

---

## 🔄 **Ciclos Menstruales**

### ✅ **Implementados**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/cycles/current` | `GET` | - | Obtener ciclo actual | `{"id": "Integer", "user": "String (IRI)", "startDate": "String (ISO 8601)", "endDate": "String (ISO 8601)", "estimatedNextStart": "String (ISO 8601)", "averageCycleLength": "Integer", "averageDuration": "Integer", "flowAmount": "String o null", "flowColor": "String o null", "flowOdor": "String o null", "painLevel": "Integer o null", "notes": "String o null", "cycleDays": [{"id": "Integer", "date": "String (ISO 8601)", "dayNumber": "Integer", "phase": "String (menstrual/folicular/ovulacion/lutea)"}]}` |
| `/cycles/today` | `GET` | - | Información del día actual | `{"id": "Integer", "date": "String (ISO 8601)", "dayNumber": "Integer", "phase": "String", "symptoms": ["Array"], "notes": ["Array"], "mood": ["Array"], "flowIntensity": "String o null", "hormoneLevels": ["Array"]}` |
| `/cycles/recommendations` | `GET` | Query: `type?` (String), `limit?` (Integer) | Recomendaciones personalizadas | `{"success": "Boolean", "currentPhase": "String", "cycleDay": "Integer", "recommendations": ["Array"]}` |
| `/cycles/calendar` | `GET` | Query: `start` (YYYY-MM-DD), `end` (YYYY-MM-DD) | Calendario de ciclos | `[{"id": "Integer", "date": "String (ISO 8601)", "dayNumber": "Integer", "phase": "String", "symptoms": ["Array"], "notes": ["Array"], "mood": ["Array"], "flowIntensity": "String o null", "hormoneLevels": ["Array"]}]` |
| `/cycles/predict` | `GET` | - | Predecir próximo ciclo | JSON con predicción del próximo ciclo |
| `/cycles/statistics` | `GET` | Query: `months` (Integer) | Estadísticas de ciclos | `{"cyclesAnalyzed": "Integer", "averageCycleLength": "Integer", "averagePeriodLength": "Integer", "longestCycle": {"id": "Integer", "startDate": "String (YYYY-MM-DD)", "length": "Integer"}, "shortestCycle": {"id": "Integer", "startDate": "String (YYYY-MM-DD)", "length": "Integer"}, "regularity": "Integer", "cycleLengthVariation": "Integer", "monthsAnalyzed": "Integer", "cyclesByMonth": [{"year": "Integer", "month": "Integer", "count": "Integer"}]}` |
| `/cycles/start-cycle` | `POST` | `{"startDate": "String (YYYY-MM-DD)"}` | Iniciar nuevo ciclo | `{"id": "Integer", "user": "String (IRI)", "startDate": "String (ISO 8601)", "endDate": "String (ISO 8601)", "estimatedNextStart": "String (ISO 8601)", "averageCycleLength": "Integer", "averageDuration": "Integer", "flowAmount": "String o null", "flowColor": "String o null", "flowOdor": "String o null", "painLevel": "Integer o null", "notes": "String o null", "cycleDays": []}` |
| `/cycles` | `GET` | Query: `limit?`, `page?`, `year?`, `month?` | Listar todos los ciclos | `{"cycles": [{"id": "Integer", "user": "String (IRI)", "startDate": "String (ISO 8601)", "endDate": "String (ISO 8601)", "estimatedNextStart": "String (ISO 8601)", "averageCycleLength": "Integer", "averageDuration": "Integer", "flowAmount": "String o null", "flowColor": "String o null", "flowOdor": "String o null", "painLevel": "Integer o null", "notes": "String o null", "cycleDays": [{"id": "Integer", "date": "String (ISO 8601)", "dayNumber": "Integer", "phase": "String"}]}], "pagination": {"total": "Integer", "page": "Integer", "limit": "Integer", "totalPages": "Integer"}}` |
| `/cycles/{id}` | `GET` | ID en URL | Obtener ciclo específico | `{"id": "Integer", "user": "String (IRI)", "startDate": "String (ISO 8601)", "endDate": "String (ISO 8601)", "estimatedNextStart": "String (ISO 8601)", "averageCycleLength": "Integer", "averageDuration": "Integer", "flowAmount": "String o null", "flowColor": "String o null", "flowOdor": "String o null", "painLevel": "Integer o null", "notes": "String o null", "cycleDays": [{"id": "Integer", "date": "String (ISO 8601)", "dayNumber": "Integer", "phase": "String (menstrual/folicular/ovulacion/lutea)"}]}` |
| `/cycles/{id}` | `PUT` | `{"endDate": "String (YYYY-MM-DD)", "averageCycleLength": "Integer", "averageDuration": "Integer", "flowAmount": "String (light/medium/heavy)", "flowColor": "String", "flowOdor": "String", "painLevel": "Integer (1-5)", "notes": "String"}` | Actualizar ciclo | `{"id": "Integer", "user": "String (IRI)", "startDate": "String (ISO 8601)", "endDate": "String (ISO 8601)", "estimatedNextStart": "String (ISO 8601)", "averageCycleLength": "Integer", "averageDuration": "Integer", "flowAmount": "String", "flowColor": "String", "flowOdor": "String", "painLevel": "Integer", "notes": "String", "cycleDays": [{"id": "Integer", "date": "String (ISO 8601)", "dayNumber": "Integer", "phase": "String"}]}` |
| `/cycles/{id}` | `DELETE` | ID en URL | Eliminar ciclo | `{"message": "String"}` |
| `/cycles/end-cycle/{id}` | `POST` | `{"endDate": "String (YYYY-MM-DD)", "notes": "String"}` | Finalizar ciclo | `{"id": "Integer", "user": "String (IRI)", "startDate": "String (ISO 8601)", "endDate": "String (ISO 8601)", "estimatedNextStart": "String (ISO 8601)", "averageCycleLength": "Integer", "averageDuration": "Integer", "flowAmount": "String o null", "flowColor": "String o null", "flowOdor": "String o null", "painLevel": "Integer o null", "notes": "String", "cycleDays": [{"id": "Integer", "date": "String (ISO 8601)", "dayNumber": "Integer", "phase": "String"}]}` |

---

## 📅 **Días del Ciclo**

### ❌ **Todos Pendientes**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/cycle-days` | `GET` | Query: `cycleId, startDate, endDate` | Listar días de ciclo | JSON con lista de días de ciclo |
| `/cycle-days/{id}` | `GET` | ID en URL | Obtener día específico | JSON con detalles del día |
| `/cycle-days` | `POST` | `{"cycleId": "", "date": "", "flow": "", "mood": "", "symptoms": []}` | Registrar nuevo día | JSON con día creado |
| `/cycle-days/{id}` | `PUT` | JSON con campos a actualizar | Actualizar día de ciclo | JSON con día actualizado |
| `/cycle-days/{id}` | `DELETE` | ID en URL | Eliminar día de ciclo | Mensaje de confirmación |
| `/cycle-days/date/{date}` | `GET` | Fecha en URL (YYYY-MM-DD) | Obtener día por fecha | JSON con detalles del día |

---

## 🩺 **Síntomas**

### ❌ **Todos Pendientes**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/symptoms` | `GET` | - | Listar categorías síntomas | JSON con lista de categorías de síntomas |
| `/symptoms/log` | `POST` | `{"cycleDayId": "", "type": "", "intensity": "", "notes": ""}` | Registrar síntoma | JSON con síntoma registrado |
| `/symptoms/log/{id}` | `PUT` | JSON con campos a actualizar | Actualizar síntoma | JSON con síntoma actualizado |
| `/symptoms/log/{id}` | `DELETE` | ID en URL | Eliminar síntoma | Mensaje de confirmación |
| `/symptoms/day/{cycleDayId}` | `GET` | ID del día en URL | Síntomas por día | JSON con síntomas del día |
| `/symptoms/stats` | `GET` | Query: `months` | Estadísticas síntomas | JSON con estadísticas de síntomas |

---

## 👥 **Invitados y Accesos**

### ✅ **Implementados**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/guests` | `GET` | - | Listar accesos invitados | JSON con lista de invitados con acceso |
| `/guests` | `POST` | `{"guestId": "", "guestType": "", "accessTo": "", "expiresAt": ""}` | Crear acceso invitado | JSON con información del acceso creado |
| `/guests/{id}` | `DELETE` | ID en URL | Revocar acceso | Mensaje de confirmación |
| `/guests/{id}/modify` | `PUT` | JSON con campos a actualizar | Modificar acceso | JSON con acceso actualizado |
| `/guests/invitations` | `GET` | - | Invitaciones recibidas | JSON con lista de invitaciones |
| `/guests/test-route` | `GET` | - | Ruta de prueba | Mensaje de prueba |

### ❌ **Pendientes**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/guests/{id}` | `GET` | ID en URL | Detalle acceso específico | JSON con detalles del acceso |
| `/guests/available-users` | `GET` | Query: `search?` | Usuarios disponibles | JSON con lista de usuarios |
| `/guests/accept/{id}` | `POST` | - | Aceptar invitación | Mensaje de confirmación |
| `/guests/decline/{id}` | `POST` | - | Rechazar invitación | Mensaje de confirmación |

---

## 🎯 **Onboarding**

### ✅ **Implementados**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/onboarding` | `POST` | `{"isPersonal": "Boolean (String)", "profileType": "String (Enum)", "genderIdentity": "String", "pronouns": "String", "stageOfLife": "String", "lastPeriodDate": "String (YYYY-MM-DD)", "averageCycleLength": "Integer", "averagePeriodLength": "Integer", "receiveAlerts": "Boolean", "receiveRecommendations": "Boolean", "receiveCyclePhaseTips": "Boolean", "receiveWorkoutSuggestions": "Boolean", "receiveNutritionAdvice": "Boolean", "shareCycleWithPartner": "Boolean", "wantAiCompanion": "Boolean", "healthConcerns": ["Array de String"], "accessCode": "String", "allowParentalMonitoring": "Boolean", "commonSymptoms": ["Array de String"], "completed": "Boolean"}` | Completar onboarding | `{"message": "String", "user": {"id": "Integer", "email": "String", "onboardingCompleted": "Boolean"}, "onboarding": {"id": "Integer", "profileType": "String", "stageOfLife": "String", "lastPeriodDate": "String (YYYY-MM-DD)", "averageCycleLength": "Integer", "averagePeriodLength": "Integer", "completed": "Boolean"}, "additionalData": {"menstrualCycleCreated": "Boolean", "conditionsRegistered": ["Array de String"], "symptomsRegistered": ["Array de String"]}}` |

### ❌ **Pendientes**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/onboarding` | `GET` | - | Obtener datos onboarding | JSON con datos de onboarding actuales |
| `/onboarding/steps` | `GET` | - | Obtener pasos proceso | JSON con pasos del proceso de onboarding |
| `/onboarding/step/{step}` | `POST` | JSON con datos del paso | Completar paso específico | JSON con confirmación |

---

## 🔔 **Notificaciones**

### ✅ **Implementados**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/notifications` | `GET` | Query: `type?, context?, limit?, page?, target?` | Listar notificaciones | JSON con notificaciones paginadas |
| `/notifications/unread` | `GET` | Query: `type?, context?` | Notificaciones no leídas | JSON con notificaciones no leídas |
| `/notifications/high-priority` | `GET` | - | Notificaciones prioritarias | JSON con notificaciones prioritarias |
| `/notifications/{id}` | `GET` | ID en URL | Notificación específica | JSON con detalles de la notificación |
| `/notifications/read/{id}` | `POST` | ID en URL | Marcar como leída | Mensaje de confirmación |
| `/notifications/read-all` | `POST` | `{"type": "", "context": ""}` (opcionales) | Marcar todas leídas | Mensaje de confirmación y contador |
| `/notifications/dismiss/{id}` | `POST` | ID en URL | Descartar notificación | Mensaje de confirmación |
| `/notifications/{id}` | `DELETE` | ID en URL | Eliminar notificación | Mensaje de confirmación |
| `/notifications/by-related/{entityType}/{entityId}` | `GET` | entityType y entityId en URL | Por entidad relacionada | JSON con notificaciones relacionadas |
| `/notifications/count` | `GET` | - | Contar no leídas | JSON con contadores por tipo y contexto |
| `/notifications/partner-test/{userId}` | `POST` | userId en URL | Prueba para pareja | JSON con datos de la notificación creada |

### ❌ **Pendientes**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/notifications` | `POST` | `{"userId": "", "type": "", "title": "", "message": "", "priority": ""}` | Crear notificación | JSON con notificación creada |
| `/notifications/settings` | `GET` | - | Preferencias notificaciones | JSON con preferencias de notificaciones |
| `/notifications/settings` | `PUT` | JSON con preferencias | Actualizar preferencias | JSON con preferencias actualizadas |

---

## 🏥 **Condiciones Médicas**

### ✅ **Implementados**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/conditions` | `GET` | - | Listar condiciones | JSON con lista de condiciones médicas |
| `/conditions/{id}` | `GET` | ID en URL | Condición específica | JSON con detalles de la condición |
| `/conditions/user` | `GET` | - | Condiciones del usuario | JSON con condiciones del usuario |
| `/conditions/user/add` | `POST` | `{"conditionId": "", "startDate": "", "endDate": "", "notes": ""}` | Añadir al usuario | JSON con condición añadida |
| `/conditions/user/{id}` | `PUT` | JSON con campos a actualizar | Actualizar condición usuario | JSON con condición actualizada |
| `/conditions/user/{id}` | `DELETE` | ID en URL | Eliminar condición usuario | Mensaje de confirmación |
| `/conditions/user/active` | `GET` | - | Condiciones activas | JSON con condiciones activas |
| `/conditions/content/{id}` | `GET` | ID en URL | Contenido relacionado | JSON con contenido relacionado |
| `/conditions/notifications/{id}` | `GET` | ID en URL | Notificaciones relacionadas | JSON con notificaciones relacionadas |

### ❌ **Pendientes**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/conditions` | `POST` | `{"name": "", "description": "", "symptoms": [], "recommendations": []}` | Crear condición (admin) | JSON con condición creada |
| `/conditions/{id}` | `PUT` | JSON con campos a actualizar | Actualizar (admin) | JSON con condición actualizada |
| `/conditions/{id}` | `DELETE` | ID en URL | Eliminar (admin) | Mensaje de confirmación |
| `/conditions/search` | `GET` | Query: `query` | Buscar condiciones | JSON con resultados de búsqueda |
| `/conditions/categories` | `GET` | - | Categorías condiciones | JSON con categorías |

---

## 📖 **Contenido**

### ✅ **Implementados**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/content` | `GET` | Query: `type?, phase?, condition?, limit?` | Listar contenido | JSON con lista de contenido |
| `/content/{id}` | `GET` | ID en URL | Contenido específico | JSON con detalles del contenido |
| `/content/phase/{phase}` | `GET` | phase en URL, Query: `type?, limit?` | Por fase del ciclo | JSON con contenido para la fase |
| `/content` | `POST` | `{"title": "", "description": "", "content": "", "type": "", "targetPhase": "", "tags": [], "imageUrl": "", "relatedConditions": []}` | Crear contenido (admin) | JSON con contenido creado |
| `/content/{id}` | `PUT` | JSON con campos a actualizar | Actualizar (admin) | JSON con contenido actualizado |
| `/content/{id}` | `DELETE` | ID en URL | Eliminar (admin) | Mensaje de confirmación |

### ❌ **Pendientes**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/content/search` | `GET` | Query: `query, type?` | Buscar contenido | JSON con resultados de búsqueda |
| `/content/favorites` | `GET` | - | Contenido favorito | JSON con contenido favorito |
| `/content/favorites/{id}` | `POST` | ID en URL | Añadir a favoritos | Mensaje de confirmación |
| `/content/favorites/{id}` | `DELETE` | ID en URL | Quitar de favoritos | Mensaje de confirmación |
| `/content/popular` | `GET` | Query: `limit?` | Contenido popular | JSON con contenido popular |
| `/content/related/{id}` | `GET` | ID en URL, Query: `limit?` | Contenido relacionado | JSON con contenido relacionado |

---

## 📊 **Insights**

### ✅ **Implementados**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/insights/summary` | `GET` | - | Resumen de insights | JSON con resumen de ciclos |
| `/insights/predictions` | `GET` | - | Predicciones | JSON con predicciones |
| `/insights/patterns` | `GET` | - | Patrones de síntomas | JSON con patrones identificados |

### ❌ **Pendientes**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/insights/cycles` | `GET` | Query: `months` | Análisis de ciclos | JSON con análisis de ciclos |
| `/insights/symptoms` | `GET` | Query: `months` | Análisis de síntomas | JSON con análisis de síntomas |
| `/insights/hormone-levels` | `GET` | Query: `months` | Análisis hormonal | JSON con análisis de hormonas |
| `/insights/trends` | `GET` | Query: `years` | Tendencias largo plazo | JSON con tendencias |
| `/insights/reports` | `GET` | - | Informes generados | JSON con lista de informes |
| `/insights/reports` | `POST` | `{"type": "", "dateRange": {"start": "", "end": ""}}` | Generar informe | JSON con informe generado |
| `/insights/reports/{id}` | `GET` | ID en URL | Informe específico | JSON con detalles del informe |
| `/insights/reports/{id}` | `DELETE` | ID en URL | Eliminar informe | Mensaje de confirmación |

---

## 🌸 **Menopausia**

### ✅ **Implementados**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/menopause` | `GET` | - | Registro menopausia | JSON con registro de menopausia |
| `/menopause` | `POST` | `{"hotFlashes": "", "moodSwings": "", "vaginalDryness": "", "insomnia": "", "hormoneTherapy": "", "notes": ""}` | Crear/actualizar registro | JSON con registro creado/actualizado |
| `/menopause` | `PUT` | JSON con campos a actualizar | Actualizar registro | JSON con registro actualizado |
| `/menopause/info` | `GET` | - | Información educativa | JSON con información educativa |
| `/menopause/symptoms` | `GET` | - | Manejo de síntomas | JSON con información sobre síntomas |

### ❌ **Pendientes**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/menopause/daily-log` | `POST` | `{"date": "", "symptoms": [], "intensity": "", "notes": ""}` | Diario de síntomas | JSON con registro diario creado |
| `/menopause/daily-log/{date}` | `GET` | Fecha en URL (YYYY-MM-DD) | Registro por fecha | JSON con registro del día |
| `/menopause/daily-logs` | `GET` | Query: `startDate?, endDate?, limit?, page?` | Listar registros diarios | JSON con registros diarios |
| `/menopause/daily-log/{id}` | `PUT` | JSON con campos a actualizar | Actualizar registro diario | JSON con registro actualizado |
| `/menopause/daily-log/{id}` | `DELETE` | ID en URL | Eliminar registro diario | Mensaje de confirmación |
| `/menopause/stats` | `GET` | Query: `months` | Estadísticas síntomas | JSON con estadísticas |
| `/menopause/treatments` | `GET` | - | Tratamientos disponibles | JSON con tratamientos disponibles |
| `/menopause/treatments` | `POST` | `{"type": "", "startDate": "", "endDate": "", "dosage": "", "notes": ""}` | Registrar tratamiento | JSON con tratamiento registrado |

---

## 🤱 **Embarazo**

### ✅ **Implementados**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/pregnancy` | `GET` | - | Listar embarazos | JSON con lista de embarazos |
| `/pregnancy/{id}` | `GET` | ID en URL | Embarazo específico | JSON con detalles del embarazo |
| `/pregnancy` | `POST` | `{"startDate": "", "dueDate": "", "week": "", "symptoms": [], "fetalMovements": "", "ultrasoundDate": "", "notes": ""}` | Crear registro | JSON con registro creado |
| `/pregnancy/{id}` | `PUT` | JSON con campos a actualizar | Actualizar registro | JSON con registro actualizado |
| `/pregnancy/{id}` | `DELETE` | ID en URL | Eliminar registro | Mensaje de confirmación |
| `/pregnancy/weekly/{week}` | `GET` | week en URL (1-42) | Información semanal | JSON con información de la semana |
| `/pregnancy/calculate-due-date` | `POST` | `{"lastPeriodDate": ""}` | Calcular fecha parto | JSON con cálculo |

### ❌ **Pendientes**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/pregnancy/daily-log` | `POST` | `{"pregnancyId": "", "date": "", "symptoms": [], "fetalMovements": "", "notes": ""}` | Diario embarazo | JSON con registro diario creado |
| `/pregnancy/daily-log/{date}` | `GET` | Fecha en URL (YYYY-MM-DD) | Registro por fecha | JSON con registro del día |
| `/pregnancy/daily-logs/{pregnancyId}` | `GET` | pregnancyId en URL, Query: `startDate?, endDate?` | Listar registros diarios | JSON con registros diarios |
| `/pregnancy/checkups` | `POST` | `{"pregnancyId": "", "date": "", "type": "", "results": "", "notes": ""}` | Control médico | JSON con control registrado |
| `/pregnancy/checkups/{pregnancyId}` | `GET` | pregnancyId en URL | Listar controles | JSON con lista de controles |
| `/pregnancy/checklist` | `GET` | Query: `week?` | Checklist embarazo | JSON con checklist |

---

## 🧬 **Niveles Hormonales**

### ❌ **Todos Pendientes**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/hormone-levels` | `GET` | Query: `startDate?, endDate?, type?` | Listar registros | JSON con registros hormonales |
| `/hormone-levels` | `POST` | `{"date": "", "type": "", "value": "", "unit": "", "source": "", "notes": ""}` | Registrar nivel | JSON con registro creado |
| `/hormone-levels/{id}` | `GET` | ID en URL | Registro específico | JSON con detalles del registro |
| `/hormone-levels/{id}` | `PUT` | JSON con campos a actualizar | Actualizar registro | JSON con registro actualizado |
| `/hormone-levels/{id}` | `DELETE` | ID en URL | Eliminar registro | Mensaje de confirmación |
| `/hormone-levels/types` | `GET` | - | Tipos de hormonas | JSON con tipos de hormonas |
| `/hormone-levels/chart` | `GET` | Query: `startDate?, endDate?, type?` | Datos para gráfico | JSON con datos para visualización |
| `/hormone-levels/reference` | `GET` | Query: `type?, age?` | Valores de referencia | JSON con valores de referencia |

---

## 🤖 **Consultas IA**

### ❌ **Todos Pendientes**

| Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|----------|--------|-------------------|-------------|----------|
| `/ai/chat` | `POST` | `{"query": "", "context": ""}` | Consulta a IA | JSON con respuesta de IA |
| `/ai/history` | `GET` | Query: `limit?, page?` | Historial consultas | JSON con historial de consultas |
| `/ai/history/{id}` | `GET` | ID en URL | Consulta específica | JSON con detalles de la consulta |
| `/ai/suggestions` | `GET` | Query: `context?` | Sugerencias consultas | JSON con sugerencias |
| `/ai/feedback` | `POST` | `{"queryId": "", "helpful": true/false, "feedback": ""}` | Feedback respuesta | Mensaje de confirmación |

---

## 📝 **Notas Importantes**

### 🔒 **Autenticación**
- Todos los endpoints requieren autenticación JWT excepto:
  - `/login_check`
  - `/register` 
  - `/password-reset`

### 👑 **Permisos Admin**
Los siguientes endpoints requieren `ROLE_ADMIN`:
- `/users/*` (gestión de usuarios)
- `/conditions` (POST, PUT, DELETE)
- `/content` (POST, PUT, DELETE)
- `/notifications` (POST para crear)

### 📅 **Formatos de Fecha**
- Todas las fechas siguen formato ISO 8601: `YYYY-MM-DD`
- Los timestamps incluyen hora: `YYYY-MM-DDTHH:mm:ss`

### ❓ **Parámetros Opcionales**
- Los campos marcados con `?` son opcionales
- Los parámetros de query van después de `?` en la URL
- Ejemplo: `/content?type=recipe&limit=10`

### 🏷️ **Estados de Respuesta HTTP**
- `200` - Éxito
- `201` - Creado
- `400` - Error de validación
- `401` - No autenticado
- `403` - Sin permisos
- `404` - No encontrado
- `500` - Error del servidor
