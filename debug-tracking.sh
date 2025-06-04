#!/bin/bash

echo "=== EYRA TRACKING DEBUG SCRIPT ==="
echo "Diagnosticando errores 404/405 en tracking..."
echo

# URL base (cambia según tu entorno)
BASE_URL="https://eyraclub.es/api"

echo "1. Probando endpoint de salud..."
curl -s "$BASE_URL/health" | jq . || echo "Error en health check"
echo

echo "2. Probando rutas de debug..."
curl -s "$BASE_URL/debug/error-info" | jq . || echo "Error en debug endpoints"
echo

echo "3. Probando rutas alternativas de tracking..."
echo "   - Testing tracking status..."
curl -s -H "Authorization: Bearer YOUR_JWT_TOKEN" "$BASE_URL/tracking/status" | jq . || echo "Error en tracking status"
echo

echo "   - Testing tracking companions..."
curl -s -H "Authorization: Bearer YOUR_JWT_TOKEN" "$BASE_URL/tracking/companions" | jq . || echo "Error en tracking companions"
echo

echo "   - Testing tracking following..."
curl -s -H "Authorization: Bearer YOUR_JWT_TOKEN" "$BASE_URL/tracking/following" | jq . || echo "Error en tracking following"
echo

echo "   - Testing tracking invitations..."
curl -s -H "Authorization: Bearer YOUR_JWT_TOKEN" "$BASE_URL/tracking/invitations" | jq . || echo "Error en tracking invitations"
echo

echo "4. Probando rutas originales problemáticas..."
echo "   - Testing guests/companions (problematic)..."
curl -s -H "Authorization: Bearer YOUR_JWT_TOKEN" "$BASE_URL/guests/companions" | jq . || echo "ERROR: guests/companions no funciona"
echo

echo "   - Testing invitation-codes (problematic)..."
curl -s -H "Authorization: Bearer YOUR_JWT_TOKEN" "$BASE_URL/invitation-codes" | jq . || echo "ERROR: invitation-codes no funciona"
echo

echo "=== FIN DEL DIAGNÓSTICO ==="
echo
echo "SOLUCIONES APLICADAS:"
echo "1. Controladores alternativos creados:"
echo "   - /api/tracking/companions (reemplaza /api/guests/companions)"
echo "   - /api/tracking/following (reemplaza /api/guests/following)"
echo "   - /api/tracking/invitations (reemplaza /api/invitation-codes)"
echo "   - /api/tracking/notifications-count (reemplaza /api/user/notifications/count)"
echo
echo "2. Frontend actualizado para usar rutas alternativas"
echo
echo "3. Endpoints de debug disponibles:"
echo "   - /api/debug/test-guests"
echo "   - /api/debug/test-invitations"
echo "   - /api/debug/test-notifications"
echo
echo "PARA PROBAR MANUALMENTE:"
echo "1. Ve a la consola del navegador"
echo "2. Ejecuta: DEBUG_API_ROUTES()"
echo "3. Verifica que las nuevas rutas funcionan"
