const { poolBD } = require('../../shared/config');

/**
 * Controlador para crear una orden de compra
 * Usa transacciones para garantizar consistencia de datos (ACID)
 * Proceso: validar carrito -> verificar stock -> crear orden -> reducir inventario -> vaciar carrito
 */
async function crearOrden(req, res) {
  
  const cliente = await poolBD.connect();
  try {
    const usuarioId = req.usuario.id;
    const { direccion_envio, metodo_pago, notas } = req.body;

    if (!direccion_envio) {
      return res.status(400).json({ error: 'La dirección de envío es obligatoria' });
    }

    await cliente.query('BEGIN');

    const carrito = await cliente.query('SELECT id FROM carritos WHERE usuario_id = $1', [usuarioId]);
    if (carrito.rows.length === 0) {
      await cliente.query('ROLLBACK');
      return res.status(400).json({ error: 'No tienes un carrito activo' });
    }

    //  información del producto
    const items = await cliente.query(
      `SELECT ic.*, p.precio, p.precio_oferta, p.stock, p.nombre
       FROM items_carrito ic
       JOIN productos p ON ic.producto_id = p.id
       WHERE ic.carrito_id = $1`,
      [carrito.rows[0].id]
    );

    if (items.rows.length === 0) {
      await cliente.query('ROLLBACK');
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    for (const item of items.rows) {
      if (item.stock < item.cantidad) {
        await cliente.query('ROLLBACK');
        return res.status(400).json({
          error: `Stock insuficiente para "${item.nombre}". Disponible: ${item.stock}`,
        });
      }
    }

    const total = items.rows.reduce((sum, item) => {
      const precio = item.precio_oferta || item.precio;
      return sum + precio * item.cantidad;
    }, 0);

    const orden = await cliente.query(
      `INSERT INTO ordenes (usuario_id, total, direccion_envio, metodo_pago, notas)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [usuarioId, Math.round(total), direccion_envio, metodo_pago || 'tarjeta', notas || null]
    );

    // Crear los items de la orden y reducir el stock de cada producto
    for (const item of items.rows) {
      const precioUnitario = item.precio_oferta || item.precio;
      await cliente.query(
        `INSERT INTO items_orden (orden_id, producto_id, cantidad, precio_unitario, talla)
         VALUES ($1, $2, $3, $4, $5)`,
        [orden.rows[0].id, item.producto_id, item.cantidad, precioUnitario, item.talla]
      );

      
      await cliente.query(
        'UPDATE productos SET stock = stock - $1 WHERE id = $2',
        [item.cantidad, item.producto_id]
      );
    }

    await cliente.query('DELETE FROM items_carrito WHERE carrito_id = $1', [carrito.rows[0].id]);

    await cliente.query('COMMIT');

    res.status(201).json({
      mensaje: 'Orden creada exitosamente',
      orden: orden.rows[0],
    });
  } catch (error) {

    await cliente.query('ROLLBACK');
    console.error('Error al crear orden:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    // Liberar la conexión de vuelta al pool
    cliente.release();
  }
}

/**
 * Controlador para cancelar una orden
 * Restaura el stock de los productos y cambia el estado a 'cancelada'
 */
async function cancelarOrden(req, res) {
  const cliente = await poolBD.connect();
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    await cliente.query('BEGIN');

    const orden = await cliente.query(
      "SELECT * FROM ordenes WHERE id = $1 AND usuario_id = $2 AND estado = 'pendiente'",
      [id, usuarioId]
    );

    if (orden.rows.length === 0) {
      await cliente.query('ROLLBACK');
      return res.status(404).json({ error: 'Orden no encontrada o no se puede cancelar' });
    }


    const items = await cliente.query('SELECT * FROM items_orden WHERE orden_id = $1', [id]);
    for (const item of items.rows) {

      await cliente.query(
        'UPDATE productos SET stock = stock + $1 WHERE id = $2',
        [item.cantidad, item.producto_id]
      );
    }

    await cliente.query(
      "UPDATE ordenes SET estado = 'cancelada', actualizado_en = CURRENT_TIMESTAMP WHERE id = $1",
      [id]
    );

    await cliente.query('COMMIT');
    res.json({ mensaje: 'Orden cancelada exitosamente' });
  } catch (error) {
    await cliente.query('ROLLBACK');
    console.error('Error al cancelar orden:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    cliente.release();
  }
}

async function obtenerOrdenes(req, res) {
  try {
    const usuarioId = req.usuario.id;

    const ordenes = await poolBD.query(
      `SELECT * FROM ordenes WHERE usuario_id = $1 ORDER BY creado_en DESC`,
      [usuarioId]
    );

    res.json({ ordenes: ordenes.rows });
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function obtenerOrdenPorId(req, res) {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const orden = await poolBD.query(
      'SELECT * FROM ordenes WHERE id = $1 AND usuario_id = $2',
      [id, usuarioId]
    );

    if (orden.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    const items = await poolBD.query(
      `SELECT io.*, p.nombre, p.imagen_url
       FROM items_orden io
       JOIN productos p ON io.producto_id = p.id
       WHERE io.orden_id = $1`,
      [id]
    );

    res.json({
      orden: orden.rows[0],
      items: items.rows,
    });
  } catch (error) {
    console.error('Error al obtener orden:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { crearOrden, obtenerOrdenes, obtenerOrdenPorId, cancelarOrden };
