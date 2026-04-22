-- Crear base de datos
CREATE DATABASE luxe_store;
\c luxe_store;

-- ============================================
-- TABLA: usuarios
-- ============================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    rol VARCHAR(20) DEFAULT 'cliente' CHECK (rol IN ('cliente', 'admin')),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: categorias
-- ============================================
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: productos
-- ============================================
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio INTEGER NOT NULL CHECK (precio > 0),
    precio_oferta INTEGER,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
    imagen_url VARCHAR(500),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    tallas VARCHAR(100),
    colores VARCHAR(200),
    marca VARCHAR(100),
    genero VARCHAR(20) CHECK (genero IN ('hombre', 'mujer', 'unisex')),
    destacado BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: carritos
-- ============================================
CREATE TABLE carritos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: items_carrito
-- ============================================
CREATE TABLE items_carrito (
    id SERIAL PRIMARY KEY,
    carrito_id INTEGER REFERENCES carritos(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    talla VARCHAR(10),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: ordenes
-- ============================================
CREATE TABLE ordenes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    total INTEGER NOT NULL,
    estado VARCHAR(30) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'enviada', 'entregada', 'cancelada')),
    direccion_envio TEXT NOT NULL,
    metodo_pago VARCHAR(50) DEFAULT 'tarjeta',
    notas TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: items_orden
-- ============================================
CREATE TABLE items_orden (
    id SERIAL PRIMARY KEY,
    orden_id INTEGER REFERENCES ordenes(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES productos(id) ON DELETE SET NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario INTEGER NOT NULL,
    talla VARCHAR(10),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_genero ON productos(genero);
CREATE INDEX idx_productos_marca ON productos(marca);
CREATE INDEX idx_productos_destacado ON productos(destacado);
CREATE INDEX idx_items_carrito_carrito ON items_carrito(carrito_id);
CREATE INDEX idx_ordenes_usuario ON ordenes(usuario_id);
CREATE INDEX idx_items_orden_orden ON items_orden(orden_id);

-- ============================================
-- DATOS SEED: Categorías
-- ============================================
INSERT INTO categorias (nombre, descripcion) VALUES
('Deportivos', 'Zapatos para actividades deportivas y running'),
('Casuales', 'Zapatos para uso diario y casual'),
('Formales', 'Zapatos elegantes para ocasiones formales'),
('Botas', 'Botas de diferentes estilos y materiales'),
('Sandalias', 'Sandalias y zapatos abiertos');

-- ============================================
-- DATOS SEED: Productos (Precios en COP)
-- ============================================
INSERT INTO productos (nombre, descripcion, precio, precio_oferta, categoria_id, imagen_url, stock, tallas, colores, marca, genero, destacado) VALUES
(
    'Air Velocity Runner',
    'Zapatillas de running con tecnología de amortiguación avanzada. Suela de goma antideslizante y malla transpirable para máximo confort.',
    760000, 640000, 1,
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=640',
    45, '38,39,40,41,42,43,44', 'Rojo,Negro,Blanco', 'Nike', 'unisex', TRUE
),
(
    'Urban Classic Leather',
    'Zapato casual de cuero genuino con acabado premium. Perfecto para el día a día con un toque de elegancia.',
    580000, NULL, 2,
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=640',
    30, '39,40,41,42,43,44', 'Marrón,Negro,Azul', 'Clarks', 'hombre', TRUE
),
(
    'Elegance Oxford',
    'Zapato formal Oxford de cuero italiano pulido. Ideal para reuniones de negocios y eventos especiales.',
    880000, 800000, 3,
    'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=640',
    20, '39,40,41,42,43,44', 'Negro,Marrón oscuro', 'Hugo Boss', 'hombre', TRUE
),
(
    'Flex Comfort Walk',
    'Zapatillas ultra ligeras con plantilla de memory foam. Diseñadas para caminar largas distancias sin fatiga.',
    520000, 440000, 1,
    'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=640',
    60, '36,37,38,39,40,41,42', 'Gris,Rosa,Negro', 'Adidas', 'unisex', FALSE
),
(
    'Chelsea Boot Premium',
    'Bota Chelsea de cuero con elástico lateral. Estilo clásico británico con suela resistente.',
    780000, NULL, 4,
    'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=640',
    25, '39,40,41,42,43,44,45', 'Negro,Marrón,Camel', 'Dr. Martens', 'unisex', TRUE
),
(
    'Stiletto Noir',
    'Tacón alto de 10cm en cuero sintético premium. Elegancia y sofisticación para la mujer moderna.',
    700000, 600000, 3,
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=640',
    35, '35,36,37,38,39,40', 'Negro,Rojo,Nude', 'Jimmy Choo', 'mujer', TRUE
),
(
    'Sandalia Breeze',
    'Sandalia de verano con correas ajustables y suela anatómica. Comodidad tropical para tus pies.',
    360000, 280000, 5,
    'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=640',
    50, '36,37,38,39,40,41', 'Blanco,Dorado,Negro', 'Birkenstock', 'mujer', FALSE
),
(
    'Pro Court Max',
    'Zapatillas de basketball con soporte de tobillo reforzado. Tracción superior en cancha.',
    840000, 760000, 1,
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=640',
    40, '40,41,42,43,44,45,46', 'Blanco,Negro,Rojo', 'Jordan', 'hombre', TRUE
),
(
    'Loafer Suede Deluxe',
    'Mocasín de gamuza italiana con detalle de herraje dorado. Comfort premium sin cordones.',
    660000, NULL, 2,
    'https://images.unsplash.com/photo-1614252368836-526f7064e2e4?w=640',
    28, '39,40,41,42,43,44', 'Azul marino,Marrón,Burdeos', 'Gucci', 'hombre', FALSE
),
(
    'Trail Blazer X',
    'Bota de trekking impermeabilizada con Gore-Tex. Agarre extremo para terrenos difíciles.',
    940000, 800000, 4,
    'https://images.unsplash.com/photo-1520219306100-ec4afeeefe58?w=640',
    22, '38,39,40,41,42,43,44,45', 'Verde militar,Gris,Negro', 'Salomon', 'unisex', FALSE
);

-- ============================================
-- DATOS SEED: Usuario admin de prueba
-- Contraseña: admin123 (hash bcrypt)
-- ============================================
INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES
('Administrador', 'admin@luxestore.com', '$2b$10$YourHashedPasswordHere', 'admin');
