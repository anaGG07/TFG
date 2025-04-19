#!/bin/bash

echo "=== Verificación de URLs en archivos compilados ==="
echo "Buscando referencias a localhost:8000..."

LOCALHOST_REFS=$(grep -r "localhost:8000" ./eyra-frontend/dist/ || echo "No se encontraron referencias")

if [[ $LOCALHOST_REFS == *"localhost:8000"* ]]; then
  echo "⚠️ ¡ATENCIÓN! Se encontraron referencias a localhost:8000 en los archivos compilados:"
  echo "$LOCALHOST_REFS"
  echo ""
  echo "Ejecutando corrección automática..."
  
  # Aplicar la corrección
  find ./eyra-frontend/dist -type f -name "*.js" -exec sed -i 's|http://localhost:8000|https://eyraclub.es|g' {} \;
  
  # Verificar de nuevo
  LOCALHOST_REFS_AFTER=$(grep -r "localhost:8000" ./eyra-frontend/dist/ || echo "No se encontraron referencias")
  
  if [[ $LOCALHOST_REFS_AFTER == *"localhost:8000"* ]]; then
    echo "❌ La corrección automática falló. Todavía hay referencias:"
    echo "$LOCALHOST_REFS_AFTER"
  else
    echo "✅ Corrección aplicada exitosamente. No quedan referencias a localhost:8000."
  fi
else
  echo "✅ Todo correcto. No se encontraron referencias a localhost:8000."
fi

echo ""
echo "Verificando que las URLs de API estén correctamente configuradas..."
grep -r "eyraclub.es/api" ./eyra-frontend/dist/ | head -5

echo ""
echo "=== Verificación completada ==="
