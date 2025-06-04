# Flujo de Navegación Web - EYRA

> **Archivo**: Flujo_Web_EYRA.md  
> **Actualizado**: 01/06/2025  
> **Propósito**: Definición de flujos de usuario y rutas de la aplicación  

---

Este documento describe el flujo funcional de la plataforma EYRA desde la perspectiva de una usuaria principal, así como los accesos disponibles para perfiles secundarios (pareja/invitado). Define las vistas, rutas, acciones clave y relaciones con el backend.

---

## 1. Inicio

### Ruta: `/` (Home público)
- Breve presentación de la plataforma
- Botones de acceso:
  - [Iniciar sesión] → `/login`
  - [Registrarse] → `/register`

---

## 2. Autenticación

### Ruta: `/login`
- Formulario: email + contraseña
- Acción: POST → `/api/login`
- Redirección a `/dashboard` si login correcto

### Ruta: `/register`
- Formulario de registro (nombre, email, contraseña, fecha de nacimiento, perfil)
- Acción: POST → `/api/register`
- Redirección a `/onboarding`

---

## 3. Onboarding (primer acceso)

### Ruta: `/onboarding`
- Selección de perfil: mujer / en transición / pareja
- Registro de datos iniciales:
  - Identidad de género
  - Fecha de última menstruación
  - Síntomas comunes

---

## 4. Dashboard (Inicio personal)

### Ruta: `/dashboard`
- Muestra:
  - Estado del ciclo actual
  - Próxima menstruación estimada
  - Hormonas predominantes
  - Alertas activas
  - Recomendación del día

- Acciones:
  - [Registrar nuevo ciclo] → `/ciclo/crear`
  - [Registrar síntoma] → `/sintomas/crear`
  - [Ver historial] → `/historial`
  - [Acceder al perfil] → `/perfil`

---

## 5. Gestión de Ciclos

### Ruta: `/ciclo/crear`
- Formulario:
  - Fecha inicio y fin
  - Flujo, dolor, síntomas asociados
- Acción: POST → `/api/cycles`
- Redirección: `/historial/ciclos`

### Ruta: `/historial/ciclos`
- Lista de ciclos anteriores
- Acción: GET → `/api/cycles`

---

## 6. Síntomas

### Ruta: `/sintomas/crear`
- Formulario:
  - Nombre del síntoma
  - Intensidad
  - Comentario opcional
  - Fecha
- Acción: POST → `/api/symptoms`

### Ruta: `/sintomas/historial`
- Visualización diaria
- Acción: GET → `/api/symptoms`

---

## 7. Hormonas

### Ruta: `/hormonas/registro`
- Formulario:
  - Hormona, nivel, unidad
  - Fecha
- Acción: POST → `/api/hormones`

### Ruta: `/hormonas/historial`
- Gráficas y niveles
- Acción: GET → `/api/hormones`

---

## 8. Perfil

### Ruta: `/perfil`
- Datos personales editables
- Acciones:
  - Cambiar contraseña
  - Cambiar perfil (género, identidad, etc.)
  - Añadir condiciones de salud (endometriosis, etc.)
  - Desactivar cuenta

---

## 9. Alertas

### Ruta: `/alertas`
- Lista de alertas programadas y personalizadas
- Acción: GET → `/api/alerts`

---

## 10. Acceso de Pareja / Invitado

### Ruta: `/acceso-pareja`
- Vista simplificada del estado de la usuaria
- Ver:
  - Fase del ciclo
  - Recomendaciones del día (ej. traer chocolate)
- Acción: controlada por permisos del usuario principal

---

## 11. Administración futura

> (Fuera de MVP, pero previsto)

- Panel de administración
- Gestión de condiciones, fases, textos informativos
- Moderación de IA y contenido

---

---

## 🔗 Enlaces Relacionados

- ← **[Arquitectura General](../Arquitectura/Arquitectura_General.md)** - Visión arquitectónica
- → **[Casos de Uso](./Casos_Uso.md)** - Escenarios detallados
- 📊 **[MVP Implementado](../../01_Introducción/MVP.md)** - Estado de desarrollo
- 🗺️ **[API Endpoints](../API/Endpoints.md)** - Documentación técnica
- 🏠 **[Volver al Índice](../../00_Indice/README.md)** - Navegación principal

---

*Flujos de navegación actualizados el 01/06/2025*

<!-- ! 01/06/2025 - Actualización del flujo de navegación con estado actual de implementación -->

