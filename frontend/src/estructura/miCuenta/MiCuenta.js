import React, { useState, useEffect } from 'react';
import MenuService from '../../Servicios/Menu/MenuService';
import authguard from '../../Servicios/AuthGuard/authguard';

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

  return (
    <div className={`catalogo-wrapper ${menuAbierto ? 'menu-abierto' : ''}`}>
      {/* NAVBAR */}
      <nav className="d-flex justify-content-between align-items-center p-3 bg-light">
        <div className="d-flex align-items-center">
          <button
            className="btn-hamburguesa-mi-cuenta btn btn-sm me-2"
            onClick={toggleMenu}
            aria-label="Abrir menú"
          >
            ☰
          </button>
          <h1 className="mb-0">
            Hola{usuarioLocal?.nombre_user ? `, ${usuarioLocal.nombre_user}` : ''}
          </h1>
        </div>
      </nav>

      {/* MENÚ LATERAL */}
      <div className={`menu-lateral ${menuAbierto ? 'abierto' : ''}`}>
        <h5 className="menu-header">{rol?.nombre || 'Menú'}</h5>
        <button
          className="btn btn-sm btn-outline-secondary mb-3"
          onClick={toggleMenu}
        >
          ✕ Cerrar menú
        </button>
        <ul className="menu-items list-unstyled">
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <a href={item.ruta} className="menu-link d-block py-1">
                {item.nombre}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* CONTENIDO */}
      <div className="contenido p-3">
        {error && <div className="alert alert-danger">{error}</div>}
        {!error && !datos && <div>Cargando datos...</div>}

        {datos && (
          <>
            <h2>Datos personales del cliente</h2>

            {editando ? (
              <>
                <div className="mb-2">
                  <label className="form-label">Nombre:</label>
                  <input name="nombre_user" value={form.nombre_user} onChange={handleInputChange} className="form-control" />
                </div>
                <div className="mb-2">
                  <label className="form-label">Apellido:</label>
                  <input name="apellido_user" value={form.apellido_user} onChange={handleInputChange} className="form-control" />
                </div>
                <div className="mb-2">
                  <label className="form-label">RUT:</label>
                  <input name="rut_user" value={form.rut_user} readOnly className="form-control" />
                </div>
                <div className="mb-2">
                  <label className="form-label">DV:</label>
                  <input name="dv_user" value={form.dv_user} readOnly className="form-control" />
                </div>
                <div className="mb-2">
                  <label className="form-label">Celular:</label>
                  <input name="celular_user" value={form.celular_user} onChange={handleInputChange} className="form-control" />
                </div>
                <div className="mb-2">
                  <label className="form-label">Email:</label>
                  <input name="email_user" value={form.email_user} onChange={handleInputChange} className="form-control" />
                </div>
                <div className="mb-2">
                  <label className="form-label">Dirección:</label>
                  <input name="direccion_user" value={form.direccion_user} onChange={handleInputChange} className="form-control" />
                </div>
                <div className="mb-2">
                  <label className="form-label">Sucursal de preferencia:</label>
                  <select
                    name="id_sucursal"
                    className="form-select"
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
                  {form.id_sucursal && (
                    <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
                      <iframe
                        title="Mapa sucursal seleccionada"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.API_MAPS_KEY}&q=${encodeURIComponent(
                          sucursales.find(s => s.id_sucursal === parseInt(form.id_sucursal))?.direccion_sucursal || ''
                        )}`}
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </div>
                <button className="btn btn-success me-2" onClick={handleGuardar}>Guardar</button>
                <button className="btn btn-secondary" onClick={() => setEditando(false)}>Cancelar</button>
              </>
            ) : (
              <>
                <p><strong>Nombre:</strong> {datos.nombre_user} {datos.apellido_user}</p>
                <p><strong>RUT:</strong> {datos.rut_user}-{datos.dv_user}</p>
                <p><strong>Celular:</strong> {datos.celular_user}</p>
                <p><strong>Email:</strong> {datos.email_user}</p>
                <h3>Dirección</h3>
                <p>{datos.direccion_user}</p>
                <p><strong>Comuna:</strong> {datos.comuna.nombre}</p>
                <p><strong>Sucursal de preferencia:</strong> {nombreSucursal || 'Cargando...'}</p>
                <button className="btn btn-primary me-2" onClick={() => setEditando(true)}>Editar datos</button>
                <button className="btn btn-danger" onClick={handleEliminar}>Eliminar cuenta</button>
              </>
            )}
          </>
        )}
      </div>
      <div>
        <h3 className="mt-5">Historial de pedidos</h3>
          {pedidos.length === 0 ? (
            <p>No has realizado pedidos aún.</p>
          ) : (
            <table className="table table-bordered mt-2">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha pedido</th>
                  <th>Entrega estimada</th>
                  <th>Dirección de despacho</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Comprobante</th>
                  <th>Despacho</th>
                  <th>Sucursal</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map(p => (
                  <tr
                    key={p.id_pedido}
                    onClick={() => verDetallePedido(p.id_pedido)}
                    style={{ cursor: 'pointer', backgroundColor: pedidoSeleccionado === p.id_pedido ? '#f0f0f0' : 'white' }}
                  >
                    <td>{p.id_pedido}</td>
                    <td>{new Date(p.fecha_pedido).toLocaleDateString()}</td>
                    <td>{new Date(p.fecha_estimada).toLocaleDateString()}</td>
                    <td>{p.direccion_despacho}</td>
                    <td>${p.total_pedido.toLocaleString()}</td>
                    <td>{p.estado}</td>
                    <td>{p.comprobante}</td>
                    <td>{p.despacho}</td>
                    <td>{p.sucursal}</td>
                    <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarPedido(p.id_pedido)}
                      disabled={!([1, 5, 6].includes(p.id_estado))}
                    >
                      Eliminar
                    </button>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
        {pedidoSeleccionado && (
          <div className="mt-4">
            <h4>Detalle del Pedido #{pedidoSeleccionado}</h4>
            {detallePedido.length === 0 ? (
              <p>No hay productos en este pedido.</p>
            ) : (
              <table className="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Marca</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Imagen</th>
                  </tr>
                </thead>
                <tbody>
                  {detallePedido.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.nom_prod}</td>
                      <td>{item.marca_prod}</td>
                      <td>{item.cantidad}</td>
                      <td>
                        {item.precio_prod != null
                          ? `$${item.precio_prod.toLocaleString('es-CL')}`
                          : 'No disponible'}
                      </td>
                      <td>
                        {item.foto ? (
                          <img
                              src={item.foto}
                              alt="producto"
                              width="60"
                            />
                        ) : (
                          'Sin imagen'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
    </div>
  );
};

export default MiCuenta;
