@echo off
REM Script para iniciar servidor PHP de desarrollo en Windows
REM Uso: start-dev.bat

echo.
echo ========================================
echo   LUXE Store - Servidor de Desarrollo
echo ========================================
echo.
echo Iniciando servidor PHP...
echo URL: http://localhost:8000
echo.
echo Paginas disponibles:
echo   - http://localhost:8000/index.php?page=inicio
echo   - http://localhost:8000/index.php?page=catalogo
echo   - http://localhost:8000/index.php?page=carrito
echo   - http://localhost:8000/index.php?page=login
echo   - http://localhost:8000/index.php?page=registro
echo   - http://localhost:8000/index.php?page=pedidos
echo.
echo IMPORTANTE: Asegurate de que el backend este corriendo en el puerto 3000
echo Presiona Ctrl+C para detener el servidor
echo.
echo ========================================
echo.

cd /d "%~dp0"
php -S localhost:8000

pause
