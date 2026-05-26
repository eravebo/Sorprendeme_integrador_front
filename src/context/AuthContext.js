import { createContext, useContext, useState } from 'react';
import { registrarUsuario, loginUsuario } from '../api/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuarioActual, setUsuarioActual] = useState(function() {
    var guardado = localStorage.getItem('usuario-session');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [adminLogueado, setAdminLogueado] = useState(function() {
    return localStorage.getItem('admin-session') === 'true';
  });

  /**
   * Registro de usuario cliente.
   * Ahora llama al backend en lugar de guardar en localStorage.
   * Envia: nombre, email, password — los mismos campos del formulario.
   */
  async function registrar(nombre, email, password) {
    try {
      var usuario = await registrarUsuario({ nombre, email, password });
      // Guardamos la sesion en localStorage para que persista al recargar
      localStorage.setItem('usuario-session', JSON.stringify(usuario));
      setUsuarioActual(usuario);
      return { ok: true };
    } catch (error) {
      return { ok: false, msg: error.message };
    }
  }

  /**
   * Login de usuario cliente.
   * Ahora verifica las credenciales contra la base de datos real.
   */
  async function login(email, password) {
    try {
      var usuario = await loginUsuario(email, password);
      localStorage.setItem('usuario-session', JSON.stringify(usuario));
      setUsuarioActual(usuario);
      return { ok: true };
    } catch (error) {
      return { ok: false, msg: error.message };
    }
  }

  function logout() {
    localStorage.removeItem('usuario-session');
    setUsuarioActual(null);
  }

  // Login de admin — sigue siendo local (no necesita BD)
  function loginAdmin(usuario, password) {
    if (usuario === 'admin' && password === 'sorprendeme123') {
      localStorage.setItem('admin-session', 'true');
      setAdminLogueado(true);
      return { ok: true };
    }
    return { ok: false, msg: 'Usuario o contrasena incorrectos' };
  }

  function logoutAdmin() {
    localStorage.removeItem('admin-session');
    setAdminLogueado(false);
  }

  return (
    <AuthContext.Provider value={{
      usuarioActual,
      adminLogueado,
      registrar,
      login,
      logout,
      loginAdmin,
      logoutAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
