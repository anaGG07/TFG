# Corrección de Cálculo de Fechas en Backend - 08/06/2025

## Problema Identificado

El backend estaba devolviendo fechas de fin incorrectas que incluían un día extra. Por ejemplo:
- **Esperado**: Periodo de 5 días del 2025-06-01 al 2025-06-05
- **Devolvía**: Periodo del 2025-06-01 al 2025-06-06 (6 días)

## Causa Raíz

El problema estaba en **3 lugares específicos** del archivo `CycleCalculatorService.php`:

### 1. Método `predictNextCycle` (Línea 98-99)
```php
// INCORRECTO
$nextEndDate = (new \DateTime($nextStartDate->format('Y-m-d')))->modify("+{$predictedDuration} days");

// CORREGIDO
$nextEndDate = (new \DateTime($nextStartDate->format('Y-m-d')))->modify("+" . ($predictedDuration - 1) . " days");
```

### 2. Método `generatePredictionsForRange` (Línea 362)
```php
// INCORRECTO
$lastRealDate = (clone $cycle->getStartDate())->modify("+{$estimatedDuration} days");

// CORREGIDO  
$lastRealDate = (clone $cycle->getStartDate())->modify("+" . ($estimatedDuration - 1) . " days");
```

### 3. Método `generatePredictionsForRange` (Línea 414)
```php
// INCORRECTO
$existingEnd = $existingCycle->getEndDate() ?? 
    (clone $existingStart)->modify('+' . ($existingCycle->getAverageDuration() ?? 5) . ' days');

// CORREGIDO
$existingEnd = $existingCycle->getEndDate() ?? 
    (clone $existingStart)->modify('+' . (($existingCycle->getAverageDuration() ?? 5) - 1) . ' days');
```

## Explicación del Problema

### Lógica de Duración Inclusiva vs Exclusiva

En el contexto de fechas menstruales:
- **Inicio**: 2025-06-01 (Día 1)
- **Duración**: 5 días
- **Días**: 1, 2, 3, 4, 5
- **Fechas**: 2025-06-01, 2025-06-02, 2025-06-03, 2025-06-04, 2025-06-05
- **Fin**: 2025-06-05 (Día 5)

### Cálculo Correcto
```php
$startDate = new DateTime('2025-06-01');
$duration = 5;
$endDate = (clone $startDate)->modify('+' . ($duration - 1) . ' days');
// Resultado: 2025-06-05 ✅
```

### Cálculo Incorrecto (Anterior)
```php
$startDate = new DateTime('2025-06-01');
$duration = 5;
$endDate = (clone $startDate)->modify('+' . $duration . ' days');
// Resultado: 2025-06-06 ❌ (6 días en total)
```

## Archivos Modificados

- `C:\Users\Ana\Desktop\Curso\Proyecto\EYRA\eyra-backend\src\Service\CycleCalculatorService.php`

## Impacto de la Corrección

1. **Frontend**: Los datos del calendario ahora mostrarán la cantidad correcta de días
2. **Predicciones**: Las predicciones futuras tendrán las fechas correctas
3. **Solapamientos**: Se evitarán falsos positivos de solapamiento entre ciclos
4. **Consistencia**: Todo el sistema usará la misma lógica de cálculo inclusivo

## Verificación

Para verificar que la corrección funciona:

1. Crear un nuevo ciclo con duración de 5 días
2. Verificar que la respuesta del API devuelva exactamente 5 días
3. Comprobar que las predicciones futuras tengan duraciones correctas
4. Confirmar que el frontend muestre los días correctos sin duplicados

## Notas Técnicas

- La corrección mantiene compatibilidad total con el frontend existente
- No se requieren cambios en la base de datos
- El método `startNewCycle` ya tenía el cálculo correcto con `($menstrualDuration - 1)`
- Esta corrección alinea todo el sistema con la misma lógica inclusiva
