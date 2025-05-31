# 📋 EYRA Backend - Endpoints y Campos Requeridos

> **Proyecto:** EYRA - Aplicación de Seguimiento Menstrual  
> **Última actualización:** 31/05/2025  
> **Total Endpoints:** 106 | **Implementados:** 79 ✅ | **Pendientes:** 27 ❌

---

## 📊 **Resumen por Sección**

| Sección | Implementados | Pendientes | Total |
|---------|:-------------:|:----------:|:-----:|
| Autenticación y Perfil | 14 | 0 | 14 |
| Ciclos Menstruales | 14 | 0 | 14 |
| Días del Ciclo | 6 | 0 | 6 |
| Síntomas | 0 | 6 | 6 |
| Invitados y Accesos | 20 | 4 | 24 |
| Onboarding | 2 | 0 | 2 |
| Notificaciones | 10 | 3 | 13 |
| Condiciones Médicas | 14 | 0 | 14 |
| Contenido | 6 | 6 | 12 |
| Insights | 3 | 8 | 11 |
| Menopausia | 5 | 7 | 12 |
| Embarazo | 7 | 5 | 12 |
| Niveles Hormonales | 0 | 8 | 8 |
| Consultas IA | 0 | 5 | 5 |

---

## 🔐 **Autenticación y Perfil**

### ✅ **Implementados**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
|     ✅     | `/login_check` | `POST` | `{"email": "String (email válido)", "password": "String"}` | Autenticar usuario | `{"message": "String", "user": {"id": "Integer", "email": "String", "username": "String", "name": "String", "lastName": "String", "roles": ["Array de String"], "profileType": "String", "birthDate": "String (YYYY-MM-DD)", "createdAt": "String (ISO 8601)", "updatedAt": "String (ISO 8601)", "state": "Boolean", "onboardingCompleted": "Boolean"}}` + cookie de sesión |
|          | `/register` | `POST` | `{"email": "String (email válido)","password": "String (mínimo 8 caracteres)","username": "String","name": "String","lastName": "String","birthDate": "String (YYYY-MM-DD)","profileType": "String (Enum: profile_women, profile_men, profile_nb, profile_transgender, profile_custom, profile_parent, profile_partner, profile_provider, profile_guest)", "avatar": {"skinColor": "String", "eyes": "String", "eyebrows": "String", "mouth": "String", "hairStyle": "String", "hairColor": "String", "facialHair": "String", "clothes": "String", "fabricColor": "String", "glasses": "String", "glassOpacity": "String", "accessories": "String", "tattoos": "String", "backgroundColor": "String"}}` | Registrar nuevo usuario | `{"message": "String","user": {"id": "Integer","email": "String","username": "String", "avatar": {"skinColor": "String", "eyes": "String", "eyebrows": "String", "mouth": "String", "hairStyle": "String", "hairColor": "String", "facialHair": "String", "clothes": "String", "fabricColor": "String", "glasses": "String", "glassOpacity": "String", "accessories": "String", "tattoos": "String", "backgroundColor": "String"}}}` |
|     ✅     | `/logout` | `POST` | - | Cerrar sesión actual | `{"message": "String"}` + eliminación de cookies |
|     ✅     | `/logout-all` | `POST` | - | Cerrar todas las sesiones | Mensaje de confirmación |
|    ✅      | `/profile` | `GET` | - | Obtener perfil del usuario | `{"user": {"id": "Integer", "email": "String", "username": "String", "name": "String", "lastName": "String", "roles": ["Array de String"], "profileType": "String", "birthDate": "String (YYYY-MM-DD)", "createdAt": "String (ISO 8601)", "updatedAt": "String (ISO 8601)", "state": "Boolean", "onboardingCompleted": "Boolean", "onboarding": {"completed": "Boolean"}, "avatar": {"skinColor": "String", "eyes": "String", "eyebrows": "String", "mouth": "String", "hairStyle": "String", "hairColor": "String", "facialHair": "String", "clothes": "String", "fabricColor": "String", "glasses": "String", "glassOpacity": "String", "accessories": "String", "tattoos": "String", "backgroundColor": "String"}}}` |
|    ✅      | `/profile` | `PUT` | `{"username": "String", "name": "String", "lastName": "String", "genderIdentity": "String", "birthDate": "String (YYYY-MM-DD)", "avatar": {"skinColor": "String", "eyes": "String", "eyebrows": "String", "mouth": "String", "hairStyle": "String", "hairColor": "String", "facialHair": "String", "clothes": "String", "fabricColor": "String", "glasses": "String", "glassOpacity": "String", "accessories": "String", "tattoos": "String", "backgroundColor": "String"}}` | Actualizar perfil | `{"message": "String", "user": {"id": "Integer", "email": "String", "roles": ["Array de String"], "username": "String", "name": "String", "lastName": "String", "profileType": "String", "birthDate": "String (ISO 8601)", "createdAt": "String (ISO 8601)", "updatedAt": "String (ISO 8601)", "state": "Boolean", "onboardingCompleted": "Boolean", "onboarding": "Object o null", "avatar": "Object"}}` |
|    ✅      | `/password-change` | `POST` | `{"currentPassword": "String", "newPassword": "String"}` | Cambiar contraseña | `{"message": "String"}` |
|     ✅     | `/password-reset` | `POST` | `{"email": "String (email válido)"}` | Solicitar restablecimiento | `{"message": "String"}` |
|     ✅     | `/password-reset/confirm` | `POST` | `{"token": "String", "newPassword": "String (mínimo 6 caracteres)"}` | Confirmar restablecimiento | `{"message": "String"}` |
|     ✅     | `/api/admin/users` | `GET` | Query: `limit?, page?, role?, profileType?, search?` | Listar usuarios (admin) | `{"users": [{"id": "Integer", "email": "String", "username": "String", "name": "String", "lastName": "String", "roles": ["Array de String"], "profileType": "String", "birthDate": "String (YYYY-MM-DD)", "createdAt": "String (ISO 8601)", "updatedAt": "String (ISO 8601)", "state": "Boolean", "onboardingCompleted": "Boolean", "avatar": "Object"}], "pagination": {"page": "Integer", "limit": "Integer", "total": "Integer", "totalPages": "Integer"}}` |
|     ✅     | `/api/admin/users/{id}` | `GET` | ID en URL | Obtener usuario por ID (admin) | `{"user": {"id": "Integer", "email": "String", "username": "String", "name": "String", "lastName": "String", "roles": ["Array de String"], "profileType": "String", "birthDate": "String (YYYY-MM-DD)", "createdAt": "String (ISO 8601)", "updatedAt": "String (ISO 8601)", "state": "Boolean", "onboardingCompleted": "Boolean", "avatar": "Object", "onboarding": {"id": "Integer", "profileType": "String", "stageOfLife": "String", "lastPeriodDate": "String (YYYY-MM-DD)", "averageCycleLength": "Integer", "averagePeriodLength": "Integer", "completed": "Boolean"}}}` |
|     ✅     | `/api/admin/users/{id}` | `PUT` | `{"email": "String", "username": "String", "name": "String", "lastName": "String", "profileType": "String", "birthDate": "String (YYYY-MM-DD)", "roles": ["Array de String"], "state": "Boolean", "onboardingCompleted": "Boolean", "password": "String (opcional)", "avatar": "Object (opcional)"}` | Actualizar usuario (admin) | `{"message": "String", "user": {"id": "Integer", "email": "String", "username": "String", "name": "String", "lastName": "String", "roles": ["Array de String"], "profileType": "String", "birthDate": "String (YYYY-MM-DD)", "createdAt": "String (ISO 8601)", "updatedAt": "String (ISO 8601)", "state": "Boolean", "onboardingCompleted": "Boolean", "avatar": "Object"}}` |
|     ✅     | `/api/admin/users/{id}` | `DELETE` | ID en URL | Desactivar usuario (admin) | `{"message": "String"}` |

### ❌ **Pendientes**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
| *Todos implementados* | | | | | |

---

## 🔄 **Ciclos Menstruales**

### ✅ **Implementados**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
|          | `/cycles/current` | `GET` | - | Obtener ciclo actual | `{"id": "Integer", "user": "String (IRI)", "phase": "String (menstrual/folicular/ovulacion/lutea)", "cycleId": "String (UUID)", "startDate": "String (ISO 8601)", "endDate": "String (ISO 8601)", "estimatedNextStart": "String (ISO 8601)", "averageCycleLength": "Integer", "averageDuration": "Integer", "flowAmount": "String o null", "flowColor": "String o null", "flowOdor": "String o null", "painLevel": "Integer o null", "notes": "String o null", "cycleDays": [{"id": "Integer", "date": "String (ISO 8601)", "dayNumber": "Integer"}]}` |
|          | `/cycles/phases` | `GET` | - | Obtener todas las fases del ciclo actual | `[{"id": "Integer", "user": "String (IRI)", "phase": "String (menstrual/folicular/ovulacion/lutea)", "cycleId": "String (UUID)", "startDate": "String (ISO 8601)", "endDate": "String (ISO 8601)", "estimatedNextStart": "String (ISO 8601)", "averageCycleLength": "Integer", "averageDuration": "Integer"}]` |
|          | `/cycles/today` | `GET` | - | Información del día actual | `{"id": "Integer", "date": "String (ISO 8601)", "dayNumber": "Integer", "cyclePhase": {"id": "Integer", "phase": "String (menstrual/folicular/ovulacion/lutea)"}, "symptoms": ["Array"], "notes": ["Array"], "mood": ["Array"], "flowIntensity": "String o null", "hormoneLevels": ["Array"]}` |
|     ✓     | `/cycles/recommendations` | `GET` | Query: `type?` (String), `limit?` (Integer) | Recomendaciones personalizadas | `{"success": "Boolean", "currentPhase": "String", "cycleDay": "Integer", "recommendations": ["Array"]}` |
|     X     | `/cycles/calendar` | `GET` | Query: `start` (YYYY-MM-DD), `end` (YYYY-MM-DD) | Calendario de ciclos compartido | `{"userCycles": [...], "hostCycles": [{"hostId": "Integer", "hostName": "String", "hostUsername": "String", "guestType": "String", "accessPermissions": ["Array"], "guestPreferences": ["Array"], "cycles": [...], "currentPhase": "String"}]}` |
|          | `/cycles/predict` | `GET` | - | Predecir próximo ciclo | `{"success": "Boolean", "expectedStartDate": "String (YYYY-MM-DD)", "expectedEndDate": "String (YYYY-MM-DD)", "cycleLength": "Integer", "periodDuration": "Integer", "confidence": "Integer (0-99)", "marginOfError": "Integer", "basedOnCycles": "Integer", "algorithm": "String (weighted_average/trend_based/seasonal/default)", "regularity": "Integer (0-100)", "trend": "String (stable/increasing/decreasing)"}` |
|          | `/cycles/prediction-details` | `GET` | - | Obtener detalles avanzados de predicción | `{"success": "Boolean", "expectedStartDate": "String (YYYY-MM-DD)", "expectedEndDate": "String (YYYY-MM-DD)", "cycleLength": "Integer", "periodDuration": "Integer", "confidence": "Integer (0-99)", "marginOfError": "Integer", "basedOnCycles": "Integer", "algorithm": "String", "regularity": "Integer (0-100)", "trend": "String", "historicalData": {"cycleLengths": ["Array de Integer"], "periodDurations": ["Array de Integer"], "startDates": ["Array de String (YYYY-MM-DD)"]}, "statistics": {"standardDeviation": "Float", "minCycleLength": "Integer", "maxCycleLength": "Integer", "variabilityIndex": "Float"}, "forecastRange": {"earliestStartDate": "String (YYYY-MM-DD)", "latestStartDate": "String (YYYY-MM-DD)"}}` |
|          | `/cycles/sync-algorithm` | `POST` | - | Recalcular algoritmo de predicción | `{"message": "String", "prediction": {...}}` (La respuesta incluye el mismo objeto de predicción detallada que devuelve `/cycles/prediction-details`) |
|          | `/cycles/statistics` | `GET` | Query: `months` (Integer) | Estadísticas de ciclos | `{"cyclesAnalyzed": "Integer", "averageCycleLength": "Integer", "averagePeriodLength": "Integer", "longestCycle": {"id": "Integer", "startDate": "String (YYYY-MM-DD)", "length": "Integer"}, "shortestCycle": {"id": "Integer", "startDate": "String (YYYY-MM-DD)", "length": "Integer"}, "regularity": "Integer", "cycleLengthVariation": "Integer", "monthsAnalyzed": "Integer", "cyclesByMonth": [{"year": "Integer", "month": "Integer", "count": "Integer"}]}` |
|          | `/cycles/start-cycle` | `POST` | `{"startDate": "String (YYYY-MM-DD)"}` | Iniciar nuevo ciclo | `{"cycleId": "String (UUID)", "phases": {"menstrual": {"id": "Integer", "phase": "menstrual", "startDate": "String (ISO 8601)", "endDate": "String (ISO 8601)"}, "follicular": {"id": "Integer", "phase": "folicular", "startDate": "String (ISO 8601)", "endDate": "String (ISO 8601)"}, "ovulation": {"id": "Integer", "phase": "ovulacion", "startDate": "String (ISO 8601)", "endDate": "String (ISO 8601)"}, "luteal": {"id": "Integer", "phase": "lutea", "startDate": "String (ISO 8601)", "endDate": "String (ISO 8601)"}}, "estimatedNextStart": "String (YYYY-MM-DD)"}` |
|     ✓     | `/cycles/end-cycle/{id}` | `POST` | `{"endDate": "String (YYYY-MM-DD)", "notes": "String"}` | Finalizar ciclo | `{"message": "String", "cycle": {"id": "Integer", "user": "String (IRI)", "phase": "String (menstrual/folicular/ovulacion/lutea)", "cycleId": "String (UUID)", "startDate": "String (ISO 8601)", "endDate": "String (ISO 8601)", "estimatedNextStart": "String (ISO 8601)", "averageCycleLength": "Integer", "averageDuration": "Integer", "flowAmount": "String", "flowColor": "String", "flowOdor": "String", "painLevel": "Integer", "notes": "String"}, "phases": {...}}` |
|          | `/cycles` | `GET` | Query: `limit?`, `page?`, `year?`, `month?` | Listar todos los ciclos | `{"cycles": [{"id": "Integer", "cycleId": "String (UUID)", "phase": "String (menstrual/folicular/ovulacion/lutea)", "startDate": "String (ISO 8601)", "endDate": "String (ISO 8601)", "estimatedNextStart": "String (ISO 8601)", "averageCycleLength": "Integer", "averageDuration": "Integer"}], "pagination": {"total": "Integer", "page": "Integer", "limit": "Integer", "totalPages": "Integer"}}` |
|          | `/cycles/by-id/{cycleId}` | `GET` | cycleId (UUID) en URL | Obtener todas las fases de un ciclo específico | `[{"id": "Integer", "user": "String (IRI)", "phase": "String (menstrual/folicular/ovulacion/lutea)", "cycleId": "String (UUID)", "startDate": "String (ISO 8601)", "endDate": "String (ISO 8601)", "estimatedNextStart": "String (ISO 8601)", "averageCycleLength": "Integer", "averageDuration": "Integer"}]` |
|          | `/cycles/{id}` | `GET` | ID en URL | Obtener fase de ciclo específica | `{"id": "Integer", "user": "String (IRI)", "phase": "String (menstrual/folicular/ovulacion/lutea)", "cycleId": "String (UUID)", "startDate": "String (ISO 8601)", "endDate": "String (ISO 8601)", "estimatedNextStart": "String (ISO 8601)", "averageCycleLength": "Integer", "averageDuration": "Integer", "flowAmount": "String o null", "flowColor": "String o null", "flowOdor": "String o null", "painLevel": "Integer o null", "notes": "String o null"}` |
|          | `/cycles/{id}` | `PUT` | `{"startDate": "String (YYYY-MM-DD)", "endDate": "String (YYYY-MM-DD)", "averageCycleLength": "Integer", "averageDuration": "Integer", "flowAmount": "String (light/medium/heavy)", "flowColor": "String", "flowOdor": "String", "painLevel": "Integer (1-5)", "notes": "String"}` | Actualizar fase de ciclo | `{"id": "Integer", "user": "String (IRI)", "phase": "String (menstrual/folicular/ovulacion/lutea)", "cycleId": "String (UUID)", "startDate": "String (ISO 8601)", "endDate": "String (ISO 8601)", "estimatedNextStart": "String (ISO 8601)", "averageCycleLength": "Integer", "averageDuration": "Integer", "flowAmount": "String", "flowColor": "String", "flowOdor": "String", "painLevel": "Integer", "notes": "String"}` |
|          | `/cycles/{id}` | `DELETE` | ID en URL | Eliminar fase de ciclo | `{"message": "String"}` |

---

## 📅 **Días del Ciclo**

### ✅ **Implementados**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
|          | `/cycle-days` | `GET` | Query: `cycleId?`, `phaseId?`, `startDate?`, `endDate?` | Listar días de ciclo | `{"cycleDays": [{"id": "Integer", "date": "String (ISO 8601)", "dayNumber": "Integer", "cyclePhase": {"id": "Integer", "phase": "String"}, "symptoms": ["Array"], "mood": ["Array"], "flowIntensity": "Integer o null", "notes": ["Array"]}]}` |
|          | `/cycle-days/{id}` | `GET` | ID en URL | Obtener día específico | `{"id": "Integer", "date": "String (ISO 8601)", "dayNumber": "Integer", "cyclePhase": {"id": "Integer", "phase": "String"}, "symptoms": ["Array"], "mood": ["Array"], "flowIntensity": "Integer o null", "notes": ["Array"]}` |
|          | `/cycle-days` | `POST` | `{"date": "String (YYYY-MM-DD)", "phaseId?": "Integer", "symptoms?": ["Array"], "mood?": ["Array"], "flowIntensity?": "Integer", "notes?": ["Array"]}` | Registrar nuevo día | `{"id": "Integer", "date": "String (ISO 8601)", "dayNumber": "Integer", "cyclePhase": {"id": "Integer"}, "symptoms": ["Array"], "mood": ["Array"], "flowIntensity": "Integer o null", "notes": ["Array"]}` |
|          | `/cycle-days/{id}` | `PUT` | `{"date?": "String (YYYY-MM-DD)", "phaseId?": "Integer", "symptoms?": ["Array"], "mood?": ["Array"], "flowIntensity?": "Integer", "notes?": ["Array"]}` | Actualizar día de ciclo | `{"id": "Integer", "date": "String (ISO 8601)", "dayNumber": "Integer", "cyclePhase": {"id": "Integer"}, "symptoms": ["Array"], "mood": ["Array"], "flowIntensity": "Integer o null", "notes": ["Array"]}` |
|          | `/cycle-days/{id}` | `DELETE` | ID en URL | Eliminar día de ciclo | `{"message": "String"}` |
|          | `/cycle-days/date/{date}` | `GET` | Fecha en URL (YYYY-MM-DD) | Obtener día por fecha | `{"cycleDays": [{"id": "Integer", "date": "String (ISO 8601)", "dayNumber": "Integer", "cyclePhase": {"id": "Integer", "phase": "String"}, "symptoms": ["Array"], "mood": ["Array"], "flowIntensity": "Integer o null", "notes": ["Array"]}]}` |

### ❌ **Pendientes**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
| *Ninguno - Todos implementados* | | | | | |

---

## 🩺 **Síntomas**

### ❌ **Todos Pendientes**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
|          | `/symptoms` | `GET` | - | Listar categorías síntomas | JSON con lista de categorías de síntomas |
|          | `/symptoms/log` | `POST` | `{"cycleDayId": "", "type": "", "intensity": "", "notes": ""}` | Registrar síntoma | JSON con síntoma registrado |
|          | `/symptoms/log/{id}` | `PUT` | JSON con campos a actualizar | Actualizar síntoma | JSON con síntoma actualizado |
|          | `/symptoms/log/{id}` | `DELETE` | ID en URL | Eliminar síntoma | Mensaje de confirmación |
|          | `/symptoms/day/{cycleDayId}` | `GET` | ID del día en URL | Síntomas por día | JSON con síntomas del día |
|          | `/symptoms/stats` | `GET` | Query: `months` | Estadísticas síntomas | JSON con estadísticas de síntomas |

---

## 👥 **Invitados y Accesos**

### ✅ **Implementados**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
|          | `/guests` | `GET` | - | Listar accesos invitados | JSON con lista de invitados con acceso |
|          | `/guests` | `POST` | `{"guestId": "", "guestType": "", "accessTo": "", "expiresAt": ""}` | Crear acceso invitado | JSON con información del acceso creado |
|          | `/guests/{id}` | `DELETE` | ID en URL | Revocar acceso | Mensaje de confirmación |
|          | `/guests/{id}/modify` | `PUT` | JSON con campos a actualizar | Modificar acceso | JSON con acceso actualizado |
|          | `/guests/invitations` | `GET` | - | Invitaciones recibidas | JSON con lista de invitaciones |
|          | `/guests/test-route` | `GET` | - | Ruta de prueba | Mensaje de prueba |
|          | `/invitation-codes/generate` | `POST` | `{"guestType": "String (partner/friend/parental/healthcare_provider)", "accessPermissions": ["Array de String"], "expirationHours": "Integer (1-168, default: 48)"}` | Generar código de invitación | `{"id": "Integer", "code": "String (8 chars)", "guestType": "String", "accessPermissions": ["Array"], "expiresAt": "String (ISO 8601)"}` |
|          | `/invitation-codes` | `GET` | Query: `status?` (String) | Listar códigos creados | `{"codes": [{"id": "Integer", "code": "String", "guestType": "String", "status": "String", "createdAt": "String", "expiresAt": "String", "redeemedBy": "Object o null", "redeemedAt": "String o null"}]}` |
|          | `/invitation-codes/verify/{code}` | `GET` | Código en URL | Verificar código (público) | `{"valid": "Boolean", "creator": {"id": "Integer", "username": "String", "name": "String"}, "guestType": "String", "accessPermissions": ["Array"], "expiresAt": "String"}` o `{"valid": false, "message": "String"}` |
|          | `/invitation-codes/redeem/{code}` | `POST` | Código en URL | Canjear código | `{"success": "Boolean", "access": {"id": "Integer", "hostUser": {"id": "Integer", "username": "String", "name": "String"}, "guestType": "String", "accessPermissions": ["Array"]}}` |
|          | `/invitation-codes/{id}` | `DELETE` | ID en URL | Revocar código | `{"success": "Boolean", "message": "String"}` |
|     X     | `/guests/{id}/preferences` | `GET` | ID en URL | Obtener preferencias del invitado | `{"id": "Integer", "guestPreferences": ["Array"], "availablePermissions": {"Object"}, "hostPermissions": ["Array"]}` |
|     X     | `/guests/{id}/preferences` | `PUT` | `{"guestPreferences": ["Array de String"]}` | Actualizar preferencias del invitado | `{"message": "String", "guestAccess": {"Object"}}` |
|     X     | `/guests/{id}/permissions` | `PUT` | `{"accessTo": ["Array de String"]}` | Actualizar permisos del anfitrión | `{"message": "String", "guestAccess": {"Object"}, "adjustedPreferences": "Boolean"}` |
|     X     | `/guests/available-permissions` | `GET` | - | Obtener permisos disponibles | `{"permissions": {"phases": {"Object"}, "details": {"Object"}, "features": {"Object"}}}` |

### ❌ **Pendientes**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
|          | `/guests/{id}` | `GET` | ID en URL | Detalle acceso específico | JSON con detalles del acceso |
|          | `/guests/available-users` | `GET` | Query: `search?` | Usuarios disponibles | JSON con lista de usuarios |
|          | `/guests/accept/{id}` | `POST` | - | Aceptar invitación | Mensaje de confirmación |
|          | `/guests/decline/{id}` | `POST` | - | Rechazar invitación | Mensaje de confirmación |

---

## 🎯 **Onboarding**

### ✅ **Implementados**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
|     ✅     | `/onboarding` | `POST` | `{"isPersonal": "Boolean (String)", "profileType": "String (Enum)", "genderIdentity": "String", "pronouns": "String", "stageOfLife": "String", "lastPeriodDate": "String (YYYY-MM-DD)", "averageCycleLength": "Integer", "averagePeriodLength": "Integer", "receiveAlerts": "Boolean", "receiveRecommendations": "Boolean", "receiveCyclePhaseTips": "Boolean", "receiveWorkoutSuggestions": "Boolean", "receiveNutritionAdvice": "Boolean", "shareCycleWithPartner": "Boolean", "wantAiCompanion": "Boolean", "healthConcerns": ["Array de String"], "accessCode": "String", "allowParentalMonitoring": "Boolean", "commonSymptoms": ["Array de String"], "completed": "Boolean"}` | Completar onboarding | `{"message": "String", "user": {"id": "Integer", "email": "String", "onboardingCompleted": "Boolean"}, "onboarding": {"id": "Integer", "profileType": "String", "stageOfLife": "String", "lastPeriodDate": "String (YYYY-MM-DD)", "averageCycleLength": "Integer", "averagePeriodLength": "Integer", "completed": "Boolean"}, "additionalData": {"menstrualCycleCreated": "Boolean", "conditionsRegistered": ["Array de String"], "symptomsRegistered": ["Array de String"]}}` |
|     ✅     | `/onboarding` | `GET` | - | Obtener datos de onboarding | `{"onboarding": {"id": "Integer", "profileType": "String", "genderIdentity": "String", "pronouns": "String", "isPersonal": "Boolean", "stageOfLife": "String", "lastPeriodDate": "String", "averageCycleLength": "Integer", "averagePeriodLength": "Integer", "hormoneType": "String", "hormoneStartDate": "String", "hormoneFrequencyDays": "Integer", "receiveAlerts": "Boolean", "receiveRecommendations": "Boolean", "receiveCyclePhaseTips": "Boolean", "receiveWorkoutSuggestions": "Boolean", "receiveNutritionAdvice": "Boolean", "shareCycleWithPartner": "Boolean", "wantAiCompanion": "Boolean", "healthConcerns": ["Array"], "accessCode": "String", "allowParentalMonitoring": "Boolean", "commonSymptoms": ["Array"], "createdAt": "String", "updatedAt": "String", "completed": "Boolean"}, "user": {"id": "Integer", "email": "String", "username": "String", "name": "String", "lastName": "String", "onboardingCompleted": "Boolean"}, "additionalData": {"currentCycle": {"cycleId": "String", "phase": "String", "startDate": "String", "endDate": "String"}, "registeredConditions": [{"id": "Integer", "name": "String", "startDate": "String", "endDate": "String"}]}}` |


---

## 🔔 **Notificaciones**

### ✅ **Implementados**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
|          | `/notifications` | `GET` | Query: `type?, context?, limit?, page?, target?` | Listar notificaciones | JSON con notificaciones paginadas |
|          | `/notifications/unread` | `GET` | Query: `type?, context?` | Notificaciones no leídas | JSON con notificaciones no leídas |
|          | `/notifications/high-priority` | `GET` | - | Notificaciones prioritarias | JSON con notificaciones prioritarias |
|          | `/notifications/{id}` | `GET` | ID en URL | Notificación específica | JSON con detalles de la notificación |
|          | `/notifications/read/{id}` | `POST` | ID en URL | Marcar como leída | Mensaje de confirmación |
|          | `/notifications/read-all` | `POST` | `{"type": "", "context": ""}` (opcionales) | Marcar todas leídas | Mensaje de confirmación y contador |
|          | `/notifications/dismiss/{id}` | `POST` | ID en URL | Descartar notificación | Mensaje de confirmación |
|          | `/notifications/{id}` | `DELETE` | ID en URL | Eliminar notificación | Mensaje de confirmación |
|          | `/notifications/by-related/{entityType}/{entityId}` | `GET` | entityType y entityId en URL | Por entidad relacionada | JSON con notificaciones relacionadas |
|          | `/notifications/count` | `GET` | - | Contar no leídas | JSON con contadores por tipo y contexto |
|          | `/notifications/partner-test/{userId}` | `POST` | userId en URL | Prueba para pareja | JSON con datos de la notificación creada |

### ❌ **Pendientes**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
|          | `/notifications` | `POST` | `{"userId": "", "type": "", "title": "", "message": "", "priority": ""}` | Crear notificación | JSON con notificación creada |
|          | `/notifications/settings` | `GET` | - | Preferencias notificaciones | JSON con preferencias de notificaciones |
|          | `/notifications/settings` | `PUT` | JSON con preferencias | Actualizar preferencias | JSON con preferencias actualizadas |

---

## 🏥 **Condiciones Médicas**

### ✅ **Implementados**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
|     ✅     | `/conditions` | `GET` | - | Listar todas las condiciones | JSON con lista completa de condiciones médicas |
|          | `/conditions/{id}` | `GET` | ID en URL | Condición específica | JSON con detalles de la condición |
|          | `/conditions/user` | `GET` | - | Condiciones del usuario | JSON con condiciones del usuario |
|          | `/conditions/user/add` | `POST` | `{"conditionId": "", "startDate": "", "endDate": "", "notes": ""}` | Añadir al usuario | JSON con condición añadida |
|          | `/conditions/user/{id}` | `PUT` | JSON con campos a actualizar | Actualizar condición usuario | JSON con condición actualizada |
|          | `/conditions/user/{id}` | `DELETE` | ID en URL | Eliminar condición usuario | Mensaje de confirmación |
|     ✅     | `/conditions-active` | `GET` | - | Listar condiciones activas | JSON con lista de condiciones médicas activas |
|     ✅     | `/conditions/active` | `GET` | - | Listar condiciones activas (alt) | JSON con lista de condiciones médicas activas |
|          | `/conditions/user/active` | `GET` | - | Condiciones activas | JSON con condiciones activas |
|          | `/conditions/content/{id}` | `GET` | ID en URL | Contenido relacionado | JSON con contenido relacionado |
|          | `/conditions/notifications/{id}` | `GET` | ID en URL | Notificaciones relacionadas | JSON con notificaciones relacionadas |
|          | `/conditions` | `POST` | `{"name": "String", "description": "String", "isChronic": "Boolean", "category": "String (enum)", "severity": "String (enum)", "state": "Boolean"}` | Crear condición (admin) | `{"message": "String", "condition": {"id": "Integer", "name": "String", "description": "String", "isChronic": "Boolean", "category": "String", "severity": "String", "state": "Boolean", "createdAt": "String", "updatedAt": "String"}}` |
|          | `/conditions/{id}` | `PUT` | `{"name": "String", "description": "String", "isChronic": "Boolean", "category": "String (enum)", "severity": "String (enum)", "state": "Boolean"}` | Actualizar condición (admin) | `{"message": "String", "condition": {"id": "Integer", "name": "String", "description": "String", "isChronic": "Boolean", "category": "String", "severity": "String", "state": "Boolean", "createdAt": "String", "updatedAt": "String"}}` |
|          | `/conditions/{id}` | `DELETE` | ID en URL | Eliminar condición (admin) | `{"message": "String", "action": "String (deleted/deactivated)"}` |
|          | `/conditions/search` | `GET` | Query: `query` (String), `category?` (String), `state?` (Boolean) | Buscar condiciones | `{"query": "String", "category": "String", "state": "Boolean", "results": ["Array de condiciones"], "count": "Integer"}` |
|          | `/conditions/categories` | `GET` | - | Categorías de condiciones | `{"availableCategories": ["Array de categorías con value, label, description"], "usedCategories": ["Array de categorías usadas"], "availableSeverities": ["Array de severidades con value, label, description"]}` |

### ❌ **Pendientes**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
| *Todos implementados* | | | | | |

---

## 📖 **Contenido**

### ✅ **Implementados**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
|          | `/content` | `GET` | Query: `type?, phase?, condition?, limit?` | Listar contenido | JSON con lista de contenido |
|          | `/content/{id}` | `GET` | ID en URL | Contenido específico | JSON con detalles del contenido |
|          | `/content/phase/{phase}` | `GET` | phase en URL, Query: `type?, limit?` | Por fase del ciclo | JSON con contenido para la fase |
|          | `/content` | `POST` | `{"title": "", "description": "", "content": "", "type": "", "targetPhase": "", "tags": [], "imageUrl": "", "relatedConditions": []}` | Crear contenido (admin) | JSON con contenido creado |
|          | `/content/{id}` | `PUT` | JSON con campos a actualizar | Actualizar (admin) | JSON con contenido actualizado |
|          | `/content/{id}` | `DELETE` | ID en URL | Eliminar (admin) | Mensaje de confirmación |

### ❌ **Pendientes**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
|          | `/content/search` | `GET` | Query: `query, type?` | Buscar contenido | JSON con resultados de búsqueda |
|          | `/content/favorites` | `GET` | - | Contenido favorito | JSON con contenido favorito |
|          | `/content/favorites/{id}` | `POST` | ID en URL | Añadir a favoritos | Mensaje de confirmación |
|          | `/content/favorites/{id}` | `DELETE` | ID en URL | Quitar de favoritos | Mensaje de confirmación |
|          | `/content/popular` | `GET` | Query: `limit?` | Contenido popular | JSON con contenido popular |
|          | `/content/related/{id}` | `GET` | ID en URL, Query: `limit?` | Contenido relacionado | JSON con contenido relacionado |

---

## 📊 **Insights**

### ✅ **Implementados**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
|          | `/insights/summary` | `GET` | - | Resumen de insights | JSON con resumen de ciclos |
|          | `/insights/predictions` | `GET` | - | Predicciones | JSON con predicciones |
|          | `/insights/patterns` | `GET` | - | Patrones de síntomas | JSON con patrones identificados |

### ❌ **Pendientes**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
|          | `/insights/cycles` | `GET` | Query: `months` | Análisis de ciclos | JSON con análisis de ciclos |
|          | `/insights/symptoms` | `GET` | Query: `months` | Análisis de síntomas | JSON con análisis de síntomas |
|          | `/insights/hormone-levels` | `GET` | Query: `months` | Análisis hormonal | JSON con análisis de hormonas |
|          | `/insights/trends` | `GET` | Query: `years` | Tendencias largo plazo | JSON con tendencias |
|          | `/insights/reports` | `GET` | - | Informes generados | JSON con lista de informes |
|          | `/insights/reports` | `POST` | `{"type": "", "dateRange": {"start": "", "end": ""}}` | Generar informe | JSON con informe generado |
|          | `/insights/reports/{id}` | `GET` | ID en URL | Informe específico | JSON con detalles del informe |
|          | `/insights/reports/{id}` | `DELETE` | ID en URL | Eliminar informe | Mensaje de confirmación |

---

## 🌸 **Menopausia**

### ✅ **Implementados**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
|          | `/menopause` | `GET` | - | Registro menopausia | JSON con registro de menopausia |
|          | `/menopause` | `POST` | `{"hotFlashes": "", "moodSwings": "", "vaginalDryness": "", "insomnia": "", "hormoneTherapy": "", "notes": ""}` | Crear/actualizar registro | JSON con registro creado/actualizado |
|          | `/menopause` | `PUT` | JSON con campos a actualizar | Actualizar registro | JSON con registro actualizado |
|          | `/menopause/info` | `GET` | - | Información educativa | JSON con información educativa |
|          | `/menopause/symptoms` | `GET` | - | Manejo de síntomas | JSON con información sobre síntomas |

### ❌ **Pendientes**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
|          | `/menopause/daily-log` | `POST` | `{"date": "", "symptoms": [], "intensity": "", "notes": ""}` | Diario de síntomas | JSON con registro diario creado |
|          | `/menopause/daily-log/{date}` | `GET` | Fecha en URL (YYYY-MM-DD) | Registro por fecha | JSON con registro del día |
|          | `/menopause/daily-logs` | `GET` | Query: `startDate?, endDate?, limit?, page?` | Listar registros diarios | JSON con registros diarios |
|          | `/menopause/daily-log/{id}` | `PUT` | JSON con campos a actualizar | Actualizar registro diario | JSON con registro actualizado |
|          | `/menopause/daily-log/{id}` | `DELETE` | ID en URL | Eliminar registro diario | Mensaje de confirmación |
|          | `/menopause/stats` | `GET` | Query: `months` | Estadísticas síntomas | JSON con estadísticas |
|          | `/menopause/treatments` | `GET` | - | Tratamientos disponibles | JSON con tratamientos disponibles |
|          | `/menopause/treatments` | `POST` | `{"type": "", "startDate": "", "endDate": "", "dosage": "", "notes": ""}` | Registrar tratamiento | JSON con tratamiento registrado |

---

## 🤱 **Embarazo**

### ✅ **Implementados**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
|          | `/pregnancy` | `GET` | - | Listar embarazos | JSON con lista de embarazos |
|          | `/pregnancy/{id}` | `GET` | ID en URL | Embarazo específico | JSON con detalles del embarazo |
|          | `/pregnancy` | `POST` | `{"startDate": "", "dueDate": "", "week": "", "symptoms": [], "fetalMovements": "", "ultrasoundDate": "", "notes": ""}` | Crear registro | JSON con registro creado |
|          | `/pregnancy/{id}` | `PUT` | JSON con campos a actualizar | Actualizar registro | JSON con registro actualizado |
|          | `/pregnancy/{id}` | `DELETE` | ID en URL | Eliminar registro | Mensaje de confirmación |
|          | `/pregnancy/weekly/{week}` | `GET` | week en URL (1-42) | Información semanal | JSON con información de la semana |
|          | `/pregnancy/calculate-due-date` | `POST` | `{"lastPeriodDate": ""}` | Calcular fecha parto | JSON con cálculo |

### ❌ **Pendientes**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
|          | `/pregnancy/daily-log` | `POST` | `{"pregnancyId": "", "date": "", "symptoms": [], "fetalMovements": "", "notes": ""}` | Diario embarazo | JSON con registro diario creado |
|          | `/pregnancy/daily-log/{date}` | `GET` | Fecha en URL (YYYY-MM-DD) | Registro por fecha | JSON con registro del día |
|          | `/pregnancy/daily-logs/{pregnancyId}` | `GET` | pregnancyId en URL, Query: `startDate?, endDate?` | Listar registros diarios | JSON con registros diarios |
|          | `/pregnancy/checkups` | `POST` | `{"pregnancyId": "", "date": "", "type": "", "results": "", "notes": ""}` | Control médico | JSON con control registrado |
|          | `/pregnancy/checkups/{pregnancyId}` | `GET` | pregnancyId en URL | Listar controles | JSON con lista de controles |
|          | `/pregnancy/checklist` | `GET` | Query: `week?` | Checklist embarazo | JSON con checklist |

---

## 🧬 **Niveles Hormonales**

### ❌ **Todos Pendientes**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
|          | `/hormone-levels` | `GET` | Query: `startDate?, endDate?, type?` | Listar registros | JSON con registros hormonales |
|          | `/hormone-levels` | `POST` | `{"date": "", "type": "", "value": "", "unit": "", "source": "", "notes": ""}` | Registrar nivel | JSON con registro creado |
|          | `/hormone-levels/{id}` | `GET` | ID en URL | Registro específico | JSON con detalles del registro |
|          | `/hormone-levels/{id}` | `PUT` | JSON con campos a actualizar | Actualizar registro | JSON con registro actualizado |
|          | `/hormone-levels/{id}` | `DELETE` | ID en URL | Eliminar registro | Mensaje de confirmación |
|          | `/hormone-levels/types` | `GET` | - | Tipos de hormonas | JSON con tipos de hormonas |
|          | `/hormone-levels/chart` | `GET` | Query: `startDate?, endDate?, type?` | Datos para gráfico | JSON con datos para visualización |
|          | `/hormone-levels/reference` | `GET` | Query: `type?, age?` | Valores de referencia | JSON con valores de referencia |

---

## 🤖 **Consultas IA**

### ❌ **Todos Pendientes**

| Validado | Endpoint | Método | Campos de Entrada | Descripción | Respuesta |
|:--------:|----------|--------|-------------------|-------------|----------|
|          | `/ai/chat` | `POST` | `{"query": "", "context": ""}` | Consulta a IA | JSON con respuesta de IA |
|          | `/ai/history` | `GET` | Query: `limit?, page?` | Historial consultas | JSON con historial de consultas |
|          | `/ai/history/{id}` | `GET` | ID en URL | Consulta específica | JSON con detalles de la consulta |
|          | `/ai/suggestions` | `GET` | Query: `context?` | Sugerencias consultas | JSON con sugerencias |
|          | `/ai/feedback` | `POST` | `{"queryId": "", "helpful": true/false, "feedback": ""}` | Feedback respuesta | Mensaje de confirmación |

---

## 📝 **Notas Importantes**

### 🔒 **Autenticación**
- Todos los endpoints requieren autenticación JWT excepto:
  - `/login_check`
  - `/register` 
  - `/password-reset`

### 👑 **Permisos Admin**
Los siguientes endpoints requieren `ROLE_ADMIN`:
- `/api/admin/users/*` (gestión de usuarios)
- `/conditions` (POST, PUT, DELETE) - **NUEVOS ENDPOINTS v0.6.0**
- `/conditions/search` (GET) - Disponible para todos los usuarios autenticados
- `/conditions/categories` (GET) - Disponible para todos los usuarios autenticados
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

### 🔄 **Modelo Basado en Fases**
- A partir de la v0.2.0, EYRA utiliza un modelo basado en fases del ciclo menstrual
- Cada ciclo completo está compuesto por 4 fases (menstrual, folicular, ovulación, lútea)
- Las fases están relacionadas mediante un ID de ciclo común (cycleId)
- Los días del ciclo ahora están vinculados a fases específicas, no al ciclo completo
- Para migrar datos del modelo anterior al nuevo modelo, ejecute:
  ```
  php bin/console app:migrate-to-cycle-phases
  ```

### 🔧 **Herramientas para Desarrolladores**
- Comando para migrar al modelo basado en fases: `app:migrate-to-cycle-phases`
- Para probar los endpoints, se recomienda usar la colección de Postman incluida

### ✅ **Leyenda de Validación**
En la columna "Validado" se indicará:
- ✓ - Endpoint validado y funcionando correctamente
- ✗ - Endpoint validado pero con errores o problemas
- (vacío) - Endpoint aún no validado