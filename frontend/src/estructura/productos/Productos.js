import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authguard from '../../Servicios/AuthGuard/authguard';

const Productos = () => {
  const navigate = useNavigate();
  const { id_user, id_sucursal } = authguard.obtenerUsuario();

  const [filtroEstado, setFiltroEstado]       = useState('');  
  const [filtroCategoria, setFiltroCategoria] = useState('');   
  const [busqueda, setBusqueda]               = useState('');   

  const [productos, setProductos]     = useState([]);
  const [categorias, setCategorias]   = useState([]);
  const [sucursales, setSucursales]   = useState([]);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm]               = useState({
    nom_prod: '', marca_prod: '', codigo_fabricante: '',
    precio_prod: '', stock: '', id_categoria: '', foto_prod: null
  });
  const [precioError, setPrecioError] = useState(false);
  const [stockError, setStockError]   = useState(false);

  // Callback para recargar productos
  const cargarProductos = useCallback(() => {
    fetch(`http://localhost:8000/api/productos/?sucursal=${id_sucursal}`)
      .then(r => r.json())
      .then(setProductos)
      .catch(console.error);
  }, [id_sucursal]);

  // Carga inicial
  useEffect(() => {
    fetch('http://localhost:8000/api/categorias/')
      .then(r => r.json()).then(setCategorias).catch(console.error);
    fetch('http://localhost:8000/api/sucursales/')
      .then(r => r.json()).then(setSucursales).catch(console.error);
    cargarProductos();
  }, [cargarProductos]);

  // Encuentra nombre de sucursal actual
  const sucursalObj    = sucursales.find(s => s.id_sucursal === id_sucursal);
  const sucursalNombre = sucursalObj?.direccion_sucursal || '–';

  // Manejo de formulario
  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'precio_prod') {
      if (!/^\d*$/.test(value)) return;
      setPrecioError(value !== '' && Number(value) <= 0);
    }
    if (name === 'stock') {
      if (!/^\d*$/.test(value)) return;
      setStockError(value !== '' && Number(value) < 0);
    }
    if (name === 'foto_prod') {
      return setForm(f => ({ ...f, foto_prod: files[0] }));
    }
    setForm(f => ({ ...f, [name]: value }));
  };

  // Abrir drawer en modo crear
  const abrirCrear = () => {
    setEditingProduct(null);
    setForm({ nom_prod: '', marca_prod: '', codigo_fabricante: '', precio_prod: '', stock: '', id_categoria: '', foto_prod: null });
    setDrawerOpen(true);
  };

  // Navegación
  const cerrarSesion = () => {
    authguard.cerrarSesion();
    navigate('/login');
  };
  const irBodega = () => navigate('/bodega');

  // Submit (crear o editar)
  const handleSubmit = async e => {
    e.preventDefault();
    if (precioError || stockError) {
      alert('Corrige los errores antes de continuar');
      return;
    }
    const formData = new FormData();
    formData.append('id_user', id_user);
    formData.append('nom_prod', form.nom_prod);
    formData.append('marca_prod', form.marca_prod);
    formData.append('codigo_fabricante', form.codigo_fabricante);
    formData.append('precio_prod', form.precio_prod);
    formData.append('stock', form.stock);
    formData.append('id_categoria', form.id_categoria);
    if (form.foto_prod) formData.append('foto_prod', form.foto_prod);

    let url = 'http://localhost:8000/api/producto/crear/';
    let method = 'POST';
    if (editingProduct) {
      url = `http://localhost:8000/api/producto/${editingProduct.id_prod}/`;
      method = 'PUT';
    }

    const res = await fetch(url, { method, body: formData });
    const data = await res.json();
    if (res.ok) {
      alert(editingProduct ? `Producto #${editingProduct.id_prod} actualizado` : `Producto creado (ID ${data.id_prod}) en "${sucursalNombre}"`);
      setDrawerOpen(false);
      setEditingProduct(null);
      cargarProductos();
    } else {
      alert(data.error || 'Error al guardar producto');
    }
  };

  // Alterna estado_prod y actualiza en la BD
  const handleToggleAvailability = async prod => {
    const nuevoEstado = !prod.estado_prod;
    const data = new FormData();
    data.append('estado_prod', nuevoEstado);

    const res = await fetch(
      `http://localhost:8000/api/producto/${prod.id_prod}/`,
      {
        method: 'PUT',
        body: data
      }
    );
    if (res.ok) {
      cargarProductos(); 
    } else {
      alert('Error al cambiar disponibilidad');
    }
  };

  const productosFiltrados = productos.filter(p => {
    if (filtroEstado && String(p.estado_prod) !== filtroEstado) {
      return false;
    }
    if (filtroCategoria && p.categoria__nom_cat_prod !== filtroCategoria) {
      return false;
    }
    const txt = busqueda.trim().toLowerCase();
    if (txt) {
      const matchId    = String(p.id_prod).includes(txt);
      const matchName  = p.nom_prod.toLowerCase().includes(txt);
      const matchBrand = p.marca_prod.toLowerCase().includes(txt);
      if (!matchId && !matchName && !matchBrand) {
        return false;
      }
    }
    return true;
  });

  return (
    <>
      {/* NAV */}
      <nav className="d-flex justify-content-between align-items-center p-3 bg-light">
        <h3>Gestión de Stock</h3>
        <div>
          <button className="btn btn-warning me-2" onClick={irBodega}>volver</button>
          <button className="btn btn-info me-2" onClick={abrirCrear}>Agregar producto</button>
          <button className="btn btn-danger" onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </nav>

      {/* --- Controles de Filtro --- */}
      <div className="d-flex mb-3 align-items-center">
        <input
          type="text"
          placeholder="Buscar ID, nombre o marca..."
          className="form-control me-2"
          style={{ width: '200px' }}
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />

        <select
          className="form-select me-2"
          style={{ width: '150px' }}
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="true">Disponible</option>
          <option value="false">Sin stock</option>
        </select>

        <select
          className="form-select"
          style={{ width: '200px' }}
          value={filtroCategoria}
          onChange={e => setFiltroCategoria(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map(c => (
            <option key={c.id_categoria} value={c.nom_cat_prod}>
              {c.nom_cat_prod}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="p-4">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Imagen</th><th>ID</th><th>Nombre</th><th>Marca</th><th>Precio</th>
              <th>Stock</th><th>Estado</th><th>Categoría</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map(p => (
              <tr key={p.id_prod}>
                <td>
                  {p.foto_prod
                    ? <img src={`data:image/jpeg;base64,${p.foto_prod}`} alt={p.nom_prod} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                    : '–'}
                </td>
                <td>{p.id_prod}</td>
                <td>{p.nom_prod}</td>
                <td>{p.marca_prod}</td>
                <td>{p.precio_prod}</td>
                <td>{p.stock}</td>
                <td>{p.estado_prod ? 'Disponible' : 'Sin stock'}</td>
                <td>{p.categoria__nom_cat_prod}</td>
                <td>
                  <button className="btn btn-sm btn-info me-1" onClick={() => {
                    setEditingProduct(p);
                    setForm({
                      nom_prod: p.nom_prod,
                      marca_prod: p.marca_prod,
                      codigo_fabricante: p.codigo_fabricante,
                      precio_prod: p.precio_prod,
                      stock: p.stock,
                      id_categoria: p.id_categoria,
                      foto_prod: null
                    });
                    setDrawerOpen(true);
                  }}>Editar</button>
                  <button
                    className="btn btn-sm btn-warning me-1"
                    onClick={() => handleToggleAvailability(p)}
                  >
                    Cambiar disponibilidad
                  </button>
                </td>
              </tr>
            ))}
            {productosFiltrados.length === 0 && <tr><td colSpan="9" className="text-center">No hay productos</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      <div className="position-fixed top-0 end-0 h-100 bg-white shadow-lg" style={{ width: '400px', transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s ease-in-out', zIndex: 1050 }}> 
        <div className="p-3 border-bottom d-flex justify-content-between">
          <div>
            <h4>{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h4>
            <small className="text-muted">Sucursal: {sucursalNombre}</small>
          </div>
          <button className="btn-close" onClick={() => setDrawerOpen(false)}/>
        </div>
        <form onSubmit={handleSubmit} className="p-4 overflow-auto" style={{ height: 'calc(100% - 60px)' }}>
          {/* Nombre */}
          <div className="mb-3">
            <label>Nombre</label>
            <input name="nom_prod" className="form-control" value={form.nom_prod} onChange={handleChange} required />
          </div>
          {/* Marca */}
          <div className="mb-3">
            <label>Marca</label>
            <input name="marca_prod" className="form-control" value={form.marca_prod} onChange={handleChange} required />
          </div>
          {/* Código fabricante */}
          <div className="mb-3">
            <label>Código fabricante</label>
            <input name="codigo_fabricante" className="form-control" value={form.codigo_fabricante} onChange={handleChange} required disabled={!!editingProduct} />
          </div>
          {/* Precio */}
          <div className="mb-3">
            <label>Precio (CLP)</label>
            <input name="precio_prod" className="form-control" value={form.precio_prod} onChange={handleChange} required />
            {precioError && <small className="text-danger">El precio debe ser un número mayor a 0</small>}
          </div>
          {/* Stock */}
          <div className="mb-3">
            <label>Stock</label>
            <input name="stock" className="form-control" value={form.stock} onChange={handleChange} required />
            {stockError && <small className="text-danger">El stock no puede ser negativo</small>}
          </div>
          {/* Categoría */}
          <div className="mb-3">
            <label>Categoría</label>
            <select name="id_categoria" className="form-control" value={form.id_categoria} onChange={handleChange} required>
              <option value="">Seleccione categoría</option>
              {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nom_cat_prod}</option>)}
            </select>
          </div>
          {/* Foto */}
          <div className="mb-3">
            <label>Foto</label>
            <input name="foto_prod" type="file" accept="image/*" className="form-control" onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-success w-100">{editingProduct ? 'Guardar Cambios' : 'Crear Producto'}</button>
        </form>
      </div>
    </>
  );
};

export default Productos;
