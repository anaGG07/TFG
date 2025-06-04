# ⚠️ Área Crítica: Sistema de Síntomas

/* ! 01/06/2025 - Análisis crítico del sistema de síntomas no implementado */

> **Prioridad**: 🚨 CRÍTICA  
> **Impacto**: Alto - Funcionalidad core faltante  
> **Esfuerzo**: Medio (2-3 semanas)  
> **Estado**: No implementado (0%)

---

## 🎯 Descripción del Problema

El sistema de síntomas representa una de las **funcionalidades más críticas** de EYRA que actualmente **no está implementada**. Esta ausencia impacta significativamente la experiencia del usuario y reduce el valor de la aplicación como herramienta de seguimiento menstrual completa.

### Impacto en la Experiencia de Usuario

- **Seguimiento Incompleto**: Los usuarios no pueden registrar síntomas diarios
- **Análisis Limitado**: Sin datos de síntomas, las correlaciones y predicciones son básicas
- **Valor Reducido**: La aplicación no cumple las expectativas de seguimiento integral
- **Competitividad**: Desventaja frente a aplicaciones establecidas del mercado

---

## 📊 Análisis de la Problemática

### Estado Actual vs Esperado

| Aspecto | Actual | Esperado | Gap |
|---------|--------|----------|-----|
| **Endpoints API** | 0% | 6 endpoints | 100% |
| **Interface Usuario** | 0% | Formularios + visualización | 100% |
| **Base de Datos** | Estructura básica | Modelo completo | 80% |
| **Validaciones** | 0% | Frontend + Backend | 100% |
| **Documentación** | 0% | Completa | 100% |

### Funcionalidades Faltantes

```typescript
// ! 01/06/2025 - Funcionalidades del sistema de síntomas no implementadas

Registro de Síntomas:
├── ❌ Categorías de síntomas (físicos, emocionales, etc.)
├── ❌ Intensidad y frecuencia
├── ❌ Notas personalizadas
├── ❌ Timestamp preciso
└── ❌ Relación con días del ciclo

Análisis de Síntomas:
├── ❌ Patrones por fase del ciclo
├── ❌ Correlaciones entre síntomas
├── ❌ Tendencias históricas
├── ❌ Alertas por síntomas críticos
└── ❌ Exportación de datos

Visualización:
├── ❌ Gráficos de intensidad
├── ❌ Calendario con síntomas
├── ❌ Dashboard de patrones
├── ❌ Reportes personalizados
└── ❌ Comparativas temporales
```

---

## 🏗️ Arquitectura Propuesta

### Backend (Symfony)

#### Entidad Síntoma
```php
// ! 01/06/2025 - Estructura propuesta para entidad Symptom

#[ORM\Entity(repositoryClass: SymptomRepository::class)]
class Symptom
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private string $name;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 50)]
    private string $category; // physical, emotional, behavioral

    #[ORM\Column]
    private bool $isActive = true;

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;
}
```

#### Entidad Registro de Síntoma
```php
// ! 01/06/2025 - Estructura propuesta para SymptomLog

#[ORM\Entity(repositoryClass: SymptomLogRepository::class)]
class SymptomLog
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private User $user;

    #[ORM\ManyToOne(targetEntity: Symptom::class)]
    #[ORM\JoinColumn(nullable: false)]
    private Symptom $symptom;

    #[ORM\ManyToOne(targetEntity: CycleDay::class)]
    #[ORM\JoinColumn(nullable: true)]
    private ?CycleDay $cycleDay = null;

    #[ORM\Column]
    private int $intensity; // 1-5 scale

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $notes = null;

    #[ORM\Column]
    private \DateTimeImmutable $loggedAt;
}
```

### Endpoints Requeridos

```php
// ! 01/06/2025 - Endpoints del sistema de síntomas a implementar

GET    /symptoms                    // Listar categorías de síntomas
POST   /symptoms/log               // Registrar síntoma
PUT    /symptoms/log/{id}          // Actualizar síntoma registrado
DELETE /symptoms/log/{id}          // Eliminar registro de síntoma
GET    /symptoms/day/{cycleDayId}  // Síntomas por día
GET    /symptoms/stats             // Estadísticas de síntomas
```

### Frontend (React)

#### Componentes Necesarios
```typescript
// ! 01/06/2025 - Componentes React para sistema de síntomas

Components/
├── SymptomLogger/
│   ├── SymptomCategories.tsx
│   ├── IntensityScale.tsx
│   ├── SymptomForm.tsx
│   └── QuickLog.tsx
├── SymptomAnalytics/
│   ├── SymptomChart.tsx
│   ├── PatternAnalyzer.tsx
│   ├── CorrelationView.tsx
│   └── ExportData.tsx
└── SymptomCalendar/
    ├── CalendarWithSymptoms.tsx
    ├── DayDetail.tsx
    └── SymptomLegend.tsx
```

---

## 📋 Plan de Implementación

### Fase 1: Fundación (Semana 1)
```php
// ! 01/06/2025 - Fase 1 del plan de implementación

Backend:
├── ✅ Crear entidades Symptom y SymptomLog
├── ✅ Implementar repositorios
├── ✅ Configurar relaciones con User y CycleDay
├── ✅ Crear migraciones de BD
└── ✅ Implementar validaciones básicas

Frontend:
├── ✅ Crear estructura de componentes
├── ✅ Implementar formulario básico
├── ✅ Conectar con API
├── ✅ Validaciones frontend
└── ✅ Estados de loading y error
```

### Fase 2: CRUD Completo (Semana 2)
```php
// ! 01/06/2025 - Fase 2 del plan de implementación

Backend:
├── ✅ Controlador SymptomController
├── ✅ Endpoints GET /symptoms
├── ✅ Endpoints POST /symptoms/log
├── ✅ Endpoints PUT /symptoms/log/{id}
├── ✅ Endpoints DELETE /symptoms/log/{id}
├── ✅ Endpoint GET /symptoms/day/{cycleDayId}
└── ✅ Documentación OpenAPI

Frontend:
├── ✅ Integración completa con API
├── ✅ Lista de síntomas por categoría
├── ✅ Formulario de edición
├── ✅ Confirmación de eliminación
├── ✅ Vista de síntomas por día
└── ✅ Feedback visual completo
```

### Fase 3: Analytics Básico (Semana 3)
```php
// ! 01/06/2025 - Fase 3 del plan de implementación

Backend:
├── ✅ Endpoint GET /symptoms/stats
├── ✅ Cálculos de patrones
├── ✅ Correlaciones básicas
├── ✅ Agregaciones por período
└── ✅ Optimización de consultas

Frontend:
├── ✅ Gráficos de síntomas
├── ✅ Dashboard de estadísticas
├── ✅ Vista de patrones
├── ✅ Exportación básica
└── ✅ Responsive design
```

---

## 🎯 Criterios de Éxito

### Funcionales
- [ ] **Registro Completo**: Usuario puede registrar cualquier síntoma
- [ ] **Categorización**: Síntomas organizados por categorías
- [ ] **Intensidad**: Escala 1-5 para medir severidad
- [ ] **Histórico**: Visualización de síntomas pasados
- [ ] **Patrones**: Identificación de correlaciones básicas

### Técnicos
- [ ] **Performance**: Carga de síntomas < 200ms
- [ ] **Validación**: Doble validación frontend/backend
- [ ] **Responsivo**: Funciona en móvil y desktop
- [ ] **Accesibilidad**: Navegable por teclado
- [ ] **Testing**: Coverage > 80% en componentes críticos

### UX/UI
- [ ] **Intuitivo**: Registro de síntomas en < 30 segundos
- [ ] **Visual**: Feedback claro en todas las acciones
- [ ] **Consistente**: Sigue el design system de EYRA
- [ ] **Rápido**: Quick-log para síntomas frecuentes
- [ ] **Informativo**: Tooltips y ayuda contextual

---

## ⚡ Riesgos e Impedimentos

### Riesgos Técnicos
1. **Complejidad de Datos**: Múltiples relaciones y agregaciones
2. **Performance**: Consultas complejas para analytics
3. **UI/UX**: Formularios complejos sin abrumar al usuario
4. **Validación**: Balance entre flexibilidad y consistencia

### Riesgos de Proyecto
1. **Tiempo**: 3 semanas es optimista para implementación completa
2. **Scope Creep**: Tentación de agregar funcionalidades avanzadas
3. **Testing**: Sin suite de tests, riesgo de bugs en producción
4. **Dependencias**: Requiere estabilidad de CycleDay y User

### Mitigaciones
- **Desarrollo iterativo**: MVP primero, mejoras después
- **Testing manual exhaustivo**: Hasta implementar testing automatizado
- **Documentación detallada**: Para facilitar mantenimiento
- **Code review**: Revisión de código para calidad

---

## 📈 Impacto Esperado

### En la Experiencia de Usuario
- **+40%** en tiempo de sesión (más funcionalidades)
- **+60%** en valor percibido de la aplicación
- **+25%** en retención de usuarios
- **+50%** en datos útiles para predicciones

### En la Competitividad
- **Paridad** con aplicaciones líderes del mercado
- **Diferenciación** por enfoque inclusivo mantenido
- **Completitud** funcional para lanzamiento MVP
- **Base** para funcionalidades avanzadas futuras

### En el Desarrollo
- **Experiencia** completa del equipo con CRUD complejo
- **Patrones** establecidos para futuras funcionalidades
- **Arquitectura** validada con casos de uso reales
- **Confianza** en la capacidad de entrega

---

## 🔚 Conclusión

La implementación del sistema de síntomas es **absolutamente crítica** para el éxito de EYRA. Su ausencia actual representa el mayor gap funcional del producto y debe ser la **máxima prioridad** en el roadmap de desarrollo.

Con un plan bien estructurado y 3 semanas de desarrollo enfocado, es completamente viable cerrar esta brecha crítica y posicionar a EYRA como una solución completa y competitiva en el mercado de seguimiento menstrual.

---

*Análisis realizado como parte del TFG - Desarrollo de Aplicaciones Web*  
*EYRA - Aplicación de Seguimiento Menstrual v0.7.8*
