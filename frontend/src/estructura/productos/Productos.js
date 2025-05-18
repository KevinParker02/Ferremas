import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authguard from '../../Servicios/AuthGuard/authguard';
import { LogOut, Search, X, RefreshCw, Package, PlusCircle, Edit2, ToggleLeft, ToggleRight, ChevronLeft } from 'react-feather';
import './productos.css'; // Nuevo archivo CSS para estilos

const Productos = () => {
  const navigate = useNavigate();
  const { id_user, id_sucursal } = authguard.obtenerUsuario();

  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    nom_prod: '', marca_prod: '', codigo_fabricante: '',
    precio_prod: '', stock: '', id_categoria: '', foto_prod: null
  });
  const [precioError, setPrecioError] = useState(false);
  const [stockError, setStockError] = useState(false);

  const cargarProductos = useCallback(() => {
    fetch(`http://localhost:8000/api/productos/?sucursal=${id_sucursal}`)
      .then(r => r.json())
      .then(setProductos)
      .catch(console.error);
  }, [id_sucursal]);

  useEffect(() => {
    fetch('http://localhost:8000/api/categorias/')
      .then(r => r.json()).then(setCategorias).catch(console.error);
    fetch('http://localhost:8000/api/sucursales/')
      .then(r => r.json()).then(setSucursales).catch(console.error);
    cargarProductos();
  }, [cargarProductos]);

  const sucursalObj = sucursales.find(s => s.id_sucursal === id_sucursal);
  const sucursalNombre = sucursalObj?.direccion_sucursal || '–';

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

  const abrirCrear = () => {
    setEditingProduct(null);
    setForm({ nom_prod: '', marca_prod: '', codigo_fabricante: '', precio_prod: '', stock: '', id_categoria: '', foto_prod: null });
    setDrawerOpen(true);
  };

  const cerrarSesion = () => {
    authguard.cerrarSesion();
    navigate('/login');
  };
  const irBodega = () => navigate('/bodega');

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
      const matchId = String(p.id_prod).includes(txt);
      const matchName = p.nom_prod.toLowerCase().includes(txt);
      const matchBrand = p.marca_prod.toLowerCase().includes(txt);
      if (!matchId && !matchName && !matchBrand) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="productos-container">
      {/* Header */}
      <header className="productos-header">
        <div className="header-left">
          <button className="btn btn-back" onClick={irBodega}>
            <ChevronLeft size={20} className="me-1" />
            Volver a Bodega
          </button>
          <h1 className="productos-title">Gestión de Stock</h1>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={abrirCrear}>
            <PlusCircle size={18} className="me-2" />
            Agregar producto
          </button>
          <button className="btn-logout" onClick={cerrarSesion}>
            <LogOut size={18} className="me-2" />
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Filtros */}
      <div className="filters-container">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            placeholder="Buscar ID, nombre o marca..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        
        <select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="true">Disponible</option>
          <option value="false">Sin stock</option>
        </select>
        
        <select
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
        
        <button className="btn btn-reset" onClick={() => {
          setBusqueda('');
          setFiltroEstado('');
          setFiltroCategoria('');
        }}>
          <RefreshCw size={16} className="me-2" />
          Limpiar filtros
        </button>
      </div>

      {/* Tabla de productos */}
      <div className="productos-table-container">
        <table className="productos-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>ID</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map(p => (
              <tr key={p.id_prod}>
                <td>
                  {p.foto_prod ? (
                    <img 
                      src={`data:image/jpeg;base64,${p.foto_prod}`} 
                      alt={p.nom_prod} 
                      className="producto-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.parentElement.innerHTML = (
                          <div className="img-placeholder">
                            <Package size={20} />
                          </div>
                        );
                      }}
                    />
                  ) : (
                    <div className="img-placeholder">
                      <Package size={20} />
                    </div>
                  )}
                </td>
                <td>{p.id_prod}</td>
                <td>{p.nom_prod}</td>
                <td>{p.marca_prod}</td>
                <td>${p.precio_prod.toLocaleString('es-CL')}</td>
                <td>{p.stock}</td>
                <td>
                  <span className={`status-badge ${p.estado_prod ? 'success' : 'danger'}`}>
                    {p.estado_prod ? 'Disponible' : 'Sin stock'}
                  </span>
                </td>
                <td>{p.categoria__nom_cat_prod}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-sm btn-edit"
                      onClick={() => {
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
                      }}
                    >
                      <Edit2 size={14} className="me-1" />
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-toggle"
                      onClick={() => handleToggleAvailability(p)}
                    >
                      {p.estado_prod ? (
                        <ToggleRight size={14} className="me-1" />
                      ) : (
                        <ToggleLeft size={14} className="me-1" />
                      )}
                      {p.estado_prod ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {productosFiltrados.length === 0 && (
              <tr>
                <td colSpan="9" className="no-products">
                  No hay productos que coincidan con los filtros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer de edición/creación */}
      <div className={`product-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>
            {editingProduct ? `Editar Producto #${editingProduct?.id_prod}` : 'Nuevo Producto'}
            <button
              className="btn-close-drawer"
              onClick={() => setDrawerOpen(false)}
            >
              <X size={20} />
            </button>
          </h3>
          <p className="drawer-subtitle">Sucursal: {sucursalNombre}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="drawer-form">
          <div className="form-group">
            <label>Nombre del producto</label>
            <input 
              name="nom_prod" 
              className="form-control" 
              value={form.nom_prod} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Marca</label>
            <input 
              name="marca_prod" 
              className="form-control" 
              value={form.marca_prod} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Código fabricante</label>
            <input 
              name="codigo_fabricante" 
              className="form-control" 
              value={form.codigo_fabricante} 
              onChange={handleChange} 
              required 
              disabled={!!editingProduct}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Precio (CLP)</label>
              <input 
                name="precio_prod" 
                className="form-control" 
                value={form.precio_prod} 
                onChange={handleChange} 
                required 
              />
              {precioError && <span className="error-message">El precio debe ser mayor a 0</span>}
            </div>
            
            <div className="form-group">
              <label>Stock</label>
              <input 
                name="stock" 
                className="form-control" 
                value={form.stock} 
                onChange={handleChange} 
                required 
              />
              {stockError && <span className="error-message">El stock no puede ser negativo</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label>Categoría</label>
            <select 
              name="id_categoria" 
              className="form-control" 
              value={form.id_categoria} 
              onChange={handleChange} 
              required
            >
              <option value="">Seleccione categoría</option>
              {categorias.map(c => (
                <option key={c.id_categoria} value={c.id_categoria}>
                  {c.nom_cat_prod}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Imagen del producto</label>
            <input 
              name="foto_prod" 
              type="file" 
              accept="image/*" 
              className="form-control" 
              onChange={handleChange} 
            />
            {editingProduct?.foto_prod && (
              <div className="current-image">
                <span>Imagen actual:</span>
                <img 
                  src={`data:image/jpeg;base64,${editingProduct.foto_prod}`} 
                  alt="Imagen actual" 
                  className="img-thumbnail"
                />
              </div>
            )}
          </div>
          
          <button type="submit" className="btn btn-submit">
            {editingProduct ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Productos;