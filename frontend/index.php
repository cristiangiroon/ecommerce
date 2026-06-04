<?php
/**
 * LUXE Store - E-commerce de Calzado Premium
 * Archivo principal de enrutamiento
 */

// Obtener la página solicitada
$page = $_GET['page'] ?? 'inicio';

// Lista de páginas permitidas
$allowed_pages = [
    'inicio',
    'catalogo',
    'detalle',
    'carrito',
    'checkout',
    'login',
    'registro',
    'pedidos'
];

// Validar que la página existe
if (!in_array($page, $allowed_pages)) {
    $page = 'inicio';
}

// Definir títulos personalizados por página
$pageTitles = [
    'inicio' => 'LUXE Store - Calzado Premium',
    'catalogo' => 'Catálogo - LUXE Store',
    'detalle' => 'Detalle del Producto - LUXE Store',
    'carrito' => 'Carrito de Compras - LUXE Store',
    'checkout' => 'Finalizar Compra - LUXE Store',
    'login' => 'Iniciar Sesión - LUXE Store',
    'registro' => 'Crear Cuenta - LUXE Store',
    'pedidos' => 'Mis Pedidos - LUXE Store'
];

$pageTitle = $pageTitles[$page] ?? 'LUXE Store';

// Incluir componentes y página solicitada
include 'includes/head.php';
include 'includes/header.php';
include "pages/{$page}.php";
include 'includes/footer.php';
include 'includes/scripts.php';
?>
