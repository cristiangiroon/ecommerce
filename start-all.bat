@echo off
set BASE=%~dp0

start "Auth Service :3001" cmd /k "cd /d %BASE%backend\services\auth-service && node src/server.js"
timeout /t 1 /nobreak >nul

start "Product Service :3002" cmd /k "cd /d %BASE%backend\services\product-service && node src/server.js"
timeout /t 1 /nobreak >nul

start "Cart Service :3003" cmd /k "cd /d %BASE%backend\services\cart-service && node src/server.js"
timeout /t 1 /nobreak >nul

start "Order Service :3004" cmd /k "cd /d %BASE%backend\services\order-service && node src/server.js"
timeout /t 1 /nobreak >nul

start "Gateway :3000" cmd /k "cd /d %BASE%backend\services\gateway && node src/server.js"
timeout /t 1 /nobreak >nul

start "Frontend :8080" cmd /k "cd /d %BASE% && node static-server.js"

echo Todos los servicios iniciados.
