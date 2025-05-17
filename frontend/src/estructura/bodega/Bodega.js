import React, { useState, useEffect } from 'react';
import { useNavigate }            from 'react-router-dom';
import authguard                  from '../../Servicios/AuthGuard/authguard';

const Bodega = () => {
  const navigate = useNavigate();
  const { id_sucursal } = authguard.obtenerUsuario();


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

  const irProductos = () => {
    navigate('/productos');
  };

  return (
    <>
      {/* — Navegación superior — */}
      <nav className="d-flex justify-content-between align-items-center p-3 bg-light">
        <h3>Menú Bodega</h3>
        <div>
          <button className="btn btn-info me-2" onClick={irProductos}>
            Gestión de stock
          </button>
          <button className="btn btn-danger me-2" onClick={cerrarSesion}>
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
    </>
  );
};

export default Bodega;
