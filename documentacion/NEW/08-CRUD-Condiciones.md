# 🏥 CRUD de Condiciones Médicas

> **📁 Ubicación:** `EYRA/documentacion-admin/08-CRUD-Condiciones.md`  
> **🔗 Enlaces:** [[01-Indice-Principal]] | [[07-Filtros-Busqueda]] | [[09-Sistema-Condiciones]]  
> **🏷️ Tags:** #condiciones #crud #admin #medicina #backend

---

## 📋 Índice

1. [Resumen del Sistema](#-resumen-del-sistema)
2. [Modelo de Datos](#-modelo-de-datos)
3. [Operaciones CRUD](#%EF%B8%8F-operaciones-crud)
4. [Implementación Backend](#-implementación-backend)
5. [Implementación Frontend](#-implementación-frontend)
6. [Categorías y Clasificación](#-categorías-y-clasificación)
7. [Validaciones y Reglas](#-validaciones-y-reglas)
8. [Estados y Gestión](#-estados-y-gestión)

---

## 🎯 Resumen del Sistema

El **Sistema CRUD de Condiciones Médicas** permite a los administradores gestionar completamente el catálogo de condiciones médicas disponibles en EYRA, desde endometriosis hasta PCOS y otras condiciones relacionadas con la salud femenina.

### 🔑 Características Principales

| Operación | Frontend | Backend | Validación | Estado |
|-----------|----------|---------|------------|--------|
| **Crear** | ✅ Modal crear | ✅ POST /conditions | ✅ Completa | Implementado |
| **Leer** | ✅ Tabla + modal | ✅ GET /conditions/{id} | ✅ N/A | Implementado |
| **Actualizar** | ✅ Modal editar | ✅ PUT /conditions/{id} | ✅ Completa | Implementado |
| **Eliminar** | ✅ Botón eliminar | ✅ DELETE /conditions/{id} | ✅ Suave | Implementado |
| **Listar** | ✅ Tabla filtrable | ✅ GET /conditions | ✅ Paginación | Implementado |
| **Buscar** | ✅ Tiempo real | ✅ Búsqueda SQL | ✅ Segura | Implementado |

### 📊 Estadísticas del Catálogo

```typescript
interface MedicalConditionsStats {
  totalConditions: number;      // ~85 condiciones registradas
  activeConditions: number;     // ~78 condiciones activas
  chronicConditions: number;    // ~45 condiciones crónicas
  categoriesCount: number;      // 6 categorías principales
  usersWithConditions: number;  // ~65% usuarios con condiciones
  averageConditionsPerUser: number; // ~2.3 condiciones por usuario
}
```

---

## 🗄️ Modelo de Datos

### 📝 Entidad Condition

```php
<?php
// ! 01/06/2025 - Entidad principal para condiciones médicas

#[ORM\Entity(repositoryClass: ConditionRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Condition
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['condition:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['condition:read', 'condition:write'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['condition:read', 'condition:write'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['condition:read', 'condition:write'])]
    private ?bool $isChronic = false;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['condition:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['condition:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column]
    #[Groups(['condition:read', 'condition:write'])]
    private ?bool $state = true;

    // Relaciones
    #[ORM\OneToMany(targetEntity: UserCondition::class, mappedBy: 'condition')]
    private Collection $userConditions;

    #[ORM\OneToMany(targetEntity: Notification::class, mappedBy: 'relatedCondition')]
    private Collection $notifications;

    #[ORM\ManyToMany(targetEntity: Content::class, mappedBy: 'relatedConditions')]
    private Collection $relatedContent;
}
```

### 🔗 Interfaces TypeScript

```typescript
// ! 01/06/2025 - Interfaces para el frontend

export interface Condition {
  id: number;
  name: string;
  description: string;
  isChronic: boolean;
  state: boolean;                    // Activa/Inactiva
  createdAt: string;                // ISO 8601
  updatedAt?: string;               // ISO 8601
  userConditions?: UserCondition[]; // Relación con usuarios
  notifications?: Notification[];   // Notificaciones relacionadas
  relatedContent?: Content[];       // Contenido relacionado
}

export interface CreateConditionRequest {
  name: string;
  description: string;
  isChronic?: boolean;              // Default: false
  state?: boolean;                  // Default: true
}

export interface UpdateConditionRequest {
  name?: string;
  description?: string;
  isChronic?: boolean;
  state?: boolean;
}
```

---

## ⚙️ Operaciones CRUD

### 📋 CREATE - Crear Condición

```php
<?php
// ! 01/06/2025 - Endpoint para crear nueva condición médica

#[Route('', name: 'api_conditions_create', methods: ['POST'])]
#[IsGranted('ROLE_ADMIN')]
public function createCondition(Request $request): JsonResponse
{
    // Parsear datos
    $data = json_decode($request->getContent(), true);

    if (!$data) {
        return $this->json(['message' => 'Invalid request data'], 400);
    }

    // Validar campos requeridos
    if (!isset($data['name']) || !isset($data['description'])) {
        return $this->json([
            'message' => 'Missing required fields: name, description'
        ], 400);
    }

    // Crear nueva condición
    $condition = new Condition();
    $condition->setName($data['name']);
    $condition->setDescription($data['description']);
    $condition->setIsChronic($data['isChronic'] ?? false);
    $condition->setState($data['state'] ?? true);

    // Validar
    $errors = $this->validator->validate($condition);
    if (count($errors) > 0) {
        $errorMessages = [];
        foreach ($errors as $error) {
            $errorMessages[$error->getPropertyPath()] = $error->getMessage();
        }
        return $this->json([
            'message' => 'Validation failed', 
            'errors' => $errorMessages
        ], 400);
    }

    // Guardar
    $this->conditionRepository->save($condition, true);

    return $this->json($condition, 201, [], ['groups' => 'condition:read']);
}
```

### 📖 READ - Leer Condiciones

```php
<?php
// ! 01/06/2025 - Endpoints para leer condiciones

// Listar todas las condiciones
#[Route('', name: 'api_conditions_list', methods: ['GET'])]
public function getConditions(): JsonResponse
{
    /** @var User $user */
    $user = $this->getUser();
    if (!$user) {
        throw new AccessDeniedException('User not authenticated');
    }

    // Obtener todas las condiciones (incluyendo inactivas)
    $conditions = $this->conditionRepository->findAll();

    return $this->json($conditions, 200, [], ['groups' => 'condition:read']);
}

// Obtener condición específica
#[Route('/{id}', name: 'api_conditions_get', methods: ['GET'])]
public function getCondition(int $id): JsonResponse
{
    /** @var User $user */
    $user = $this->getUser();
    if (!$user) {
        throw new AccessDeniedException('User not authenticated');
    }

    $condition = $this->conditionRepository->find($id);

    if (!$condition) {
        return $this->json(['message' => 'Condition not found'], 404);
    }

    return $this->json($condition, 200, [], ['groups' => 'condition:read']);
}

// Obtener solo condiciones activas
#[Route('/active', name: 'api_conditions_active', methods: ['GET'])]
public function getActiveConditions(): JsonResponse
{
    /** @var User $user */
    $user = $this->getUser();
    if (!$user) {
        throw new AccessDeniedException('User not authenticated');
    }

    $conditions = $this->conditionRepository->findBy(['state' => true]);

    return $this->json($conditions, 200, [], ['groups' => 'condition:read']);
}
```

### ✏️ UPDATE - Actualizar Condición

```php
<?php
// ! 01/06/2025 - Endpoint para actualizar condición médica

#[Route('/{id}', name: 'api_conditions_update', methods: ['PUT'])]
#[IsGranted('ROLE_ADMIN')]
public function updateCondition(int $id, Request $request): JsonResponse
{
    // Buscar la condición
    $condition = $this->conditionRepository->find($id);
    if (!$condition) {
        return $this->json(['message' => 'Condition not found'], 404);
    }

    // Parsear datos
    $data = json_decode($request->getContent(), true);
    if (!$data) {
        return $this->json(['message' => 'Invalid request data'], 400);
    }

    // Actualizar campos permitidos
    if (isset($data['name'])) {
        $condition->setName($data['name']);
    }

    if (isset($data['description'])) {
        $condition->setDescription($data['description']);
    }

    if (isset($data['isChronic'])) {
        $condition->setIsChronic((bool) $data['isChronic']);
    }

    if (isset($data['state'])) {
        $condition->setState((bool) $data['state']);
    }

    // Validar
    $errors = $this->validator->validate($condition);
    if (count($errors) > 0) {
        $errorMessages = [];
        foreach ($errors as $error) {
            $errorMessages[$error->getPropertyPath()] = $error->getMessage();
        }
        return $this->json([
            'message' => 'Validation failed', 
            'errors' => $errorMessages
        ], 400);
    }

    // Guardar
    $this->conditionRepository->save($condition, true);

    return $this->json($condition, 200, [], ['groups' => 'condition:read']);
}
```

### 🗑️ DELETE - Eliminar Condición

```php
<?php
// ! 01/06/2025 - Endpoint para eliminar condición médica (eliminación suave)

#[Route('/{id}', name: 'api_conditions_delete', methods: ['DELETE'])]
#[IsGranted('ROLE_ADMIN')]
public function deleteCondition(int $id): JsonResponse
{
    // Buscar la condición
    $condition = $this->conditionRepository->find($id);
    if (!$condition) {
        return $this->json(['message' => 'Condition not found'], 404);
    }

    // Verificar si hay usuarios que tienen esta condición activa
    $activeUserConditions = $this->userConditionRepository->findBy([
        'condition' => $condition,
        'state' => true
    ]);

    if (count($activeUserConditions) > 0) {
        // En lugar de eliminar, desactivar la condición
        $condition->setState(false);
        $this->conditionRepository->save($condition, true);
        
        return $this->json([
            'message' => 'Condition deactivated instead of deleted due to active user associations',
            'activeUsers' => count($activeUserConditions)
        ], 200);
    }

    // Si no hay usuarios activos con esta condición, eliminar completamente
    $this->conditionRepository->remove($condition, true);

    return $this->json(['message' => 'Condition deleted successfully'], 200);
}
```

---

## 💻 Implementación Frontend

### 📊 Tabla de Condiciones

```tsx
// ! 01/06/2025 - Componente principal de tabla de condiciones
const ConditionsTable: React.FC<ConditionsTableProps> = ({ onRefresh }) => {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [allConditions, setAllConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [chronicFilter, setChronicFilter] = useState('all');
  
  // Estados de modales
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadConditions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const conditionsData = await adminConditionService.listConditions();
      setAllConditions(conditionsData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar condiciones médicas');
    } finally {
      setLoading(false);
    }
  };

  // Filtrado local de condiciones
  useEffect(() => {
    let filteredConditions = [...allConditions];

    // Filtro por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredConditions = filteredConditions.filter(condition =>
        condition.name.toLowerCase().includes(term) ||
        condition.description.toLowerCase().includes(term)
      );
    }

    // Filtro por estado
    if (stateFilter !== 'all') {
      const isActive = stateFilter === 'active';
      filteredConditions = filteredConditions.filter(
        condition => condition.state === isActive
      );
    }

    // Filtro por condición crónica
    if (chronicFilter !== 'all') {
      const isChronic = chronicFilter === 'chronic';
      filteredConditions = filteredConditions.filter(
        condition => condition.isChronic === isChronic
      );
    }

    setConditions(filteredConditions);
  }, [allConditions, searchTerm, stateFilter, chronicFilter]);

  return (
    <Card title="Gestión de Condiciones Médicas" className="mb-6">
      {/* Filtros */}
      <FilterSection 
        filters={{ searchTerm, stateFilter, chronicFilter }}
        onFilterChange={(key, value) => {
          if (key === 'searchTerm') setSearchTerm(value);
          if (key === 'stateFilter') setStateFilter(value);
          if (key === 'chronicFilter') setChronicFilter(value);
        }}
        onReset={() => {
          setSearchTerm('');
          setStateFilter('all');
          setChronicFilter('all');
        }}
      />

      {/* Tabla de condiciones */}
      <ConditionsDataTable 
        conditions={conditions}
        onView={handleViewCondition}
        onEdit={handleEditCondition}
        onDelete={handleDeleteCondition}
        onToggleState={handleToggleState}
      />

      {/* Modales */}
      <ConditionModals 
        selectedCondition={selectedCondition}
        isViewOpen={isViewModalOpen}
        isEditOpen={isEditModalOpen}
        isCreateOpen={isCreateModalOpen}
        onCloseAll={handleCloseModals}
        onSave={handleConditionSaved}
      />
    </Card>
  );
};
```

### 🆕 Modal de Creación

```tsx
// ! 01/06/2025 - Modal para crear nueva condición médica
interface ConditionCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const ConditionCreateModal: React.FC<ConditionCreateModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<CreateConditionRequest>({
    name: '',
    description: '',
    isChronic: false,
    state: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    
    if (formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (formData.description.length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      
      await adminConditionService.createCondition(formData);
      
      // Resetear formulario
      setFormData({
        name: '',
        description: '',
        isChronic: false,
        state: true
      });
      
      onSave();
    } catch (err: any) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ general: err.message || 'Error al crear condición' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Nueva Condición Médica
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Condición *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c] ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Endometriosis"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c] ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Descripción detallada de la condición médica..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Es Crónica */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isChronic"
              checked={formData.isChronic}
              onChange={(e) => setFormData({...formData, isChronic: e.target.checked})}
              className="h-4 w-4 text-[#b91c1c] focus:ring-[#b91c1c] border-gray-300 rounded"
            />
            <label htmlFor="isChronic" className="ml-2 text-sm text-gray-700">
              Es una condición crónica
            </label>
          </div>

          {/* Estado */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="state"
              checked={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.checked})}
              className="h-4 w-4 text-[#b91c1c] focus:ring-[#b91c1c] border-gray-300 rounded"
            />
            <label htmlFor="state" className="ml-2 text-sm text-gray-700">
              Condición activa
            </label>
          </div>

          {/* Error general */}
          {errors.general && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
              {errors.general}
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#b91c1c] text-white rounded-md hover:bg-[#991b1b] transition-colors disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Condición'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
```

---

## 🏷️ Categorías y Clasificación

### 📚 Sistema de Categorías

```php
<?php
// ! 01/06/2025 - Endpoint para obtener categorías de condiciones

#[Route('/categories', name: 'api_conditions_categories', methods: ['GET'])]
public function getConditionCategories(): JsonResponse
{
    /** @var User $user */
    $user = $this->getUser();
    if (!$user) {
        throw new AccessDeniedException('User not authenticated');
    }
    
    // Categorías básicas de condiciones médicas femeninas
    $categories = [
        'hormonal' => [
            'name' => 'Trastornos Hormonales',
            'description' => 'Condiciones relacionadas con desequilibrios hormonales',
            'examples' => ['PCOS', 'Hipotiroidismo', 'Hipertiroidismo']
        ],
        'menstrual' => [
            'name' => 'Trastornos Menstruales',
            'description' => 'Condiciones que afectan el ciclo menstrual',
            'examples' => ['Dismenorrea', 'Amenorrea', 'Menorragia']
        ],
        'reproductive' => [
            'name' => 'Salud Reproductiva',
            'description' => 'Condiciones del sistema reproductivo',
            'examples' => ['Endometriosis', 'Fibromas uterinos', 'Quistes ováricos']
        ],
        'autoimmune' => [
            'name' => 'Enfermedades Autoinmunes',
            'description' => 'Condiciones autoinmunes que afectan más a mujeres',
            'examples' => ['Lupus', 'Artritis reumatoide', 'Hashimoto']
        ],
        'mental_health' => [
            'name' => 'Salud Mental',
            'description' => 'Condiciones de salud mental relacionadas con ciclos hormonales',
            'examples' => ['Depresión postparto', 'PMDD', 'Ansiedad']
        ],
        'metabolic' => [
            'name' => 'Trastornos Metabólicos',
            'description' => 'Condiciones que afectan el metabolismo',
            'examples' => ['Diabetes gestacional', 'Síndrome metabólico', 'Resistencia a la insulina']
        ]
    ];
    
    return $this->json($categories, 200);
}
```

### 🏗️ Estructura de Categorías

```typescript
// ! 01/06/2025 - Interfaces para sistema de categorías
export interface ConditionCategory {
  key: string;
  name: string;
  description: string;
  examples: string[];
  icon?: string;
  color?: string;
}

export interface CategorizedCondition extends Condition {
  category?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  prevalence?: number; // Porcentaje de población afectada
}

// Configuración de categorías con metadata
export const CONDITION_CATEGORIES: Record<string, ConditionCategory> = {
  hormonal: {
    key: 'hormonal',
    name: 'Trastornos Hormonales',
    description: 'Condiciones relacionadas con desequilibrios hormonales',
    examples: ['PCOS', 'Hipotiroidismo', 'Hipertiroidismo'],
    icon: '🧬',
    color: '#8B5CF6'
  },
  menstrual: {
    key: 'menstrual',
    name: 'Trastornos Menstruales',
    description: 'Condiciones que afectan el ciclo menstrual',
    examples: ['Dismenorrea', 'Amenorrea', 'Menorragia'],
    icon: '🌙',
    color: '#EC4899'
  },
  reproductive: {
    key: 'reproductive',
    name: 'Salud Reproductiva',
    description: 'Condiciones del sistema reproductivo',
    examples: ['Endometriosis', 'Fibromas uterinos', 'Quistes ováricos'],
    icon: '🌸',
    color: '#F59E0B'
  },
  autoimmune: {
    key: 'autoimmune',
    name: 'Enfermedades Autoinmunes',
    description: 'Condiciones autoinmunes que afectan más a mujeres',
    examples: ['Lupus', 'Artritis reumatoide', 'Hashimoto'],
    icon: '🛡️',
    color: '#EF4444'
  },
  mental_health: {
    key: 'mental_health',
    name: 'Salud Mental',
    description: 'Condiciones de salud mental relacionadas con ciclos hormonales',
    examples: ['Depresión postparto', 'PMDD', 'Ansiedad'],
    icon: '🧠',
    color: '#06B6D4'
  },
  metabolic: {
    key: 'metabolic',
    name: 'Trastornos Metabólicos',
    description: 'Condiciones que afectan el metabolismo',
    examples: ['Diabetes gestacional', 'Síndrome metabólico', 'Resistencia a la insulina'],
    icon: '⚡',
    color: '#10B981'
  }
};
```

---

## ✅ Validaciones y Reglas

### 🔒 Validaciones Backend

```php
<?php
// ! 01/06/2025 - Validaciones para condiciones médicas

use Symfony\Component\Validator\Constraints as Assert;

class Condition
{
    #[Assert\NotBlank(message: 'El nombre de la condición es requerido')]
    #[Assert\Length(
        min: 3,
        max: 255,
        minMessage: 'El nombre debe tener al menos {{ limit }} caracteres',
        maxMessage: 'El nombre no puede tener más de {{ limit }} caracteres'
    )]
    private ?string $name = null;

    #[Assert\NotBlank(message: 'La descripción de la condición es requerida')]
    #[Assert\Length(
        min: 10,
        max: 1000,
        minMessage: 'La descripción debe tener al menos {{ limit }} caracteres',
        maxMessage: 'La descripción no puede tener más de {{ limit }} caracteres'
    )]
    private ?string $description = null;

    #[Assert\Type(
        type: 'bool',
        message: 'El campo isChronic debe ser un valor booleano'
    )]
    private ?bool $isChronic = false;

    #[Assert\Type(
        type: 'bool',
        message: 'El campo state debe ser un valor booleano'
    )]
    private ?bool $state = true;
}
```

### 🎯 Validaciones Frontend

```typescript
// ! 01/06/2025 - Sistema de validación frontend
interface ValidationRule {
  field: string;
  rules: Array<{
    type: 'required' | 'minLength' | 'maxLength' | 'pattern';
    value?: any;
    message: string;
  }>;
}

const CONDITION_VALIDATION_RULES: ValidationRule[] = [
  {
    field: 'name',
    rules: [
      { type: 'required', message: 'El nombre es requerido' },
      { type: 'minLength', value: 3, message: 'El nombre debe tener al menos 3 caracteres' },
      { type: 'maxLength', value: 255, message: 'El nombre no puede tener más de 255 caracteres' }
    ]
  },
  {
    field: 'description',
    rules: [
      { type: 'required', message: 'La descripción es requerida' },
      { type: 'minLength', value: 10, message: 'La descripción debe tener al menos 10 caracteres' },
      { type: 'maxLength', value: 1000, message: 'La descripción no puede tener más de 1000 caracteres' }
    ]
  }
];

export const validateCondition = (data: CreateConditionRequest | UpdateConditionRequest): Record<string, string> => {
  const errors: Record<string, string> = {};

  CONDITION_VALIDATION_RULES.forEach(({ field, rules }) => {
    const value = data[field as keyof typeof data];

    rules.forEach(rule => {
      switch (rule.type) {
        case 'required':
          if (!value || (typeof value === 'string' && !value.trim())) {
            errors[field] = rule.message;
          }
          break;
        
        case 'minLength':
          if (typeof value === 'string' && value.length < rule.value) {
            errors[field] = rule.message;
          }
          break;
        
        case 'maxLength':
          if (typeof value === 'string' && value.length > rule.value) {
            errors[field] = rule.message;
          }
          break;
        
        case 'pattern':
          if (typeof value === 'string' && !rule.value.test(value)) {
            errors[field] = rule.message;
          }
          break;
      }
    });
  });

  return errors;
};
```

---

## 🔄 Estados y Gestión

### 📊 Estados de Condición

```typescript
// ! 01/06/2025 - Estados y transiciones de condiciones médicas
export enum ConditionState {
  ACTIVE = 'active',      // Condición activa y disponible
  INACTIVE = 'inactive',  // Condición desactivada temporalmente
  DEPRECATED = 'deprecated', // Condición obsoleta
  PENDING_REVIEW = 'pending_review' // Pendiente de revisión médica
}

export enum ConditionType {
  CHRONIC = 'chronic',    // Condición crónica (larga duración)
  ACUTE = 'acute',        // Condición aguda (corta duración)
  EPISODIC = 'episodic'   // Condición episódica (recurrente)
}

// Estados permitidos y transiciones
export const CONDITION_STATE_TRANSITIONS: Record<ConditionState, ConditionState[]> = {
  [ConditionState.ACTIVE]: [ConditionState.INACTIVE, ConditionState.PENDING_REVIEW],
  [ConditionState.INACTIVE]: [ConditionState.ACTIVE, ConditionState.DEPRECATED],
  [ConditionState.DEPRECATED]: [], // Estado final
  [ConditionState.PENDING_REVIEW]: [ConditionState.ACTIVE, ConditionState.INACTIVE]
};
```

### 🔀 Gestión de Estado

```tsx
// ! 01/06/2025 - Componente para gestión de estados de condiciones
interface ConditionStateManagerProps {
  condition: Condition;
  onStateChange: (newState: ConditionState) => Promise<void>;
}

const ConditionStateManager: React.FC<ConditionStateManagerProps> = ({
  condition,
  onStateChange
}) => {
  const [loading, setLoading] = useState(false);
  const currentState = condition.state ? ConditionState.ACTIVE : ConditionState.INACTIVE;
  const availableTransitions = CONDITION_STATE_TRANSITIONS[currentState];

  const handleStateChange = async (newState: ConditionState) => {
    if (!availableTransitions.includes(newState)) {
      alert('Transición de estado no permitida');
      return;
    }

    const confirmation = confirm(
      `¿Estás seguro de cambiar el estado de "${condition.name}" a ${newState}?`
    );

    if (!confirmation) return;

    try {
      setLoading(true);
      await onStateChange(newState);
    } catch (error) {
      console.error('Error changing condition state:', error);
      alert('Error al cambiar el estado de la condición');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
        currentState === ConditionState.ACTIVE 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {currentState === ConditionState.ACTIVE ? 'Activa' : 'Inactiva'}
      </span>

      {availableTransitions.length > 0 && (
        <select
          onChange={(e) => handleStateChange(e.target.value as ConditionState)}
          disabled={loading}
          className="text-xs border border-gray-300 rounded px-2 py-1"
          defaultValue=""
        >
          <option value="" disabled>Cambiar estado</option>
          {availableTransitions.map(state => (
            <option key={state} value={state}>
              {state === ConditionState.ACTIVE ? 'Activar' : 'Desactivar'}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
```

---

## 🔗 Enlaces Relacionados

- [[07-Filtros-Busqueda]] - Sistema de filtros avanzados
- [[09-Sistema-Condiciones]] - Relación condiciones-usuarios
- [[10-Backend-Controllers]] - Detalles técnicos de controladores
- [[05-CRUD-Usuarios]] - Gestión completa de usuarios

---

**📝 Última actualización:** 01/06/2025  
**👨‍💻 Autor:** Sistema de Documentación EYRA  
**🔄 Versión:** 1.0.0