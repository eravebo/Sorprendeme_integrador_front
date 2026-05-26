import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Ruta privada para usuarios clientes
export function PrivateRoute({ children }) {
  const { usuarioActual } = useAuth();
  if (!usuarioActual) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Ruta privada para el panel admin
export function AdminRoute({ children }) {
  const { adminLogueado } = useAuth();
  if (!adminLogueado) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}
