# 🏗️ Estructura del Proyecto de Documentación

> **Archivo**: Estructura_Proyecto.md  
> **Propósito**: Explicar la organización y lógica de la documentación del TFG EYRA  
> **Creado**: 01/06/2025

---

## 📋 **Principios Organizativos**

La documentación de EYRA sigue una **estructura híbrida** que combina:

1. **Organización académica tradicional** (para TFG)
2. **Navegación técnica moderna** (para desarrollo)
3. **Modularidad y reutilización** (para mantenimiento)

---

## 📁 **Estructura de Carpetas Principales**

### **Carpetas Numeradas (Flujo Académico)**

```
documentacion/
├── 00_Indice/           # Navegación y referencias
├── 01_Introducción/     # Contexto y objetivos
├── 02_Estudio-Preliminar/   # Estado del arte
├── 03_Análisis-Diseño/  # Arquitectura y diseño
├── 04_Desarrollo/       # Implementación técnica
├── 05_Resultados/       # Evaluación y métricas
└── 06_Bibliografía/     # Referencias y anexos
```

### **Carpetas de Soporte**

```
documentacion/
├── .config/             # Configuraciones de herramientas
├── Tags/                # Sistema de etiquetado
└── NEW/                 # [TEMP] Contenido a integrar
```

---

## 🎯 **Lógica de Cada Sección**

### **00_Indice** - Centro de Navegación
```
00_Indice/
├── README.md                 # Índice principal completo
├── Estructura_Proyecto.md    # Este archivo - organización
└── Enlaces_Rapidos.md        # Acceso directo por perfil de usuario
```

**Propósito**: Punto de entrada único con múltiples rutas de navegación según el perfil del lector (académico, técnico, usuario final).

### **01_Introducción** - Contexto del Proyecto
```
01_Introducción/
├── Contexto.md              # Problemática y justificación
├── Objetivos.md             # Objetivos generales y específicos  
├── Alcance.md               # Delimitación del proyecto
├── Metodología.md           # Metodología de desarrollo
└── MVP.md                   # Producto Mínimo Viable
```

**Propósito**: Establecer el marco conceptual y justificar la necesidad del proyecto.

### **02_Estudio-Preliminar** - Estado del Arte
```
02_Estudio-Preliminar/
├── Análisis_de_Aplicaciones_Similares.md    # Competencia existente
├── Diferenciacion_EYRA.md                   # Propuesta de valor única
└── Tecnologias_Relacionadas.md              # Stack tecnológico elegido
```

**Propósito**: Analizar soluciones existentes y justificar decisiones tecnológicas.

### **03_Análisis-Diseño** - Arquitectura del Sistema
```
03_Análisis-Diseño/
├── Entidades/               # Modelo de datos
│   ├── Entidades.md        # Vista general
│   ├── User.md             # Entidad usuario
│   ├── MenstrualCycle.md   # Entidad ciclo
│   └── [otras entidades...]
├── Arquitectura/            # Diseño del sistema
│   ├── Arquitectura_General.md
│   ├── Arquitectura_Backend.md
│   ├── Arquitectura_Frontend.md
│   └── Base_Datos.md
├── Seguridad/               # Permisos y autenticación
│   ├── Seguridad_Permisos.md
│   ├── Flujo_Autenticacion.md
│   └── Roles_Perfiles.md
├── Flujos/                  # UX y casos de uso
│   ├── Flujo_Web_EYRA.md
│   └── Casos_Uso.md
└── API/                     # Endpoints y servicios
    ├── Endpoints.md
    └── Documentacion_API.md
```

**Propósito**: Definir completamente la arquitectura técnica y funcional del sistema.

### **04_Desarrollo** - Implementación Técnica
```
04_Desarrollo/
├── Backend/                 # Implementación servidor
│   ├── Configuracion_Entorno.md
│   ├── Controladores.md
│   ├── CRUD_Usuarios.md
│   ├── CRUD_Condiciones.md
│   └── Sistema_Condiciones.md
├── Frontend/                # Implementación cliente
│   ├── Componentes.md
│   ├── Configuracion.md
│   └── Estilos_UI.md
├── Funcionalidades/         # Features implementadas
│   ├── Dashboard_Estadisticas.md
│   ├── Sistema_Notificaciones.md
│   ├── Filtros_Busqueda.md
│   └── Logs_Auditoria.md
├── Guias/                   # Documentación técnica
│   ├── Agregar_Funcionalidad.md
│   ├── Mejores_Practicas.md
│   └── Patrones_Desarrollo.md
└── Pruebas/                 # Testing
    ├── Estrategia_Testing.md
    └── Test_Coverage.md
```

**Propósito**: Documentar todo el proceso de implementación con guías técnicas detalladas.

### **05_Resultados** - Evaluación del Trabajo
```
05_Resultados/
├── Dashboard_Admin/                # Caso de estudio principal
│   └── Implementacion_Panel.md
├── Cumplimiento_Objetivos.md      # Evaluación de objetivos
├── Evaluacion_Producto.md         # Calidad del producto
├── Metricas_Performance.md        # Rendimiento técnico
└── Limitaciones_Mejoras.md        # Trabajo futuro
```

**Propósito**: Demostrar el cumplimiento de objetivos y evaluar la calidad del trabajo realizado.

### **06_Bibliografía** - Referencias
```
06_Bibliografía/
├── Bibliografia.md           # Referencias académicas
├── Referencias_Tecnicas.md   # Documentación técnica
└── Anexos.md                # Material complementario
```

**Propósito**: Proporcionar todas las fuentes y material de apoyo utilizados.

---

## 🔗 **Sistema de Enlaces**

### **Tipos de Enlaces Utilizados**

1. **Enlaces relativos**: `../carpeta/archivo.md`
   - Para navegación entre secciones
   - Mantienen funcionalidad si se mueve la documentación

2. **Enlaces absolutos**: Para recursos externos
   - APIs, documentación oficial, papers académicos

3. **Enlaces internos**: `#seccion` 
   - Para navegación dentro del mismo documento

### **Convenciones de Nomenclatura**

- **Archivos**: `Nombre_Descriptivo.md` (guiones bajos)
- **Carpetas**: `XX_Nombre/` (numeradas + guiones bajos)
- **Enlaces**: Texto descriptivo, no URLs crudas

---

## 📊 **Flujos de Navegación**

### **Flujo Académico (Evaluadores TFG)**
```
README.md → Contexto.md → Objetivos.md → Análisis-Diseño → 
Desarrollo → Resultados → Bibliografía
```

### **Flujo Técnico (Desarrolladores)**
```
README.md → Arquitectura → API/Endpoints.md → 
Backend/Controladores.md → Frontend/Componentes.md → 
Guias/Mejores_Practicas.md
```

### **Flujo Funcional (Product Managers)**
```
README.md → MVP.md → Flujos/Flujo_Web_EYRA.md → 
Funcionalidades → Resultados/Cumplimiento_Objetivos.md
```

---

## 🏷️ **Sistema de Etiquetado**

### **Tags Principales**
- `#admin` - Funcionalidades administrativas
- `#backend` - Componentes del servidor  
- `#frontend` - Componentes de la interfaz
- `#security` - Aspectos de seguridad
- `#api` - Endpoints y servicios
- `#database` - Modelos y persistencia
- `#guide` - Guías y tutoriales
- `#academic` - Contenido académico del TFG

### **Utilización de Tags**
- Al final de cada documento relevante
- En la carpeta `Tags/` para índices temáticos
- Para búsquedas rápidas en Obsidian

---

## 🔧 **Herramientas de Soporte**

### **Obsidian Configuration** (`.config/.obsidian/`)
- **Graph view**: Visualización de relaciones entre documentos
- **Templates**: Plantillas para nuevos documentos
- **Plugins**: Navegación mejorada y preview

### **Backup System** (`.config/backups/`)
- Versiones anteriores de configuraciones
- Snapshots de la documentación en puntos clave

---

## 📈 **Métricas de la Documentación**

### **Estadísticas Actuales**
- **Archivos de documentación**: 50+ archivos
- **Secciones principales**: 7 carpetas numeradas
- **Subsecciones**: 15+ subcarpetas temáticas
- **Enlaces internos**: 100+ referencias cruzadas
- **Cobertura técnica**: Backend, Frontend, API, Testing

### **Objetivos de Calidad**
- ✅ **Navegabilidad**: Múltiples rutas de acceso
- ✅ **Completitud**: Cobertura total del proyecto
- ✅ **Mantenibilidad**: Estructura modular
- ✅ **Accesibilidad**: Adaptada a diferentes perfiles
- 🔄 **Actualización**: Sistema de versionado y fechas

---

## 🎯 **Próximos Pasos**

### **Integración Pendiente**
1. **Carpeta NEW**: Migrar contenido a estructura principal
2. **Archivos sueltos**: Mover a ubicaciones correctas
3. **Enlaces**: Actualizar referencias tras reorganización
4. **Contenido**: Completar secciones vacías

### **Mejoras Futuras**
- Automatización de índices
- Sistema de versionado de documentos
- Templates estandarizados
- Métricas de uso y navegación

---

## 📝 **Notas para Mantenimiento**

### **Al Añadir Nuevo Contenido**
1. Determinar sección correcta según flujo académico
2. Crear subcarpeta si es tema nuevo
3. Añadir enlaces desde y hacia el nuevo contenido
4. Actualizar índices relevantes
5. Añadir tags apropiados

### **Al Reorganizar**
1. Mantener referencias relativas
2. Actualizar `README.md` principal
3. Verificar enlaces rotos
4. Comunicar cambios a colaboradores

---

