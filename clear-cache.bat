@echo off
echo Limpiando cache de Symfony...
cd "C:\Users\Ana\Desktop\Curso\Proyecto\EYRA\eyra-backend"

echo Limpiando cache del entorno dev...
php bin/console cache:clear --env=dev

echo Limpiando cache del entorno prod...
php bin/console cache:clear --env=prod

echo Reconstruyendo contenedor...
php bin/console cache:warmup --env=prod

echo Verificando rutas...
php bin/console debug:router | findstr /i guest

pause
