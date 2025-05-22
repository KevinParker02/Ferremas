import React from 'react';
import { useNavigate } from 'react-router-dom';
import authguard from '../../Servicios/AuthGuard/authguard';
import { Home, Frown, RefreshCw } from 'react-feather';
import './error.css'; // Archivo CSS para estilos

const Error = () => {
  const navigate = useNavigate();
  const usuario = authguard.obtenerUsuario();

  const volverInicio = () => {
    // Redirige según el rol del usuario
    if (usuario && usuario.id_rol) {
      switch(usuario.id_rol) {
        case 1: // Admin
          navigate('/admin');
          break;
        case 2: // Bodega
          navigate('/bodega');
          break;
        case 3: // Vendedor
          navigate('/ventas');
          break;
        default:
          navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };

  const recargarPagina = () => {
    window.location.reload();
  };

  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-icon">
          <Frown size={80} />
          <div className="error-emoji">😵</div>
        </div>
        
        <h1 className="error-title">¡Ups! Página no encontrada</h1>
        <p className="error-message">
          Lo sentimos, pero la página que buscas no existe, se eliminó o nunca existió...
        </p>
        
        <div className="error-actions">
          <button 
            className="btn btn-primary"
            onClick={volverInicio}
          >
            <Home size={18} className="me-2" />
            Volver al inicio
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={recargarPagina}
          >
            <RefreshCw size={18} className="me-2" />
            Recargar página
          </button>
        </div>
        
        <div className="error-code">
          Error 404 - Página no encontrada
        </div>
      </div>
    </div>
  );
};

export default Error;