import React from 'react';
import { useNavigate } from 'react-router-dom';
import authguard from '../../Servicios/AuthGuard/authguard'; 

const Catalogo = () => {
  const navigate = useNavigate();
  const usuario = authguard.obtenerUsuario();

  return (
    <div className="catalogo-container">
      <h1>Catálogo de Productos</h1>
      <p>Aquí se mostrarán los productos disponibles en Ferremas.</p>

      {usuario && (
        <div className="alert alert-info">
          <strong>Bienvenido:</strong> {usuario.nombre_user} ({usuario.email_user})<br />
          <strong>Rol:</strong> {usuario.rol?.nombre} (ID: {usuario.rol?.id})
        </div>
      )}

      <button className="btn btn-danger mt-3" onClick={() => {
        authguard.cerrarSesion();
        navigate('/login');
      }}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Catalogo;