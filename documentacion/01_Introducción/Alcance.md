# Alcance del Proyecto - EYRA

> **Archivo**: Alcance.md  
> **Actualizado**: 01/06/2025  
> **Propósito**: Delimitación del TFG y funcionalidades incluidas  

---

## Alcance General

El presente Trabajo Fin de Grado abarca el diseño, desarrollo e implementación del **backend de una plataforma web centrada en el acompañamiento del ciclo menstrual, hormonal y vital de la mujer y personas menstruantes**, conocida como EYRA.

Se desarrollará una solución tecnológica que siente las bases para una futura expansión móvil y con capacidad de integrar inteligencia artificial, aunque en esta fase se priorizará el funcionamiento estable, escalable y funcional del sistema en entorno web.

---

## Funcionalidades Incluidas en esta Fase

###  Backend Symfony

- Definición del modelo de datos (entidades Doctrine)
- Implementación de relaciones y reglas de negocio
- Gestión de usuarios y roles
- Registro de ciclos menstruales
- Registro de síntomas y niveles hormonales
- Asociación de condiciones médicas
- Generación de alertas básicas
- Seguridad y autenticación
- Migraciones y estructura de base de datos PostgreSQL

###  Frontend (base)

- Estructura inicial del proyecto en React y TypeScript
- Pantallas de login, registro y formularios de entrada
- Conexión básica con endpoints del backend
- Diseño accesible y minimalista enfocado a usuarias

---

## Elementos Fuera de Alcance (por ahora)

- Desarrollo completo de la app móvil
- Chatbot o asistente inteligente con IA
- Integración de algoritmos de predicción personalizados
- Gestión de notificaciones push
- Interacción avanzada de pareja o perfiles múltiples

---

## Consideraciones

Aunque no se desarrollarán todos los módulos previstos en la visión futura de EYRA, este TFG pretende dejar **una base sólida, extensible y documentada**, desde la cual continuar el crecimiento funcional y tecnológico del sistema.

El alcance del proyecto se centrará en entregar un **producto mínimo viable (MVP) superado**, funcional y probado, que valide la utilidad de la herramienta y permita una futura evolución en nuevas fases o versiones.

---

## 📊 Estado Actual del Alcance

### ✅ **Completamente Implementado**
- **Backend Symfony**: Sistema completo con 70/102 endpoints implementados
- **Base de datos PostgreSQL**: 15+ entidades con relaciones complejas
- **Sistema de autenticación**: JWT + roles avanzados (RBAC)
- **Panel administrativo**: Dashboard profesional completo
- **API REST**: Documentación completa con OpenAPI/Swagger
- **Sistema inclusivo**: 9 tipos de perfil diferentes
- **Seguridad avanzada**: Logs de auditoría, validaciones, protección CSRF/XSS

### 🟡 **Parcialmente Implementado**
- **Frontend React**: Estructura base + panel admin (funcionalidades básicas pendientes)
- **Sistema de síntomas**: Modelo preparado (API pendiente)
- **Niveles hormonales**: Estructura definida (implementación pendiente)
- **Sistema de IA**: Bases arquitectónicas preparadas

### 🎯 **Superación del Alcance Original**
El proyecto ha **excedido significativamente** el alcance inicial:
- **Sistema de invitados/parejas**: 20 endpoints implementados
- **Códigos de invitación**: Sistema completo
- **Dashboard administrativo**: No estaba en el alcance inicial
- **Sistema de notificaciones**: 13 endpoints implementados
- **Logs de embarazo y menopausia**: Funcionalidades adicionales
- **Sistema de insights**: Análisis y patrones implementados

---

## 🔗 Enlaces Relacionados

- ← **[Objetivos del Proyecto](./Objetivos.md)** - Objetivos generales y específicos
- → **[Metodología](./Metodología.md)** - Enfoque de desarrollo
- → **[MVP Implementado](./MVP.md)** - Estado detallado de funcionalidades
- 📊 **[Evaluación del Producto](../05_Resultados/Evaluacion_Producto.md)** - Calidad y cumplimiento
- 🏠 **[Volver al Índice](../00_Indice/README.md)** - Navegación principal

---

*Alcance actualizado el 01/06/2025 con el estado real de implementación*

<!-- ! 01/06/2025 - Actualización del alcance con estado real y superación de objetivos iniciales -->

