import React, { useState, useEffect } from 'react';
import { useNavigate }            from 'react-router-dom';
import authguard                  from '../../Servicios/AuthGuard/authguard';

const Bodega = () => {
  const navigate = useNavigate();
  const { id_user, id_sucursal } = authguard.obtenerUsuario();


  // Estado para listar pedidos en Bodega
  const [search, setSearch]         = useState('');
  const [filtroDespacho, setFiltro] = useState('');
  const [pedidos, setPedidos]       = useState([]);
  const [pedidoSel, setPedidoSel]   = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('sucursal', id_sucursal);
    if (search)         params.append('search', search);
    if (filtroDespacho) params.append('despacho', filtroDespacho);

    fetch(`http://localhost:8000/api/bodega/pedidos/?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        console.log('API /bodega/pedidos res →', data);
        setPedidos(data);
      })
      .catch(console.error);
  }, [search, filtroDespacho, id_sucursal]);

  const resetFiltros = () => {
    setSearch('');
    setFiltro('');
    setPedidoSel(null);
  };

  
  // Estados para “Agregar producto” (drawer)
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [categorias, setCategorias]   = useState([]);
  const [sucursales, setSucursales]   = useState([]);
  const [form, setForm]               = useState({
    nom_prod: '', marca_prod: '', codigo_fabricante: '',
    precio_prod: '', stock: '', id_categoria: '', foto_prod: null
  });
  const [precioError, setPrecioError] = useState(false);
  const [stockError, setStockError]   = useState(false);

  // Cargo categorías y sucursales (solo para mostrar nombre de la sucursal actual)
  useEffect(() => {
    fetch('http://localhost:8000/api/categorias/')
      .then(r => r.json()).then(setCategorias)
      .catch(console.error);
    fetch('http://localhost:8000/api/sucursales/')
      .then(r => r.json()).then(setSucursales)
      .catch(console.error);
  }, []);

  const sucursalObj    = sucursales.find(s => s.id_sucursal === id_sucursal);
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

    const res = await fetch('http://localhost:8000/api/producto/crear/', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (res.ok) {
      alert(`Producto creado (ID ${data.id_prod}) en "${sucursalNombre}"`);
      setDrawerOpen(false);
      setForm({
        nom_prod:'', marca_prod:'', codigo_fabricante:'',
        precio_prod:'', stock:'', id_categoria:'', foto_prod:null
      });
    } else {
      alert(data.error || 'Error al crear producto');
    }
  };

  // Cambiar los estados del pedido :p
  const cambiarEstado = async (id_pedido, nuevoEstado) => {
  const res = await fetch(
    `http://localhost:8000/api/pedidos/${id_pedido}/estado/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_estado: nuevoEstado })
    }
  );
  if (!res.ok) {
    alert('Error al actualizar estado');
    return false;
  }
  const data = await res.json();
  setPedidoSel(p => ({
    ...p,
    id_estado: data.id_estado,
    estado:    data.nom_estado
  }));
  setPedidos(list =>
    list.map(p =>
      p.id_pedido === id_pedido
        ? { ...p, id_estado: data.id_estado, estado: data.nom_estado }
        : p
    )
  );
  return true;
};

const marcarCompletado = async id_pedido => {
  if (!window.confirm('¿Seguro que quieres marcar este pedido como Completado?')) {
    return;
  }
  await cambiarEstado(id_pedido, 7);
};

  // Logout
  const cerrarSesion = () => {
    authguard.cerrarSesion();
    navigate('/login');
  };

  return (
    <>
      {/* — Navegación superior — */}
      <nav className="d-flex justify-content-between align-items-center p-3 bg-light">
        <h3>Menú Bodega</h3>
        <div>
          <button className="btn btn-primary me-2" onClick={() => setDrawerOpen(true)}>
            Agregar productos
          </button>
          <button className="btn btn-danger" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* — Filtros de pedidos — */}
      <div className="p-3 d-flex gap-2">
        <input
          className="form-control"
          placeholder="Buscar # pedido"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="form-control"
          value={filtroDespacho}
          onChange={e => setFiltro(e.target.value)}
        >
          <option value="">Todos los despachos</option>
          <option value="100">Retiro en tienda</option>
          <option value="200">Despacho a domicilio</option>
        </select>
        <button className="btn btn-outline-secondary" onClick={resetFiltros}>
          Mostrar todos
        </button>
      </div>

      {/* — Tabla de pedidos (estados 5 y 6) — */}
      <div style={{
        maxHeight: 6 * 48 + 32,
        overflowY: 'auto',
        border: '1px solid #ddd',
        margin: '0 1rem'
      }}>
        <table className="table mb-0">
          <thead className="table-light">
            <tr>
              <th># Pedido</th>
              <th>Fecha</th>
              <th>Despacho</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(p => (
              <tr
                key={p.id_pedido}
                onClick={() => setPedidoSel(p)}
                style={{
                  cursor: 'pointer',
                  background: pedidoSel?.id_pedido === p.id_pedido ? '#eef' : ''
                }}
              >
                <td>{p.id_pedido}</td>
                <td>{new Date(p.fecha_pedido).toLocaleString()}</td>
                <td>{p.despacho}</td>
                <td>{p.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* — Detalle de pedido seleccionado — */}
      {pedidoSel && (
        <div className="p-3 border mt-3">
          <h5>
            Pedido #{pedidoSel.id_pedido}
            <button
              className="btn btn-sm btn-outline-secondary ms-2"
              onClick={() => setPedidoSel(null)}
            >
              Cerrar
            </button>
          </h5>
          <p><strong>Fecha pedido:</strong> {new Date(pedidoSel.fecha_pedido).toLocaleString()}</p>
          <p><strong>Fecha entrega:</strong> {new Date(pedidoSel.fecha_entrega).toLocaleString()}</p>
          <p><strong>Despacho:</strong> {pedidoSel.despacho}</p>
          <p><strong>Estado:</strong> {pedidoSel.estado}</p>

          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-sm btn-primary" onClick={() => cambiarEstado(pedidoSel.id_pedido, 6)}>Marcar Preparación</button>

            {/* Si está en Preparación (6), permitimos pasarlo a Completado (7) */}
            {pedidoSel.id_estado === 6 && (
              <button
                className="btn btn-sm btn-success"
                onClick={() => marcarCompletado(pedidoSel.id_pedido)}
              >
                Marcar Completado
              </button>
            )}
          </div>

          {/* — Productos del pedido (agrupados) — */}
          <table className="table mt-3">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Código</th>
                <th>Cantidad</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {pedidoSel.productos.map(prod => (
                <tr key={prod.id_prod}>
                  <td>
                    {prod.foto
                      ? <img src={prod.foto} alt={prod.nom_prod} style={{ width: 50, height: 'auto' }} />
                      : '—'}
                  </td>
                  <td>{prod.nom_prod}</td>
                  <td>{prod.marca_prod}</td>
                  <td>{prod.codigo_fabricante}</td>
                  <td>{prod.cantidad}</td>
                  <td>{prod.precio_prod.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* — Drawer para Agregar producto — */}
      <div
        className="position-fixed top-0 end-0 h-100 bg-white shadow-lg"
        style={{
          width: '400px',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
          zIndex: 1050
        }}
      >
        <div className="p-3 border-bottom d-flex justify-content-between">
          <div>
            <h4>Agregar Producto</h4>
            <small className="text-muted">Sucursal: {sucursalNombre}</small>
          </div>
          <button className="btn-close" onClick={() => setDrawerOpen(false)} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 overflow-auto"
          style={{ height: 'calc(100% - 60px)' }}
        >
          {/* Nombre */}
          <div className="mb-3">
            <label>Nombre</label>
            <input
              name="nom_prod"
              className="form-control"
              value={form.nom_prod}
              onChange={handleChange}
              required
            />
          </div>

          {/* Marca */}
          <div className="mb-3">
            <label>Marca</label>
            <input
              name="marca_prod"
              className="form-control"
              value={form.marca_prod}
              onChange={handleChange}
              required
            />
          </div>

          {/* Código fabricante */}
          <div className="mb-3">
            <label>Código fabricante</label>
            <input
              name="codigo_fabricante"
              className="form-control"
              value={form.codigo_fabricante}
              onChange={handleChange}
              required
            />
          </div>

          {/* Precio */}
          <div className="mb-3">
            <label>Precio (CLP)</label>
            <input
              name="precio_prod"
              className="form-control"
              value={form.precio_prod}
              onChange={handleChange}
              required
            />
            {precioError && (
              <small className="text-danger">
                El precio debe ser un número mayor a 0
              </small>
            )}
          </div>

          {/* Stock */}
          <div className="mb-3">
            <label>Stock</label>
            <input
              name="stock"
              className="form-control"
              value={form.stock}
              onChange={handleChange}
              required
            />
            {stockError && (
              <small className="text-danger">
                El stock no puede ser negativo
              </small>
            )}
          </div>

          {/* Categoría */}
          <div className="mb-3">
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

          {/* Foto */}
          <div className="mb-3">
            <label>Foto</label>
            <input
              name="foto_prod"
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Crear Producto
          </button>
        </form>
      </div>
    </>
  );
};

export default Bodega;
