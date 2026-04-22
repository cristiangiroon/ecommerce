const { poolBD } = require('../../shared/config');

/**
 * Controlador para obtener productos con filtros y paginación
 * Soporta búsqueda, filtrado por categoría, género, marca, precio y ordenamiento
 */
async function obtenerTodos(req, res) {
  try {
    const { categoria, genero, marca, precio_min, precio_max, busqueda, orden, pagina = 1, limite = 12 } = req.query;

    
    let consulta = `
      SELECT p.*, c.nombre AS categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.activo = TRUE
    `;
    const parametros = [];
    let indice = 1;

    if (categoria) {
      consulta += ` AND p.categoria_id = $${indice++}`;
      parametros.push(categoria);
    }
    if (genero) {
      consulta += ` AND p.genero = $${indice++}`;
      parametros.push(genero);
    }
    if (marca) {
      consulta += ` AND p.marca ILIKE $${indice++}`;
      parametros.push(`%${marca}%`);
    }
    if (precio_min) {
      consulta += ` AND p.precio >= $${indice++}`;
      parametros.push(precio_min);
    }
    if (precio_max) {
      consulta += ` AND p.precio <= $${indice++}`;
      parametros.push(precio_max);
    }
    if (busqueda) {
      consulta += ` AND (p.nombre ILIKE $${indice} OR p.descripcion ILIKE $${indice} OR p.marca ILIKE $${indice})`;
      parametros.push(`%${busqueda}%`);
      indice++;
    }

    switch (orden) {
      case 'precio_asc': consulta += ' ORDER BY p.precio ASC'; break;
      case 'precio_desc': consulta += ' ORDER BY p.precio DESC'; break;
      case 'nombre': consulta += ' ORDER BY p.nombre ASC'; break;
      case 'nuevo': consulta += ' ORDER BY p.creado_en DESC'; break;
      default: consulta += ' ORDER BY p.destacado DESC, p.creado_en DESC';
    }

    // Aplicar paginación
    const offset = (parseInt(pagina) - 1) * parseInt(limite);
    consulta += ` LIMIT $${indice++} OFFSET $${indice++}`;
    parametros.push(parseInt(limite), offset);

    const resultado = await poolBD.query(consulta, parametros);

    const conteoTotal = await poolBD.query(
      'SELECT COUNT(*) FROM productos WHERE activo = TRUE'
    );

    res.json({
      productos: resultado.rows,
      total: parseInt(conteoTotal.rows[0].count),
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(parseInt(conteoTotal.rows[0].count) / parseInt(limite)),
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function obtenerPorId(req, res) {
  try {
    const { id } = req.params;
    const resultado = await poolBD.query(
      `SELECT p.*, c.nombre AS categoria_nombre
       FROM productos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE p.id = $1 AND p.activo = TRUE`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ producto: resultado.rows[0] });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function obtenerDestacados(req, res) {
  try {
    const resultado = await poolBD.query(
      `SELECT p.*, c.nombre AS categoria_nombre
       FROM productos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE p.activo = TRUE AND p.destacado = TRUE
       ORDER BY p.creado_en DESC LIMIT 6`
    );
    res.json({ productos: resultado.rows });
  } catch (error) {
    console.error('Error al obtener destacados:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function obtenerCategorias(req, res) {
  try {
    const resultado = await poolBD.query('SELECT * FROM categorias ORDER BY nombre');
    res.json({ categorias: resultado.rows });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function obtenerMarcas(req, res) {
  try {
    const resultado = await poolBD.query(
      'SELECT DISTINCT marca FROM productos WHERE activo = TRUE ORDER BY marca'
    );
    res.json({ marcas: resultado.rows.map(r => r.marca) });
  } catch (error) {
    console.error('Error al obtener marcas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { obtenerTodos, obtenerPorId, obtenerDestacados, obtenerCategorias, obtenerMarcas };
