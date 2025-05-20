import React, { useState, useEffect } from 'react';
import MenuService from '../../Servicios/Menu/MenuService';
import authguard from '../../Servicios/AuthGuard/authguard';

const MiCuenta = () => {
  // datos de localStorage
  const usuarioLocal = authguard.obtenerUsuario() || {};
  const { id_user, rol } = usuarioLocal;

  // estados internos
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  const menuItems = MenuService.obtenerMenuPorRol(rol?.id);
  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  useEffect(() => {
    if (!id_user) {
      setError('Usuario no identificado');
      return;
    }
    fetch(`http://localhost:8000/api/usuarios/datos_cliente/?id_user=${id_user}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setDatos)
      .catch(() => setError('No se pudieron cargar datos'));
  }, [id_user]);

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
            <p><strong>Nombre:</strong> {datos.nombre_user} {datos.apellido_user}</p>
            <p><strong>RUT:</strong> {datos.rut_user}-{datos.dv_user}</p>
            <p><strong>Celular:</strong> {datos.celular_user}</p>
            <p><strong>Email:</strong> {datos.email_user}</p>

            <h3>Dirección</h3>
            <p>{datos.direccion_user}</p>
            <p><strong>Comuna:</strong> {datos.comuna.nombre}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default MiCuenta;
