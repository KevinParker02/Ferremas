import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authguard from '../../Servicios/AuthGuard/authguard';
import { LogOut, Search, X, RefreshCw, Truck, CheckCircle, AlertCircle } from 'react-feather';
import './vendedor.css'; // Nuevo archivo CSS para estilos

const Vendedor = () => {
  const navigate = useNavigate();
  const { id_sucursal } = authguard.obtenerUsuario();

  const [pedidos, setPedidos] = useState([]);
  const [search, setSearch] = useState('');
  const [filtroDespacho, setFiltro] = useState('');
  const [selected, setSelected] = useState(null);

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
    <div className="vendedor-container">
      {/* Header */}
      <header className="vendedor-header">
        <h1 className="vendedor-title">Panel de Vendedor</h1>
        <button 
          className="btn-logout"
          onClick={() => {
            authguard.cerrarSesion();
            navigate('/login');
          }}
        >
          <LogOut size={18} className="me-2" />
          Cerrar sesión
        </button>
      </header>

      {/* Filtros */}
      <div className="filters-container">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            placeholder="Buscar por # pedido o cliente"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <select
          value={filtroDespacho}
          onChange={e => setFiltro(e.target.value)}
        >
          <option value="">Todos los despachos</option>
          <option value="100">Retiro en tienda</option>
          <option value="200">Despacho a domicilio</option>
        </select>
        
        <button className="btn btn-reset" onClick={handleReset}>
          <RefreshCw size={16} className="me-2" />
          Limpiar filtros
        </button>
      </div>

      {/* Tabla de pedidos */}
      <div className="pedidos-table-container">
        <table className="pedidos-table">
          <thead>
            <tr>
              <th># Pedido</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Despacho</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(p => (
              <tr 
                key={p.id_pedido}
                className={selected?.id_pedido === p.id_pedido ? 'selected' : ''}
                onClick={() => setSelected(p)}
              >
                <td>{p.id_pedido}</td>
                <td>{p.cliente}</td>
                <td>{new Date(p.fecha_pedido).toLocaleDateString()}</td>
                <td>{p.despacho}</td>
                <td>${p.total_pedido.toLocaleString('es-CL')}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(p.estado)}`}>
                    {p.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detalle del pedido */}
      {selected && (
        <div className="pedido-detail">
          <div className="detail-header">
            <h3>
              Pedido #{selected.id_pedido}
              <button
                className="btn-close-detail"
                onClick={() => setSelected(null)}
              >
                <X size={20} />
              </button>
            </h3>
          </div>
          
          <div className="detail-content">
            <div className="detail-section">
              <h4>Información del Pedido</h4>
              <div className="detail-grid">
                <div className="detail-row">
                  <span className="detail-label">Cliente:</span>
                  <span>{selected.cliente}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Fecha pedido:</span>
                  <span>{new Date(selected.fecha_pedido).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Fecha entrega:</span>
                  <span>{new Date(selected.fecha_entrega).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Sucursal:</span>
                  <span>{selected.sucursal}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Comprobante:</span>
                  <span>{selected.comprobante}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Estado:</span>
                  <span className={`status-badge ${getStatusClass(selected.estado)}`}>
                    {selected.estado}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total:</span>
                  <span>${selected.total_pedido.toLocaleString('es-CL')}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Detalle de Entrega</h4>
              {selected.despacho === 'Retiro en tienda' ? (
                <div className="retiro-tienda">
                  <CheckCircle size={20} className="me-2" />
                  <span>El cliente retirará en tienda</span>
                </div>
              ) : (
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="detail-label">Dirección:</span>
                    <span>{selected.direc_desp}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Comuna:</span>
                    <span>{selected.comuna_dep}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Región:</span>
                    <span>{selected.region_dep}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="detail-actions">
            {/* Solo para domicilio mostramos "Enviado" */}
            {selected.despacho === 'Despacho a domicilio' && (
              <button
                className="btn btn-action"
                onClick={() => cambiarEstado(selected.id_pedido, 3)}
              >
                <Truck size={16} className="me-2" />
                Marcar Enviado
              </button>
            )}

            {/* Estos dos valen para ambos tipos de despacho */}
            <button
              className="btn btn-action success"
              onClick={() => cambiarEstado(selected.id_pedido, 4)}
            >
              <CheckCircle size={16} className="me-2" />
              Marcar Entregado
            </button>
            <button
              className="btn btn-action warning"
              onClick={() => cambiarEstado(selected.id_pedido, 5)}
            >
              <AlertCircle size={16} className="me-2" />
              Marcar Confirmado
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Función auxiliar para clases de estado
  function getStatusClass(estado) {
    switch(estado) {
      case 'Entregado': return 'success';
      case 'Enviado': return 'info';
      case 'Confirmado': return 'warning';
      default: return 'default';
    }
  }
};

export default Vendedor;