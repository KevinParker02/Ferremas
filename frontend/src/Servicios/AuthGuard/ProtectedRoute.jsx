import { Navigate } from 'react-router-dom';
import authguard from './authguard';

export function ProtectedRoute({ children, roles = [] }) {
  const rolUsuario = authguard.obtenerRol();

  if (!authguard.estaAutenticado()) {
    return <Navigate to="/login" replace />;
  }
  if (roles.length && !roles.includes(rolUsuario)) {
    return <Navigate to="/error" replace />;
  }
  return children;
}
