import React, { useState, useEffect } from 'react';
import { useNavigate }            from 'react-router-dom';
import authguard                  from '../../Servicios/AuthGuard/authguard';

const Vendedor = () => {
  const navigate = useNavigate();
  const { id_sucursal } = authguard.obtenerUsuario();

  const [pedidos, setPedidos]       = useState([]);
  const [search, setSearch]         = useState('');
  const [filtroDespacho, setFiltro] = useState('');
  const [selected, setSelected]     = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search)         params.append('search', search);
    if (filtroDespacho) params.append('despacho', filtroDespacho);
    params.append('sucursal', id_sucursal);

    fetch(`http://localhost:8000/api/pedidos/?${params.toString()}`)
      .then(r => r.json())
      .then(setPedidos)
      .catch(console.error);
  }, [search, filtroDespacho, id_sucursal]);

  const handleReset = () => {
    setSearch('');
    setFiltro('');
    setSelected(null);
  };

  return (
    <div className="p-4">
      <nav className="d-flex justify-content-between align-items-center mb-3">
        <h3>Vista Vendedor</h3>
        <button
          className="btn btn-danger"
          onClick={() => {
            authguard.cerrarSesion();
            navigate('/login');
          }}
        >
          Cerrar sesión
        </button>
      </nav>

      {/* filtros */}
      <div className="d-flex gap-2 mb-3">
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
        <button className="btn btn-outline-secondary" onClick={handleReset}>
          Mostrar todos
        </button>
      </div>

      {/* tabla */}
      <div style={{
        maxHeight: 6 * 48 + 32,
        overflowY: 'auto',
        border: '1px solid #ddd'
      }}>
        <table className="table mb-0">
          <thead className="table-light">
            <tr>
              <th># Pedido</th>
              <th>ID User</th>
              <th>Fecha</th>
              <th>Despacho</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(p => (
              <tr
                key={p.id_pedido}
                onClick={() => setSelected(p)}
                style={{
                  cursor: 'pointer',
                  background: selected?.id_pedido === p.id_pedido ? '#eef' : ''
                }}
              >
                <td>{p.id_pedido}</td>
                <td>{p.Id_user}</td>
                <td>{new Date(p.fecha_pedido).toLocaleString()}</td>
                <td>{p.id_despacho}</td>
                <td>{p.total_pedido}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* detalle */}
      {selected && (
        <div className="mt-4 border p-3">
          <h5>
            Pedido #{selected.id_pedido}
            <button
              className="btn btn-sm btn-outline-secondary ms-2"
              onClick={() => setSelected(null)}
            >
              Cerrar
            </button>
          </h5>
          <p><strong>ID User:</strong> {selected.Id_user}</p>
          <p><strong>Entrega:</strong> {new Date(selected.fecha_entrega).toLocaleString()}</p>
          <p><strong>Dirección:</strong> {selected.direc_desp}</p>
          <p><strong>Comuna:</strong> {selected.id_comuna_dep}</p>
          <p><strong>Región:</strong> {selected.id_region_desp}</p>
          <p><strong>Factura RUT:</strong> {selected.rut_factura}</p>
          <p><strong>Razón social:</strong> {selected.razon_social}</p>
          <p><strong>Estado:</strong> {selected.id_estado}</p>
          <p><strong>Confirmado:</strong> {selected.confirmacion ? 'Sí' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

export default Vendedor;
