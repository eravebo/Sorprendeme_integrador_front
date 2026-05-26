import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/Footer';

export default function Login() {
  var [tab, setTab] = useState('login');
  var navigate = useNavigate();
  var auth = useAuth();
  var login = auth.login;
  var registrar = auth.registrar;

  var [loginForm, setLoginForm] = useState({ email: '', password: '' });
  var [loginError, setLoginError] = useState('');
  var [loginCargando, setLoginCargando] = useState(false);

  var [regForm, setRegForm] = useState({ nombre: '', email: '', password: '', confirmar: '' });
  var [regError, setRegError] = useState('');
  var [regCargando, setRegCargando] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    setLoginCargando(true);
    var resultado = await login(loginForm.email, loginForm.password);
    setLoginCargando(false);
    if (resultado.ok) {
      navigate('/');
    } else {
      setLoginError(resultado.msg);
    }
  }

  async function handleRegistro(e) {
    e.preventDefault();
    setRegError('');

    if (regForm.nombre.trim().length < 3) return setRegError('Ingresa tu nombre completo');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email)) return setRegError('Correo no valido');
    if (regForm.password.length < 6) return setRegError('La contrasena debe tener al menos 6 caracteres');
    if (regForm.password !== regForm.confirmar) return setRegError('Las contrasenas no coinciden');

    setRegCargando(true);
    var resultado = await registrar(regForm.nombre, regForm.email, regForm.password);
    setRegCargando(false);
    if (resultado.ok) {
      navigate('/');
    } else {
      setRegError(resultado.msg);
    }
  }

  return (
    <div>
      <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="login-card" style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <img src="/img/Sorprendeme.png" alt="Sorprendeme" style={{ height: '60px' }} />
          </div>

          <div className="login-tabs">
            <button className={`tab-btn ${tab === 'login' ? 'activo' : ''}`}
              onClick={function() { setTab('login'); setLoginError(''); }}>
              Iniciar sesion
            </button>
            <button className={`tab-btn ${tab === 'registro' ? 'activo' : ''}`}
              onClick={function() { setTab('registro'); setRegError(''); }}>
              Registrarse
            </button>
          </div>

          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="form-grupo">
                <label>Correo electronico</label>
                <input type="email" placeholder="tu@correo.com" value={loginForm.email}
                  onChange={function(e) { setLoginForm(function(f) { return { ...f, email: e.target.value }; }); }}
                  required />
              </div>
              <div className="form-grupo">
                <label>Contrasena</label>
                <input type="password" placeholder="••••••••" value={loginForm.password}
                  onChange={function(e) { setLoginForm(function(f) { return { ...f, password: e.target.value }; }); }}
                  required />
              </div>
              {loginError && <span className="error-msg" style={{ display: 'block', marginBottom: '1rem' }}>{loginError}</span>}
              <button type="submit" className="btn-primary btn-block" disabled={loginCargando}>
                {loginCargando ? 'Verificando...' : 'Ingresar'}
              </button>
              <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#888' }}>
                No tienes cuenta?{' '}
                <button type="button" className="link-btn" onClick={function() { setTab('registro'); }}>Registrate</button>
              </p>
            </form>
          )}

          {tab === 'registro' && (
            <form onSubmit={handleRegistro}>
              <div className="form-grupo">
                <label>Nombre completo</label>
                <input type="text" placeholder="Ej: Maria Gomez" value={regForm.nombre}
                  onChange={function(e) { setRegForm(function(f) { return { ...f, nombre: e.target.value }; }); }}
                  required />
              </div>
              <div className="form-grupo">
                <label>Correo electronico</label>
                <input type="email" placeholder="tu@correo.com" value={regForm.email}
                  onChange={function(e) { setRegForm(function(f) { return { ...f, email: e.target.value }; }); }}
                  required />
              </div>
              <div className="form-grupo">
                <label>Contrasena</label>
                <input type="password" placeholder="Minimo 6 caracteres" value={regForm.password}
                  onChange={function(e) { setRegForm(function(f) { return { ...f, password: e.target.value }; }); }}
                  required />
              </div>
              <div className="form-grupo">
                <label>Confirmar contrasena</label>
                <input type="password" placeholder="Repite la contrasena" value={regForm.confirmar}
                  onChange={function(e) { setRegForm(function(f) { return { ...f, confirmar: e.target.value }; }); }}
                  required />
              </div>
              {regError && <span className="error-msg" style={{ display: 'block', marginBottom: '1rem' }}>{regError}</span>}
              <button type="submit" className="btn-primary btn-block" disabled={regCargando}>
                {regCargando ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
              <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#888' }}>
                Ya tienes cuenta?{' '}
                <button type="button" className="link-btn" onClick={function() { setTab('login'); }}>Inicia sesion</button>
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
