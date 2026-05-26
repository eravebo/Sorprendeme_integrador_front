import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { totalItems } = useCarrito();
  const { usuarioActual, logout, adminLogueado } = useAuth();

  function cerrarMenu() { setMenuAbierto(false); }

  return (
    <header>
      <nav className="navbar">
        <button
          className={`menuresponsive ${menuAbierto ? 'abierto' : ''}`}
          onClick={() => setMenuAbierto(function(v) { return !v; })}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>

        <div className="nav-container">
          <div className="nav-logo-img">
            <Link to="/" onClick={cerrarMenu}>
              <img src="/img/Sorprendeme.png" alt="Sorprendeme" />
            </Link>
          </div>

          <ul className={`nav-links ${menuAbierto ? 'abierto' : ''}`}>
            <li><NavLink to="/" end onClick={cerrarMenu}>Inicio</NavLink></li>
            <li><a href="/#productos" onClick={cerrarMenu}>Productos</a></li>
            <li><NavLink to="/mis-pedidos" onClick={cerrarMenu}>Mis pedidos</NavLink></li>
            <li><a href="/#footer" onClick={cerrarMenu}>Contacto</a></li>

            {/* Si el admin esta logueado muestra enlace al panel */}
            {adminLogueado && (
              <li>
                <NavLink
                  to="/admin"
                  onClick={cerrarMenu}
                  style={{ color: 'var(--color-primario)', fontWeight: 'bold' }}
                >
                  Panel Admin
                </NavLink>
              </li>
            )}

            {usuarioActual ? (
              <>
                <li className="nav-usuario">Hola, {usuarioActual.nombre.split(' ')[0]}</li>
                <li>
                  <button className="btn-logout-nav" onClick={function() { logout(); cerrarMenu(); }}>
                    Salir
                  </button>
                </li>
              </>
            ) : (
              <li><NavLink to="/login" onClick={cerrarMenu}>Ingresar</NavLink></li>
            )}
          </ul>

          <div className="nav-carrito">
            <Link to="/carrito" onClick={cerrarMenu}>
              Mi carrito 🛒 <span id="contador-carrito">{totalItems}</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
