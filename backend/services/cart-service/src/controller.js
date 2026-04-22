const { poolBD } = require('../../shared/config');

/**
 * Controlador para agregar un producto al carrito
 * Maneja la lógica de crear carrito, validar stock y actualizar cantidades
 */
async function agregarItem(req, res) {
  try {
    const usuarioId = req.usuario.id; 
    const { producto_id, cantidad = 1, talla } = req.body;

    if (!producto_id) {
      return res.status(400).json({ error: 'El producto_id es obligatorio' });
    }

    const producto = await poolBD.query('SELECT * FROM productos WHERE id = $1 AND activo = TRUE', [producto_id]);
    if (producto.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (producto.rows[0].stock < cantidad) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }

    // Obtener o crear el carrito del usuario
    let carrito = await poolBD.query('SELECT id FROM carritos WHERE usuario_id = $1', [usuarioId]);
    if (carrito.rows.length === 0) {
      carrito = await poolBD.query('INSERT INTO carritos (usuario_id) VALUES ($1) RETURNING id', [usuarioId]);
    }
    const carritoId = carrito.rows[0].id;

    const existente = await poolBD.query(
      'SELECT * FROM items_carrito WHERE carrito_id = $1 AND producto_id = $2 AND talla = $3',
      [carritoId, producto_id, talla || null]
    );

    if (existente.rows.length > 0) {
      const nuevaCantidad = existente.rows[0].cantidad + parseInt(cantidad);
      await poolBD.query(
        'UPDATE items_carrito SET cantidad = $1 WHERE id = $2',
        [nuevaCantidad, existente.rows[0].id]
      );
    } else {
      await poolBD.query(
        'INSERT INTO items_carrito (carrito_id, producto_id, cantidad, talla) VALUES ($1, $2, $3, $4)',
        [carritoId, producto_id, parseInt(cantidad), talla || null]
      );
    }

    res.status(201).json({ mensaje: 'Producto agregado al carrito' });
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * Controlador para obtener el carrito del usuario con todos sus items
 * Calcula el total considerando precios de oferta
 */
async function obtenerCarrito(req, res) {
  try {
    const usuarioId = req.usuario.id;

    let carrito = await poolBD.query('SELECT * FROM carritos WHERE usuario_id = $1', [usuarioId]);

    if (carrito.rows.length === 0) {
      const nuevo = await poolBD.query(
        'INSERT INTO carritos (usuario_id) VALUES ($1) RETURNING *',
        [usuarioId]
      );
      carrito = nuevo;
    }

    const carritoId = carrito.rows[0].id;

    const items = await poolBD.query(
      `SELECT ic.*, p.nombre, p.precio, p.precio_oferta, p.imagen_url, p.stock
       FROM items_carrito ic
       JOIN productos p ON ic.producto_id = p.id
       WHERE ic.carrito_id = $1
       ORDER BY ic.creado_en DESC`,
      [carritoId]
    );

    // Calcular el total del carrito (usa precio_oferta si existe, sino precio normal)
    const total = items.rows.reduce((sum, item) => {
      const precio = item.precio_oferta || item.precio;
      return sum + precio * item.cantidad;
    }, 0);

    res.json({
      carrito_id: carritoId,
      items: items.rows,
      total: Math.round(total),
      cantidad_items: items.rows.reduce((sum, i) => sum + i.cantidad, 0),
    });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function actualizarItem(req, res) {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;
    const usuarioId = req.usuario.id;

    if (!cantidad || cantidad < 1) {
      return res.status(400).json({ error: 'La cantidad debe ser al menos 1' });
    }

    const carrito = await poolBD.query('SELECT id FROM carritos WHERE usuario_id = $1', [usuarioId]);
    if (carrito.rows.length === 0) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const resultado = await poolBD.query(
      'UPDATE items_carrito SET cantidad = $1 WHERE id = $2 AND carrito_id = $3 RETURNING *',
      [cantidad, id, carrito.rows[0].id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Item no encontrado en el carrito' });
    }

    res.json({ mensaje: 'Cantidad actualizada', item: resultado.rows[0] });
  } catch (error) {
    console.error('Error al actualizar item:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function eliminarItem(req, res) {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const carrito = await poolBD.query('SELECT id FROM carritos WHERE usuario_id = $1', [usuarioId]);
    if (carrito.rows.length === 0) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const resultado = await poolBD.query(
      'DELETE FROM items_carrito WHERE id = $1 AND carrito_id = $2 RETURNING *',
      [id, carrito.rows[0].id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Item no encontrado en el carrito' });
    }

    res.json({ mensaje: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error('Error al eliminar item:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function vaciarCarrito(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const carrito = await poolBD.query('SELECT id FROM carritos WHERE usuario_id = $1', [usuarioId]);

    if (carrito.rows.length > 0) {
      await poolBD.query('DELETE FROM items_carrito WHERE carrito_id = $1', [carrito.rows[0].id]);
    }

    res.json({ mensaje: 'Carrito vaciado' });
  } catch (error) {
    console.error('Error al vaciar carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { obtenerCarrito, agregarItem, actualizarItem, eliminarItem, vaciarCarrito };
