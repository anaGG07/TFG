# 📚 Documentación del Panel de Administración - EYRA

> **Versión**: 0.7.8  
> **Última actualización**: 01/06/2025  
> **Framework**: Symfony 7.2 + React 19  
> **Base de datos**: PostgreSQL 16

---

## 🎯 Índice de Contenidos

### 📋 1. Vista General
- [[02-Arquitectura-Admin|Arquitectura del Sistema de Administración]]
- [[03-Seguridad-Permisos|Seguridad y Permisos]]
- [[04-Flujo-Autenticacion|Flujo de Autenticación]]

### 👥 2. Gestión de Usuarios
- [[05-CRUD-Usuarios|CRUD Completo de Usuarios]]
- [[06-Roles-Perfiles|Sistema de Roles y Perfiles]]
- [[07-Filtros-Busqueda|Sistema de Filtros y Búsqueda]]

### 🏥 3. Gestión de Condiciones Médicas
- [[08-CRUD-Condiciones|CRUD de Condiciones Médicas]]
- [[09-Sistema-Condiciones|Sistema de Condiciones y Usuarios]]

### 🔧 4. Componentes Técnicos
- [[10-Backend-Controllers|Controladores Backend]]
- [[11-Frontend-Components|Componentes Frontend]]
- [[12-API-Endpoints|API Endpoints de Administración]]

### 📊 5. Funcionalidades Avanzadas
- [[13-Estadisticas-Dashboard|Dashboard y Estadísticas]]
- [[14-Sistema-Notificaciones|Sistema de Notificaciones]]
- [[15-Logs-Auditoria|Logs y Auditoría]]

### 🛠️ 6. Guías de Desarrollo
- [[16-Agregar-Funcionalidad|Cómo Agregar Nueva Funcionalidad]]
- [[17-Mejores-Practicas|Mejores Prácticas]]
- [[18-Troubleshooting|Resolución de Problemas]]

### 📝 7. Referencias
- [[19-Modelos-Datos|Modelos de Datos]]
- [[20-Configuracion-Sistema|Configuración del Sistema]]

---

## 🚀 Inicio Rápido

### Acceso al Panel de Administración

1. **URL de acceso**: `/admin`
2. **Requisitos**:
   - Usuario autenticado con rol `ROLE_ADMIN`
   - Onboarding completado
   - Sesión activa con JWT válido

### Funcionalidades Principales

- ✅ **Gestión de Usuarios**: CRUD completo, búsqueda, filtros, activación/desactivación
- ✅ **Gestión de Condiciones Médicas**: CRUD completo, estados, búsqueda
- 📊 **Dashboard**: Estadísticas en tiempo real del sistema
- 🔔 **Notificaciones**: Sistema unificado de alertas
- 📱 **Responsive**: Diseño adaptable a todos los dispositivos

---

## 🔐 Información de Seguridad

### Niveles de Acceso

| Rol | Permisos | Descripción |
|-----|----------|-------------|
| `ROLE_ADMIN` | Total | Acceso completo al panel de administración |
| `ROLE_USER` | Ninguno | Sin acceso al panel admin |
| `ROLE_GUEST` | Ninguno | Sin acceso al panel admin |

### Validaciones

- Autenticación JWT en cada petición
- Verificación de roles en backend y frontend
- Logs de auditoría para acciones críticas
- Protección contra CSRF y XSS

---

## 📁 Estructura de la Documentación

Esta documentación está organizada siguiendo el principio de Zettelkasten para Obsidian:

- **Notas atómicas**: Cada archivo cubre un tema específico
- **Enlaces bidireccionales**: Navegación fácil entre conceptos relacionados
- **Tags**: Para categorización y búsqueda rápida
- **Gráfico de conocimiento**: Visualización de relaciones entre componentes

### Tags Utilizados

- `#admin` - Funcionalidades administrativas
- `#backend` - Componentes del servidor
- `#frontend` - Componentes de la interfaz
- `#security` - Aspectos de seguridad
- `#api` - Endpoints y servicios
- `#database` - Modelos y persistencia
- `#component` - Componentes reutilizables
- `#guide` - Guías y tutoriales

---

## 🎨 Convenciones de Diseño

### Colores Principales

- **Rojo EYRA**: `#b91c1c` - Color principal de la marca
- **Gris oscuro**: `#333333` - Textos principales
- **Verde éxito**: `#4CAF50` - Estados positivos
- **Rojo error**: `#FF5252` - Estados de error
- **Azul info**: `#2196F3` - Información

### Iconografía

El panel utiliza una combinación de:
- Emojis para identificación rápida
- Iconos de Lucide React para acciones
- Estados visuales con badges de colores

---

## 📈 Métricas del Sistema

### Estadísticas Actuales

- **Endpoints de Admin**: 14 implementados
- **Componentes Frontend**: 9 componentes principales
- **Cobertura de Tests**: Por implementar
- **Tiempo de respuesta promedio**: < 200ms
- **Escalabilidad**: Soporta 10k+ usuarios

---

## 🔗 Enlaces Rápidos

- [[02-Arquitectura-Admin|→ Siguiente: Arquitectura del Sistema]]
- [[Control_cambios_backend|📝 Registro de Cambios]]
- [[Endpoints|📋 Lista Completa de Endpoints]]

---

#admin #documentation #index #eyra