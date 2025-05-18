import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authguard from '../../Servicios/AuthGuard/authguard';
import MenuService from '../../Servicios/Menu/MenuService';
import { LogOut, Search, X, RefreshCw, Package, CheckCircle, List, ChevronLeft, Menu } from 'react-feather';
import './bodega.css';

const Bodega = () => {
  const navigate = useNavigate();
  const usuario = authguard.obtenerUsuario();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { id_sucursal } = authguard.obtenerUsuario();

  const [pedidos, setPedidos] = useState([]);
  const [search, setSearch] = useState('');
  const [filtroDespacho, setFiltro] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener menú según el rol
  const menuItems = MenuService.obtenerMenuPorRol(usuario?.rol?.id);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  // Cargar pedidos con productos
  const cargarPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('sucursal', id_sucursal);
      if (search) params.append('search', search);
      if (filtroDespacho) params.append('despacho', filtroDespacho);

      const response = await fetch(`http://localhost:8000/api/bodega/pedidos/?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Error al cargar pedidos');
      }
      const data = await response.json();
      setPedidos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, [search, filtroDespacho, id_sucursal]);

  const resetFiltros = () => {
    setSearch('');
    setFiltro('');
    setSelected(null);
  };

  const cambiarEstado = async (id_pedido, nuevoEstado) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/pedidos/${id_pedido}/estado/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_estado: nuevoEstado })
        }
      );
      
      if (!res.ok) {
        throw new Error('Error al actualizar estado');
      }
      
      const data = await res.json();
      
      // Actualizar el pedido seleccionado
      setSelected(prev => ({
        ...prev,
        id_estado: data.id_estado,
        estado: data.nom_estado
      }));
      
      // Actualizar la lista de pedidos
      setPedidos(prev => prev.map(p => 
        p.id_pedido === id_pedido 
          ? { ...p, id_estado: data.id_estado, estado: data.nom_estado }
          : p
      ));
      
      return true;
    } catch (err) {
      console.error('Error:', err);
      alert('Error al actualizar estado');
      return false;
    }
  };

  const marcarCompletado = async id_pedido => {
    if (!window.confirm('¿Marcar este pedido como completado en bodega?')) {
      return;
    }
    await cambiarEstado(id_pedido, 7);
  };

  const cerrarSesion = () => {
    authguard.cerrarSesion();
    navigate('/login');
  };

  const irProductos = () => {
    navigate('/productos');
  };

  return (
      <div className={`bodega-wrapper ${menuAbierto ? 'menu-abierto' : ''}`}>
      {/* Menú lateral */}
      <div className={`menu-lateral ${menuAbierto ? 'abierto' : ''}`}>
        <div className="menu-header">
          <h5>{usuario?.rol?.nombre || 'Menú'}</h5>
          <button className="btn-cerrar-menu" onClick={toggleMenu}>
            <X size={20} />
          </button>
        </div>
        <ul className="menu-items">
          {MenuService.obtenerMenuPorRol(usuario?.rol?.id).map((item, index) => (
            <li key={index}>
              <button 
                className="menu-link"
                onClick={() => {
                  navigate(item.ruta);
                  setMenuAbierto(false);
                }}
              >
                {item.nombre}
              </button>
            </li>
          ))}
          <li>
            <button 
              className="menu-link logout-link" 
              onClick={cerrarSesion}
            >
              <LogOut size={18} className="me-2" />
              Cerrar sesión
            </button>
          </li>
        </ul>
      </div>

    <div className="bodega-container">
      {/* Header */}
      <header className="bodega-header">
        <div className="header-left">
          <button className="btn-menu" onClick={toggleMenu}>
              <Menu size={20} />
            </button>
          <h1 className="bodega-title">Panel de Bodega</h1>
        </div>
        <button className="btn btn-secondary" onClick={irProductos}>
            <List size={18} className="me-2" />
            Gestión de Stock
          </button>
      </header>

      {/* Filtros */}
      <div className="filters-container">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            placeholder="Buscar por # pedido"
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
        
        <button className="btn btn-reset" onClick={resetFiltros}>
          <RefreshCw size={16} className="me-2" />
          Limpiar filtros
        </button>
      </div>

      {/* Estado de carga y errores */}
      {loading && <div className="loading-state">Cargando pedidos...</div>}
      {error && <div className="error-state">{error}</div>}

      {/* Tabla de pedidos */}
      <div className="pedidos-table-container">
        <table className="pedidos-table">
          <thead>
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
                className={selected?.id_pedido === p.id_pedido ? 'selected' : ''}
                onClick={() => setSelected(p)}
              >
                <td>{p.id_pedido}</td>
                <td>{new Date(p.fecha_pedido).toLocaleDateString()}</td>
                <td>{p.despacho}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(p.estado)}`}>
                    {p.estado}
                  </span>
                </td>
              </tr>
            ))}
            {pedidos.length === 0 && !loading && (
              <tr>
                <td colSpan="4" className="no-results">
                  No hay pedidos que coincidan con los filtros
                </td>
              </tr>
            )}
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
                  <span className="detail-label">Fecha pedido:</span>
                  <span>{new Date(selected.fecha_pedido).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Fecha entrega:</span>
                  <span>{new Date(selected.fecha_entrega).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Despacho:</span>
                  <span>{selected.despacho}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Estado:</span>
                  <span className={`status-badge ${getStatusClass(selected.estado)}`}>
                    {selected.estado}
                  </span>
                </div>
              </div>
            </div>

            {/* Sección de productos */}
            <div className="detail-section">
              <h4>Productos ({selected.productos?.length || 0})</h4>
              {selected.productos && selected.productos.length > 0 ? (
                <div className="productos-table-container">
                  <table className="productos-table">
                    <thead>
                      <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Marca</th>
                        <th>Código</th>
                        <th>Cantidad</th>
                        <th>Precio Unit.</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.productos.map((prod, index) => (
                        <tr key={`${prod.id_prod}-${index}`}>
                          <td>
                            {prod.foto ? (
                              <img 
                                src={prod.foto} 
                                alt={prod.nom_prod} 
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
                          <td>{prod.nom_prod}</td>
                          <td>{prod.marca_prod}</td>
                          <td>{prod.codigo_fabricante}</td>
                          <td>{prod.cantidad}</td>
                          <td>${prod.precio_prod.toLocaleString('es-CL')}</td>
                          <td>${(prod.precio_prod * prod.cantidad).toLocaleString('es-CL')}</td>
                        </tr>
                      ))}
                      <tr className="total-row">
                        <td colSpan="6" className="text-end">Total:</td>
                        <td>${selected.productos.reduce(
                          (sum, prod) => sum + (prod.precio_prod * prod.cantidad), 0
                        ).toLocaleString('es-CL')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="no-products">
                  <Package size={24} className="me-2" />
                  No hay productos en este pedido
                </div>
              )}
            </div>
          </div>
          
          <div className="detail-actions">
            <button
              className="btn btn-action"
              onClick={() => cambiarEstado(selected.id_pedido, 6)}
              disabled={selected.id_estado === 6}
            >
              <Package size={16} className="me-2" />
              Marcar en Preparación
            </button>

            {selected.id_estado === 6 && (
              <button
                className="btn btn-action success"
                onClick={() => marcarCompletado(selected.id_pedido)}
              >
                <CheckCircle size={16} className="me-2" />
                Marcar Completado
              </button>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
  );

  // Función auxiliar para clases de estado
  function getStatusClass(estado) {
    switch(estado) {
      case 'Completado': return 'success';
      case 'En preparación': return 'info';
      case 'Confirmado': return 'warning';
      default: return 'default';
    }
  }
};

export default Bodega;