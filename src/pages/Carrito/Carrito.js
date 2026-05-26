import { Link } from 'react-router-dom';
import { useCarrito } from '../../context/CarritoContext';
import Footer from '../../components/Footer';

export default function Carrito() {
  const { carrito, cambiarCantidad, eliminar, subtotal, envio, total } = useCarrito();

  if (carrito.length === 0) {
    return (
      <>
        <main>
          <section className="carrito-section">
            <h2>Tu Carrito 🛒</h2>
            <div className="carrito-vacio">
              <p>Tu carrito está vacío</p>
              <Link to="/" className="btn-primary">Ver productos</Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main>
        <section className="carrito-section">
          <h2>Tu Carrito 🛒</h2>
          <div className="carrito-container">

            {/* Items */}
            <div className="carrito-items">
              {carrito.map(item => (
                <div className="carrito-item" key={item.id}>
                  <img src={item.imagen} alt={item.nombre} />
                  <div className="item-info">
                    <h4>{item.nombre}</h4>
                    <span className="item-precio">
                      ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                    </span>
                  </div>
                  <div className="item-controles">
                    <button className="btn-cantidad" onClick={() => cambiarCantidad(item.id, 'restar')}>−</button>
                    <span>{item.cantidad}</span>
                    <button className="btn-cantidad" onClick={() => cambiarCantidad(item.id, 'sumar')}>+</button>
                  </div>
                  <button className="btn-eliminar" onClick={() => eliminar(item.id)}>🗑</button>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div className="carrito-resumen">
              <h3>Resumen del pedido</h3>
              <div className="resumen-linea">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString('es-CO')}</span>
              </div>
              <div className="resumen-linea">
                <span>Envío en Medellín</span>
                <span>${envio.toLocaleString('es-CO')}</span>
              </div>
              <div className="resumen-linea total">
                <span>Total</span>
                <span>${total.toLocaleString('es-CO')}</span>
              </div>
              <Link to="/checkout" className="btn-primary btn-block">Continuar →</Link>
              <Link to="/" className="btn-secundario">← Seguir comprando</Link>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
