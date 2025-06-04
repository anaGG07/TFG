# 📚 Documentación TFG - EYRA
## *Aplicación de Seguimiento Menstrual Inclusiva*

> **Versión**: 1.0.0  
> **Última actualización**: 01/06/2025  
> **Autor**: [Nombre del estudiante]  
> **Framework**: Symfony 7.2 + React 19 + TypeScript  
> **Base de datos**: PostgreSQL 16

---

## 🎯 **Índice Principal del TFG**

### 📋 **1. Introducción**
- **[Contexto del Proyecto](../01_Introducción/Contexto.md)** - Problemática y justificación
- **[Objetivos](../01_Introducción/Objetivos.md)** - Objetivos generales y específicos
- **[Alcance](../01_Introducción/Alcance.md)** - Delimitación del proyecto
- **[Metodología](../01_Introducción/Metodología.md)** - Metodología de desarrollo
- **[MVP](../01_Introducción/MVP.md)** - Producto Mínimo Viable

### 🔍 **2. Estudio Preliminar**
- **[Análisis de Aplicaciones Similares](../02_Estudio-Preliminar/Análisis_de_Aplicaciones_Similares.md)** - Estado del arte
- **[Diferenciación EYRA](../02_Estudio-Preliminar/Diferenciacion_EYRA.md)** - Propuesta de valor
- **[Tecnologías Relacionadas](../02_Estudio-Preliminar/Tecnologias_Relacionadas.md)** - Stack tecnológico

### 🏗️ **3. Análisis y Diseño**
- **[Entidades del Sistema](../03_Análisis-Diseño/Entidades/Entidades.md)** - Modelo de datos
- **[Arquitectura](../03_Análisis-Diseño/Arquitectura/)** - Diseño del sistema
- **[Seguridad](../03_Análisis-Diseño/Seguridad/)** - Permisos y autenticación
- **[Flujos de Usuario](../03_Análisis-Diseño/Flujos/)** - UX y casos de uso
- **[API Documentation](../03_Análisis-Diseño/API/)** - Endpoints y servicios

### 💻 **4. Desarrollo**
- **[Backend](../04_Desarrollo/Backend/)** - Implementación Symfony
- **[Frontend](../04_Desarrollo/Frontend/)** - Implementación React
- **[Funcionalidades](../04_Desarrollo/Funcionalidades/)** - Features implementadas
- **[Guías de Desarrollo](../04_Desarrollo/Guias/)** - Documentación técnica
- **[Testing](../04_Desarrollo/Pruebas/)** - Estrategia de pruebas

### 📊 **5. Resultados**
- **[Panel de Administración](../05_Resultados/Dashboard_Admin/)** - Implementación completa
- **[Cumplimiento de Objetivos](../05_Resultados/Cumplimiento_Objetivos.md)** - Evaluación
- **[Métricas y Performance](../05_Resultados/Metricas_Performance.md)** - Rendimiento
- **[Limitaciones y Mejoras](../05_Resultados/Limitaciones_Mejoras.md)** - Trabajo futuro

### 📖 **6. Bibliografía y Anexos**
- **[Bibliografía](../06_Bibliografía/Bibliografia.md)** - Referencias académicas
- **[Referencias Técnicas](../06_Bibliografía/Referencias_Tecnicas.md)** - Documentación técnica
- **[Anexos](../06_Bibliografía/Anexos.md)** - Material complementario

---

## 🚀 **Inicio Rápido**

### **Para Revisores Académicos**
1. **Contexto**: Comenzar por [Contexto del Proyecto](../01_Introducción/Contexto.md)
2. **Objetivos**: Revisar [Objetivos](../01_Introducción/Objetivos.md) y [Alcance](../01_Introducción/Alcance.md)
3. **Implementación**: Ver [Resultados](../05_Resultados/) para evaluación del trabajo

### **Para Desarrolladores**
1. **Arquitectura**: Empezar por [Arquitectura del Sistema](../03_Análisis-Diseño/Arquitectura/)
2. **API**: Consultar [Endpoints](../03_Análisis-Diseño/API/Endpoints.md) completos
3. **Guías**: Seguir [Guías de Desarrollo](../04_Desarrollo/Guias/)

### **Para Usuarios Finales**
1. **Funcionalidades**: Ver [MVP](../01_Introducción/MVP.md) 
2. **Flujos**: Entender [Flujos de Usuario](../03_Análisis-Diseño/Flujos/)

---

## 📈 **Estadísticas del Proyecto**

### **Implementación Completada**
- ✅ **Backend API**: 102 endpoints (70 implementados)
- ✅ **Frontend**: Panel admin completo + funcionalidades base
- ✅ **Base de Datos**: 15+ entidades principales
- ✅ **Autenticación**: JWT + Sistema de roles
- ✅ **Testing**: Estrategia definida

### **Tecnologías Principales**
- **Backend**: Symfony 7.2, API Platform 4.1, PostgreSQL 16
- **Frontend**: React 19, TypeScript, Tailwind CSS 4.1
- **Infraestructura**: Docker, Nginx, PHP-FPM
- **Seguridad**: JWT, Symfony Security Bundle

---

## 🎯 **Funcionalidades Implementadas**

### **Core Features**
- 🔐 **Autenticación completa**: Registro, login, recuperación contraseña
- 👥 **Gestión de usuarios**: CRUD, roles, perfiles inclusivos
- 🩺 **Condiciones médicas**: Sistema completo de condiciones
- 📊 **Panel administrativo**: Dashboard con estadísticas
- 🔔 **Notificaciones**: Sistema unificado de alertas

### **Features Avanzadas**
- 🏥 **Sistema inclusivo**: Soporte para personas trans y no binarias
- 👨‍👩‍👧‍👦 **Acceso de invitados**: Parejas, padres, cuidadores
- 📱 **Responsive**: Adaptable a todos los dispositivos
- 🔍 **Búsqueda avanzada**: Filtros múltiples y paginación
- 📈 **Métricas**: Analytics y insights del sistema

---

## 🔐 **Información de Seguridad**

### **Niveles de Acceso**
| Rol | Permisos | Descripción |
|-----|----------|-------------|
| `ROLE_ADMIN` | Total | Acceso completo al sistema |
| `ROLE_USER` | Usuario | Funcionalidades principales |
| `ROLE_GUEST` | Limitado | Acceso por invitación |

### **Medidas de Seguridad**
- Autenticación JWT en todas las peticiones
- Validación de roles en backend y frontend  
- Logs de auditoría para acciones críticas
- Protección CSRF, XSS y SQL Injection

---

## 📁 **Organización de la Documentación**

Esta documentación sigue **principios académicos** combinados con **mejores prácticas técnicas**:

- **Estructura académica**: Numeración clara (00_ a 06_)
- **Navegación técnica**: Enlaces internos y referencias cruzadas
- **Modularidad**: Cada sección es independiente pero conectada
- **Accesibilidad**: Múltiples puntos de entrada según el perfil del lector

### **Convenciones Utilizadas**
- 📁 Carpetas numeradas por orden lógico de lectura
- 📄 Archivos con nombres descriptivos en español
- 🔗 Enlaces relativos entre documentos
- 📋 Listas y tablas para información estructurada
- 🎨 Emojis para identificación visual rápida

---

## 🔗 **Enlaces de Referencia Rápida**

### **Documentos Clave**
- 📋 **[Lista Completa de Endpoints](../03_Análisis-Diseño/API/Endpoints.md)**
- 🏗️ **[Arquitectura del Sistema](../03_Análisis-Diseño/Arquitectura/)**
- 🔐 **[Seguridad y Autenticación](../03_Análisis-Diseño/Seguridad/)**
- 📊 **[Panel de Administración](../05_Resultados/Dashboard_Admin/)**

### **Guías Técnicas**
- 🛠️ **[Agregar Nueva Funcionalidad](../04_Desarrollo/Guias/Agregar_Funcionalidad.md)**
- 📝 **[Mejores Prácticas](../04_Desarrollo/Guias/Mejores_Practicas.md)**
- 🧪 **[Estrategia de Testing](../04_Desarrollo/Pruebas/Estrategia_Testing.md)**

### **Archivos de Soporte**
- 📝 **[Notas Globales del TFG](../TFG_EYRA_Notas_Globales.md)**
- 🏷️ **[Sistema de Tags](../Tags/)**
- ⚙️ **[Configuraciones](./.config/)**

---

## 📞 **Información de Contacto**

**Desarrollado como Trabajo Fin de Grado**  
**Grado en Desarrollo de Aplicaciones Web**  
**Curso 2024-2025**

---

