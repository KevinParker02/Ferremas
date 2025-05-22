import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, Edit, Trash2, ShoppingBag, MapPin, Phone, Mail, User, CreditCard, CheckCircle, Package } from 'react-feather';
import MenuService from '../../Servicios/Menu/MenuService';
import authguard from '../../Servicios/AuthGuard/authguard';
import logoFerremas from '../../img/logo-ferremas.png';
import './miCuenta.css';

const MiCuenta = () => {
  const usuarioLocal = authguard.obtenerUsuario() || {};
  const { id_user, rol } = usuarioLocal;

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const [sucursales, setSucursales] = useState([]);
  const [nombreSucursal, setNombreSucursal] = useState('');

  const [pedidos, setPedidos] = useState([]);
  const [detallePedido, setDetallePedido] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const menuItems = MenuService.obtenerMenuPorRol(rol?.id);
  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  useEffect(() => {
    if (!id_user) {
      setError('Usuario no identificado');
      return;
    }

    // Obtener datos del usuario
    fetch(`http://localhost:8000/api/usuarios/datos_cliente/?id_user=${id_user}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setDatos(data);
        setForm({
          nombre_user: data.nombre_user,
          apellido_user: data.apellido_user,
          rut_user: data.rut_user,
          dv_user: data.dv_user,
          celular_user: data.celular_user,
          email_user: data.email_user,
          direccion_user: data.direccion_user,
          id_sucursal: data.comuna.id, 
          id_comuna: data.comuna.id
        });
      })
      .catch(() => setError('No se pudieron cargar datos'));

    // Obtener sucursales
    fetch('http://localhost:8000/api/sucursales/')
      .then(res => res.json())
      .then(setSucursales)
      .catch(() => setError('No se pudieron cargar las sucursales'));
    
    fetch(`http://localhost:8000/api/pedidos/cliente/?id_user=${id_user}`)
      .then(res => res.json())
      .then(data => setPedidos(data))
      .catch(() => console.error('Error al cargar pedidos'));
  }, [id_user]);

  const verDetallePedido = (id_pedido) => {
    fetch(`http://localhost:8000/api/pedidos/${id_pedido}/detalle/`)
      .then(res => res.json())
      .then(data => {
        setPedidoSeleccionado(id_pedido);
        setDetallePedido(data);
      })
      .catch(() => alert('Error al cargar el detalle del pedido'));
  };

  const handleInputChange = e => {
    const { name, value } = e.target;

    if (name === 'id_sucursal') {
      const sucursal = sucursales.find(s => s.id_sucursal === parseInt(value));
      if (sucursal) {
        setForm(prev => ({
          ...prev,
          id_sucursal: sucursal.id_sucursal,
          id_comuna: sucursal.id_comuna
        }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGuardar = () => {
    fetch('http://localhost:8000/api/usuarios/editar_cliente/', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_user, ...form })
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setDatos(prev => ({ ...prev, ...form }));

        const usuarioActualizado = {
          ...usuarioLocal,
          id_sucursal: form.id_sucursal,
          id_comuna: form.id_comuna
        };
        authguard.guardarUsuario(usuarioActualizado);

        setEditando(false);
        alert('Datos actualizados correctamente.');
      })
      .catch(() => alert('Error al actualizar los datos.'));
  };

  const handleEliminar = () => {
    const confirmar = window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (!confirmar) return;

    fetch(`http://localhost:8000/api/usuarios/${id_user}/`, {
      method: 'DELETE'
    })
    .then(res => {
      if (res.status === 204) {
        authguard.cerrarSesion();
        alert('Cuenta eliminada correctamente.');
        window.location.href = '/login';
      } else {
        throw new Error();
      }
    })
    .catch(() => alert('Error al eliminar la cuenta.'));
  };

  useEffect(() => {
    if (!id_user) return;

    fetch(`http://localhost:8000/api/sucursales/del_usuario/?id_user=${id_user}`)
      .then(res => res.json())
      .then(data => {
        setNombreSucursal(`${data.direccion_sucursal}`);
      })
      .catch(() => {
        setNombreSucursal(`Sucursal ID ${usuarioLocal.id_sucursal}`);
      });
  }, [id_user]);

  const eliminarPedido = (id_pedido) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este pedido?');
    if (!confirmar) return;

    fetch(`http://localhost:8000/api/pedidos/${id_pedido}/`, {
      method: 'DELETE'
    })
      .then(res => {
        if (res.status === 204) {
          setPedidos(prev => prev.filter(p => p.id_pedido !== id_pedido));
          alert('Pedido eliminado correctamente.');
        } else {
          throw new Error();
        }
      })
      .catch(() => alert('Error al eliminar el pedido.'));
  };

  const cerrarSesion = () => {
    authguard.cerrarSesion();
    window.location.href = '/login';
  };

  return (
    <div className={`mi-cuenta-wrapper ${menuAbierto ? 'menu-abierto' : ''}`}>
      {/* Menú lateral */}
      <div className={`menu-lateral ${menuAbierto ? 'abierto' : ''}`}>
        <div className="menu-header">
          <h5>{rol?.nombre || 'Menú'}</h5>
          <button className="btn-cerrar-menu" onClick={toggleMenu}>
            <X size={20} />
          </button>
        </div>
        <ul className="menu-items">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button 
                className="menu-link"
                onClick={() => {
                  window.location.href = item.ruta;
                  setMenuAbierto(false);
                }}
              >
                {item.icono && <span className="menu-icon">{item.icono}</span>}
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

      {/* Contenido principal */}
      <div className="contenido-principal">
        <header className="mi-cuenta-header">
          <div className="header-izquierda">
            <button className="btn-menu" style={{ color: 'white' }} onClick={toggleMenu}>
              <Menu size={20} />
            </button>
            <img 
              src={logoFerremas} 
              alt="Logo Ferremas" 
              className="header-logo"
            />
          </div>
          <div className="header-actions">
            <h1>Mi Cuenta</h1>
          </div>
        </header>

        <main className="mi-cuenta-main">
          {error && <div className="alert alert-danger">{error}</div>}
          {!error && !datos && <div className="loading">Cargando datos...</div>}

          {datos && (
            <div className="mi-cuenta-container">
              <div className="usuario-info">
                <h2><User size={20} className="me-2" /> Información Personal</h2>
                
                {editando ? (
                  <div className="form-edicion">
                    <div className="form-gridd">
                      <div className="form-grupo">
                        <label>Nombre</label>
                        <input 
                          name="nombre_user" 
                          value={form.nombre_user} 
                          onChange={handleInputChange} 
                          className="formulario-control" 
                        />
                      </div>
                      <div className="form-grupo">
                        <label>Apellido</label>
                        <input 
                          name="apellido_user" 
                          value={form.apellido_user} 
                          onChange={handleInputChange} 
                          className="formulario-control" 
                        />
                      </div>
                      <div className="form-grupo">
                        <label>RUT</label>
                        <input 
                          name="rut_user" 
                          value={form.rut_user} 
                          readOnly 
                          className="formulario-control" 
                        />
                      </div>
                      <div className="form-grupo">
                        <label>DV</label>
                        <input 
                          name="dv_user" 
                          value={form.dv_user} 
                          readOnly 
                          className="formulario-control" 
                        />
                      </div>
                      <div className="form-grupo">
                        <label><Phone size={16} className="me-2" /> Celular</label>
                        <input 
                          name="celular_user" 
                          value={form.celular_user} 
                          onChange={handleInputChange} 
                          className="formulario-control" 
                        />
                      </div>
                      <div className="form-grupo">
                        <label><Mail size={16} className="me-2" /> Email</label>
                        <input 
                          name="email_user" 
                          value={form.email_user} 
                          onChange={handleInputChange} 
                          className="formulario-control" 
                        />
                      </div>
                      <div className="form-grupo">
                        <label><MapPin size={16} className="me-2" /> Dirección</label>
                        <input 
                          name="direccion_user" 
                          value={form.direccion_user} 
                          onChange={handleInputChange} 
                          className="formulario-control" 
                        />
                      </div>
                      <div className="form-grupo full-width">
                        <label>Sucursal de preferencia</label>
                        <select
                          name="id_sucursal"
                          className="formulario-control"
                          value={form.id_sucursal}
                          onChange={handleInputChange}
                        >
                          <option value="">Seleccione una sucursal</option>
                          {sucursales.map(s => (
                            <option key={s.id_sucursal} value={s.id_sucursal}>
                              {`${s.direccion_sucursal}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {form.id_sucursal && (
                      <div className="mapa-sucursal">
                        <iframe
                          title="Mapa sucursal seleccionada"
                          width="100%"
                          height="300"
                          frameBorder="0"
                          style={{ border: 0, borderRadius: '8px' }}
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyALIfPxz3MqW2xJbVhR4fVvnMPGZ6r3hro&q=${encodeURIComponent(
                            sucursales.find(s => s.id_sucursal === parseInt(form.id_sucursal))?.direccion_sucursal || ''
                          )}`}
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}

                    <div className="form-actions">
                      <button className="btn btn-primary" onClick={handleGuardar}>
                        <CheckCircle size={16} className="me-2" /> Guardar cambios
                      </button>
                      <button className="btn btn-secondary" onClick={() => setEditando(false)}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="info-usuario">
                    <div className="info-gridd">
                      <div className="info-item">
                        <span className="info-label">Nombre completo:</span>
                        <span className="info-value">{datos.nombre_user} {datos.apellido_user}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">RUT:</span>
                        <span className="info-value">{datos.rut_user}-{datos.dv_user}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label"><Phone size={16} className="me-2" /> Celular:</span>
                        <span className="info-value">{datos.celular_user}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label"><Mail size={16} className="me-2" /> Email:</span>
                        <span className="info-value">{datos.email_user}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label"><MapPin size={16} className="me-2" /> Dirección:</span>
                        <span className="info-value">{datos.direccion_user}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Comuna:</span>
                        <span className="info-value">{datos.comuna.nombre}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Sucursal de preferencia:</span>
                        <span className="info-value">{nombreSucursal || 'Cargando...'}</span>
                      </div>
                    </div>

                    <div className="usuario-actions">
                      <button className="btn btn-editar" onClick={() => setEditando(true)}>
                        <Edit size={16} className="me-2" /> Editar datos
                      </button>
                      <button className="btn btn-dangerr" onClick={handleEliminar}>
                        <Trash2 size={16} className="me-2" /> Eliminar cuenta
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="historial-pedidos">
                <h2><ShoppingBag size={20} className="me-2" /> Historial de Pedidos</h2>
                
                {pedidos.length === 0 ? (
                  <div className="no-pedidos">
                    <ShoppingBag size={48} className="mb-3" />
                    <p>No has realizado pedidos aún.</p>
                  </div>
                ) : (
                  <div className="pedidos-container">
                    <div className="pedidos-list">
                      {pedidos.map(p => (
                        <div 
                          key={p.id_pedido} 
                          className={`pedido-card ${pedidoSeleccionado === p.id_pedido ? 'selected' : ''}`}
                          onClick={() => verDetallePedido(p.id_pedido)}
                        >
                          <div className="pedido-header">
                            <span className="pedido-id">Pedido #{p.id_pedido}</span>
                            <span className={`pedido-estado ${p.estado.toLowerCase().replace(' ', '-')}`}>
                              {p.estado}
                            </span>
                          </div>
                          <div className="pedido-info">
                            <div>
                              <span className="info-label">Fecha:</span>
                              <span>{new Date(p.fecha_pedido).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="info-label">Total:</span>
                              <span className="pedido-total">${p.total_pedido.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="pedido-actions">
                            <button
                              className="btn btn-sm btn-dangerr"
                              onClick={(e) => {
                                e.stopPropagation();
                                eliminarPedido(p.id_pedido);
                              }}
                              disabled={!([1, 5, 6].includes(p.id_estado))}
                            >
                              <Trash2 size={14} /> Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {pedidoSeleccionado && (
                      <div className="pedido-detalle">
                        <h3>Detalle del Pedido #{pedidoSeleccionado}</h3>
                        
                        {detallePedido.length === 0 ? (
                          <div className="no-productos">
                            <Package size={48} className="mb-3" />
                            <p>No hay productos en este pedido.</p>
                          </div>
                        ) : (
                          <div className="productos-list">
                            <div className="productos-header">
                              <span>Producto</span>
                              <span>Cantidad</span>
                              <span>Precio</span>
                            </div>
                            {detallePedido.map((item, idx) => (
                              <div key={idx} className="producto-item">
                                <div className="producto-informacion">
                                  {item.foto ? (
                                    <img src={item.foto} alt={item.nom_prod} className="producto-img" />
                                  ) : (
                                    <div className="producto-img-placeholder">
                                      <Package size={20} />
                                    </div>
                                  )}
                                  <div>
                                    <div className="producto-nombre">{item.nom_prod}</div>
                                    <div className="producto-marca">{item.marca_prod}</div>
                                  </div>
                                </div>
                                <div className="producto-cantidad">{item.cantidad}</div>
                                <div className="producto-precio">
                                  ${item.precio_prod?.toLocaleString('es-CL') || '0'}
                                </div>
                              </div>
                            ))}
                            <div className="producto-total">
                              <span>Total:</span>
                              <span>
                                ${detallePedido.reduce(
                                  (sum, prod) => sum + (prod.precio_prod * prod.cantidad), 0
                                ).toLocaleString('es-CL')}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MiCuenta;