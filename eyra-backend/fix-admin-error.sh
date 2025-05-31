#!/bin/bash

echo "🔧 Aplicando corrección definitiva para error 500 en panel admin..."

# Limpiar caché de Symfony
echo "📦 Limpiando caché de desarrollo..."
php bin/console cache:clear

echo "🔄 Limpiando caché de producción..."
php bin/console cache:clear --env=prod

echo "🔄 Limpiando metadatos de Doctrine..."
php bin/console doctrine:cache:clear-metadata
php bin/console doctrine:cache:clear-query
php bin/console doctrine:cache:clear-result

echo "📊 Verificando estado de la base de datos..."
php bin/console doctrine:schema:validate

echo "✅ Corrección aplicada."
echo "🎆 CAMBIOS REALIZADOS:"
echo "   - UserRepository: Filtros híbridos SQL + PHP"
echo "   - AdminController: Simplificado y optimizado"
echo "   - Eliminado exceso de logging que causaba problemas"
echo "   - Filtro por rol ahora en PHP (100% compatible)"
echo ""
echo "🌐 Prueba el panel admin: http://localhost:5144/admin"
echo "🔍 Si persiste el error, revisa los logs: var/log/dev.log"
