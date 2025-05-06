import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authguard from '../../Servicios/AuthGuard/authguard';
import MenuService from '../../Servicios/Menu/MenuService';

const Catalogo = () => {
  const navigate = useNavigate();
  const usuario = authguard.obtenerUsuario();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  return (
    <div className="catalogo-container container py-4">
      <h1 className="mb-3">Catálogo de Productos</h1>
      <p className="mb-4">Aquí se mostrarán los productos disponibles en Ferremas.</p>

      {usuario && (
        <div className="alert alert-info">
          <strong>Bienvenido:</strong> {usuario.nombre_user} ({usuario.email_user})<br />
          <strong>Rol:</strong> {usuario.rol?.nombre} (ID: {usuario.rol?.id})
        </div>
      )}

      <div className="d-flex gap-2">
        <button className="btn btn-secondary" onClick={toggleMenu}>
          ☰ Menú
        </button>

        <button className="btn btn-danger" onClick={() => {
          authguard.cerrarSesion();
          navigate('/login');
        }}>
          Cerrar sesión
        </button>
      </div>

      {menuAbierto && (
        <div className="mt-4 border p-3 bg-light rounded">
          <h5>Opciones disponibles</h5>
          <ul className="list-unstyled">
            {MenuService.obtenerMenuPorRol(usuario?.rol?.id).map((opcion, idx) => (
              <li key={idx}>
                <a href={opcion.ruta} className="btn btn-outline-primary w-100 mb-2">
                  {opcion.nombre}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Catalogo;