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
      return;
    }
    const data = await res.json();
  
    setSelected(p => ({
      ...p,
      id_estado: data.id_estado,
      estado:    data.nom_estado   
    }));
    
    setPedidos(lista =>
      lista.map(p =>
        p.id_pedido === id_pedido
          ? { ...p, id_estado: data.id_estado, estado: data.nom_estado }
          : p
      )
    );
  };

  return (
    <div className="p-4">
      <nav className="d-flex justify-content-between mb-3">
        <h3>Vista Vendedor</h3>
        <button className="btn btn-danger" onClick={() => {
            authguard.cerrarSesion();
            navigate('/login');
          }}>
          Cerrar sesión
        </button>
      </nav>

      {/* FILTROS */}
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

      {/* TABLA */}
      <div style={{
        maxHeight: 6 * 48 + 32,
        overflowY: 'auto',
        border: '1px solid #ddd'
      }}>
        <table className="table mb-0">
          <thead className="table-light">
            <tr>
              <th># Pedido</th>
              <th>Cliente</th>
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
                <td>{p.cliente}</td>
                <td>{new Date(p.fecha_pedido).toLocaleString()}</td>
                <td>{p.despacho}</td>
                <td>{p.total_pedido.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETALLE */}
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

          {/* Campos comunes */}
          <p><strong>Cliente:</strong> {selected.cliente}</p>
          <p><strong>Fecha pedido:</strong> {new Date(selected.fecha_pedido).toLocaleString()}</p>
          <p><strong>Fecha entrega:</strong> {new Date(selected.fecha_entrega).toLocaleString()}</p>
          <p><strong>Sucursal:</strong> {selected.sucursal}</p>
          <p><strong>Comprobante:</strong> {selected.comprobante}</p>
          <p><strong>Estado:</strong> {selected.estado}</p>
          <p><strong>Total:</strong> {selected.total_pedido.toLocaleString()}</p>

          {/* Detalle según tipo de despacho */}
          {selected.despacho === 'Retiro en tienda' ? (
            <p className="mt-3 text-success">El cliente retirará en tienda</p>
          ) : (
            <>
              <p><strong>Dirección despacho:</strong> {selected.direc_desp}</p>
              <p><strong>Comuna:</strong> {selected.comuna_dep}</p>
              <p><strong>Región:</strong> {selected.region_dep}</p>
            </>
          )}
          <div className="mt-3 d-flex gap-2">
      {/* Solo para domicilio (200) mostramos “Enviado” */}
      {selected.despacho === 'Despacho a domicilio' && (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => cambiarEstado(selected.id_pedido, 3)}
        >
          Marcar Enviado
        </button>
      )}

      {/* Estos dos valen para ambos tipos de despacho */}
      <button
        className="btn btn-sm btn-success"
        onClick={() => cambiarEstado(selected.id_pedido, 4)}
      >
        Marcar Entregado
      </button>
      <button
        className="btn btn-sm btn-warning"
        onClick={() => cambiarEstado(selected.id_pedido, 5)}
      >
        Marcar Confirmado
      </button>
    </div>

        </div>
      )}
    </div>
  );
};

export default Vendedor;
