import { useState, useEffect } from 'react';
import ProductoCard from '../../components/ProductoCard';
import Footer from '../../components/Footer';
import { fetchProductos } from '../../api/api';

const CATEGORIAS = [
  { key: 'todas', label: 'Todas' },
  { key: 'ancheta', label: 'Anchetas' },
  { key: 'flores', label: 'Flores' },
  { key: 'peluche', label: 'Peluches' },
];

export default function Home() {
  const [categoriaActiva, setCategoriaActiva] = useState('todas');
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductos()
      .then(data => {
        setProductos(data.map(p => ({ ...p, imagen: p.imagenUrl })));
      })
      .catch(err => {
        console.error('Error cargando productos:', err);
        setError('No se pudieron cargar los productos. Verifica que el backend este corriendo.');
      })
      .finally(() => setCargando(false));
  }, []);

  const filtrados = categoriaActiva === 'todas'
    ? productos
    : productos.filter(p => p.categoria === categoriaActiva);

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1>Regalos que enamoran</h1>
          <p>Descubre la magia de regalar con Sorprendeme Medellin. Encuentra el detalle perfecto para cada ocasion.</p>
          <a href="#productos" className="btn">Explorar productos</a>
        </div>
      </section>

      <section className="filtros">
        <div className="filtros-container">
          {CATEGORIAS.map(c => (
            <button
              key={c.key}
              className={`filtro-btn ${categoriaActiva === c.key ? 'activo' : ''}`}
              onClick={() => setCategoriaActiva(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      <main>
        <section className="catalogo" id="productos">
          <h2>Nuestros Productos</h2>
          {cargando && <p style={{ textAlign: 'center', color: '#888' }}>Cargando productos...</p>}
          {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
          <div className="productos-grid">
            {!cargando && !error && filtrados.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888', gridColumn: '1/-1' }}>
                No hay productos en esta categoria aun.
              </p>
            ) : (
              filtrados.map(p => <ProductoCard key={p.id} producto={p} />)
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* Acceso discreto al panel de administración */}
      <a
        href="/admin/login"
        title="Acceso administrador"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: 'rgba(80,80,80,0.45)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          opacity: '0.6',
          transition: 'opacity 0.25s, background 0.25s',
          zIndex: 999,
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.background = 'rgba(60,60,60,0.85)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.opacity = '0.6';
          e.currentTarget.style.background = 'rgba(80,80,80,0.45)';
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M12 2a5 5 0 0 1 5 5v2h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v2h6V7a3 3 0 0 0-3-3zm0 9a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
        </svg>
      </a>
    </div>
  );
}
