import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Pagina de login exclusiva para el administrador.
 * Ruta: /admin/login
 *
 * Separada del login de clientes para mayor claridad.
 * Si el admin ya esta logueado, lo redirige directo al panel.
 */
export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin, adminLogueado } = useAuth();

  const [form, setForm] = useState({ usuario: '', password: '' });
  const [error, setError] = useState('');

  // Si ya esta logueado lo mandamos al panel directamente
  if (adminLogueado) {
    navigate('/admin');
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    var resultado = loginAdmin(form.usuario, form.password);
    if (resultado.ok) {
      navigate('/admin');
    } else {
      setError(resultado.msg);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5',
      padding: '2rem'
    }}>
      <div className="login-card" style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img src="/img/Sorprendeme.png" alt="Sorprendeme" style={{ height: '80px', width: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto' }} />
          <h2 style={{ marginTop: '1rem', color: 'var(--color-primario)' }}>Panel Administrador</h2>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Acceso exclusivo para administradores</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grupo">
            <label>Usuario</label>
            <input
              type="text"
              placeholder="Usuario administrador"
              value={form.usuario}
              onChange={function(e) { setForm(function(f) { return { ...f, usuario: e.target.value }; }); }}
              required
            />
          </div>

          <div className="form-grupo">
            <label>Contrasena</label>
            <input
              type="password"
              placeholder="Contrasena"
              value={form.password}
              onChange={function(e) { setForm(function(f) { return { ...f, password: e.target.value }; }); }}
              required
            />
          </div>

          {error && (
            <span className="error-msg" style={{ display: 'block', marginBottom: '1rem' }}>
              {error}
            </span>
          )}

          <button type="submit" className="btn-primary btn-block">
            Ingresar al Panel
          </button>
        </form>

        {/* Enlace para volver a la tienda */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#888' }}>
          <a href="/" style={{ color: 'var(--color-primario)' }}>Volver a la tienda</a>
        </p>
      </div>
    </div>
  );
}
