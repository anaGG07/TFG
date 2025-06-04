Write-Host "=== EYRA TRACKING DEBUG SCRIPT ===" -ForegroundColor Green
Write-Host "Diagnosticando errores 404/405 en tracking..." -ForegroundColor Yellow
Write-Host

# URL base (cambia según tu entorno)
$BASE_URL = "https://eyraclub.es/api"

Write-Host "1. Probando endpoint de salud..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/health" -Method Get
    $response | ConvertTo-Json
} catch {
    Write-Host "Error en health check: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host

Write-Host "2. Probando rutas de debug..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/debug/error-info" -Method Get
    $response | ConvertTo-Json
} catch {
    Write-Host "Error en debug endpoints: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host

Write-Host "3. Probando rutas alternativas de tracking..." -ForegroundColor Cyan
$token = Read-Host "Ingresa tu JWT token (o presiona Enter para omitir tests autenticados)"

if ($token) {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    Write-Host "   - Testing tracking status..." -ForegroundColor White
    try {
        $response = Invoke-RestMethod -Uri "$BASE_URL/tracking/status" -Method Get -Headers $headers
        $response | ConvertTo-Json
    } catch {
        Write-Host "Error en tracking status: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "   - Testing tracking companions..." -ForegroundColor White
    try {
        $response = Invoke-RestMethod -Uri "$BASE_URL/tracking/companions" -Method Get -Headers $headers
        $response | ConvertTo-Json
    } catch {
        Write-Host "Error en tracking companions: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "   - Testing tracking following..." -ForegroundColor White
    try {
        $response = Invoke-RestMethod -Uri "$BASE_URL/tracking/following" -Method Get -Headers $headers
        $response | ConvertTo-Json
    } catch {
        Write-Host "Error en tracking following: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "   - Testing tracking invitations..." -ForegroundColor White
    try {
        $response = Invoke-RestMethod -Uri "$BASE_URL/tracking/invitations" -Method Get -Headers $headers
        $response | ConvertTo-Json
    } catch {
        Write-Host "Error en tracking invitations: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Tests autenticados omitidos (no se proporcionó token)" -ForegroundColor Yellow
}

Write-Host
Write-Host "=== FIN DEL DIAGNÓSTICO ===" -ForegroundColor Green
Write-Host
Write-Host "SOLUCIONES APLICADAS:" -ForegroundColor Yellow
Write-Host "1. Controladores alternativos creados:" -ForegroundColor White
Write-Host "   - /api/tracking/companions (reemplaza /api/guests/companions)" -ForegroundColor Gray
Write-Host "   - /api/tracking/following (reemplaza /api/guests/following)" -ForegroundColor Gray
Write-Host "   - /api/tracking/invitations (reemplaza /api/invitation-codes)" -ForegroundColor Gray
Write-Host "   - /api/tracking/notifications-count (reemplaza /api/user/notifications/count)" -ForegroundColor Gray
Write-Host
Write-Host "2. Frontend actualizado para usar rutas alternativas" -ForegroundColor White
Write-Host
Write-Host "3. Endpoints de debug disponibles:" -ForegroundColor White
Write-Host "   - /api/debug/test-guests" -ForegroundColor Gray
Write-Host "   - /api/debug/test-invitations" -ForegroundColor Gray
Write-Host "   - /api/debug/test-notifications" -ForegroundColor Gray
Write-Host
Write-Host "PARA PROBAR MANUALMENTE:" -ForegroundColor Yellow
Write-Host "1. Ve a la consola del navegador" -ForegroundColor White
Write-Host "2. Ejecuta: DEBUG_API_ROUTES()" -ForegroundColor White
Write-Host "3. Verifica que las nuevas rutas funcionan" -ForegroundColor White

Write-Host
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
