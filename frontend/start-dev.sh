#!/bin/bash

# Script para iniciar servidor PHP de desarrollo
# Uso: ./start-dev.sh

echo "🚀 Iniciando servidor PHP de desarrollo..."
echo "📍 URL: http://localhost:8000"
echo "📄 Páginas disponibles:"
echo "   - http://localhost:8000/index.php?page=inicio"
echo "   - http://localhost:8000/index.php?page=catalogo"
echo "   - http://localhost:8000/index.php?page=carrito"
echo "   - http://localhost:8000/index.php?page=login"
echo "   - http://localhost:8000/index.php?page=registro"
echo "   - http://localhost:8000/index.php?page=pedidos"
echo ""
echo "⚠️  Asegúrate de que el backend esté corriendo en el puerto 3000"
echo "💡 Presiona Ctrl+C para detener el servidor"
echo ""

cd "$(dirname "$0")"
php -S localhost:8000
