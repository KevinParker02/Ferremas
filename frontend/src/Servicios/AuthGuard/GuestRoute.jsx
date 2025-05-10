import { Navigate } from 'react-router-dom';
import authguard from './authguard';

export function GuestRoute({ children }) {
  // Si ya está logueado, redirige según rol
  if (authguard.estaAutenticado()) {
    const rol = authguard.obtenerRol();
    switch (rol) {
      case 11: return <Navigate to="/admin" replace />;
      case 21: return <Navigate to="/vendedor" replace />;
      case 31: return <Navigate to="/bodega" replace />;
      case 41: return <Navigate to="/contador" replace />;
      case 51: return <Navigate to="/catalogo" replace />;
      default: return <Navigate to="/login" replace />;
    }
  }
  // Si no está logueado, deja pasar
  return children;
}
