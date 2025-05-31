#!/bin/bash

# ! 31/05/2025 - Script para limpiar caché y aplicar cambios de rutas

echo "🔄 Limpiando caché de Symfony..."

# Ir al directorio del backend
cd eyra-backend

# Limpiar caché
php bin/console cache:clear --env=prod
php bin/console cache:clear --env=dev

# Mostrar rutas de admin para verificar
echo "📋 Rutas de administración disponibles:"
php bin/console debug:router | grep admin

echo "✅ Caché limpiada. Las rutas de administración deberían estar disponibles en:"
echo "   - GET    /api/admin/users"
echo "   - GET    /api/admin/users/{id}"  
echo "   - PUT    /api/admin/users/{id}"
echo "   - DELETE /api/admin/users/{id}"
