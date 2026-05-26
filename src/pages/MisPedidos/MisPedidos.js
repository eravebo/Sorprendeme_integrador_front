import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';
import { fetchPedidos } from '../../api/api';

export default function MisPedidos() {
  const { usuarioActual } = useAuth();
  const [ordenados, setOrdenados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const todos = await fetchPedidos();
        const misPedidos = todos.filter(p => p.email === usuarioActual?.email);
        setOrdenados([...misPedidos].sort((a, b) => b.id - a.id));
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [usuarioActual]);

  return (
    <>
      <main>
        <section className="checkout-section">
          <h2>Mis Pedidos 📦</h2>

          {cargando ? (
            <p>Cargando pedidos...</p>
          ) : ordenados.length === 0 ? (
            <div className="carrito-vacio">
              <p>Aún no tienes pedidos.</p>
              <Link to="/" className="btn-primary">Explorar productos</Link>
            </div>
          ) : (
            <div className="tabla-container">
              <table className="admin-tabla">
                <thead>
                  <tr>
                    <th>#Pedido</th>
                    <th>Fecha</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenados.map(p => (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td>{new Date(p.fecha).toLocaleDateString('es-CO')}</td>
                      <td>
                        {p.detalles?.map(d => (
                          <div key={d.id} style={{ fontSize: '0.85rem' }}>
                            {d.producto?.nombre} x{d.cantidad}
                          </div>
                        ))}
                      </td>
                      <td>
                        ${p.detalles?.reduce((acc, d) => acc + d.precio * d.cantidad, 0).toLocaleString('es-CO')}
                      </td>
                      <td>
                        <span className={`badge badge-${p.estado}`}>{p.estado}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}