import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';

export default function Confirmacion() {
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);

  useEffect(function() {
    var guardado = localStorage.getItem('pedido-actual');
    if (!guardado) { navigate('/'); return; }
    setPedido(JSON.parse(guardado));
  }, [navigate]);

  if (!pedido) return null;

  var nombre    = pedido.nombreCliente  || (pedido.cliente && pedido.cliente.nombre)    || '';
  var email     = pedido.email          || (pedido.cliente && pedido.cliente.email)     || '';
  var telefono  = pedido.telefono       || (pedido.cliente && pedido.cliente.telefono)  || '';
  var direccion = pedido.direccionEnvio || (pedido.cliente && pedido.cliente.direccion) || '';
  var total     = pedido.total          || 0;

  return (
    <div>
      <main>
        <section className="confirmacion-section">
          <div className="confirmacion-icono">
            <img src="/img/estado-de-pago.png" alt="Pago exitoso" className="pago-exitoso" />
          </div>

          <h2>Pedido recibido!</h2>
          <p className="confirmacion-subtitulo">
            Gracias por tu compra. Te contactaremos pronto para darte detalles de la entrega.
          </p>

          <div className="pedido-numero">
            <span>Numero de pedido:</span>
            <strong>#{pedido.id}</strong>
          </div>

          <div className="confirmacion-resumen">
            <h3>Resumen de tu pedido</h3>
            <div className="confirmacion-cliente">
              <strong>Datos de entrega</strong>
              <br />
              <span>{nombre}</span>
              <br />
              <span>{email}</span>
              <br />
              <span>{telefono}</span>
              <br />
              <span>{direccion}</span>
            </div>

            <div className="confirmacion-items">
              {pedido.items && pedido.items.map(function(item) {
                return (
                  <div className="confirmacion-item" key={item.id}>
                    <span>{item.nombre} x{item.cantidad}</span>
                    <span>${(item.precio * item.cantidad).toLocaleString('es-CO')}</span>
                  </div>
                );
              })}
            </div>

            <div className="confirmacion-total">
              <span>Total pagado</span>
              <strong>${total.toLocaleString('es-CO')}</strong>
            </div>
          </div>

          <div className="confirmacion-acciones">
            <Link to="/" className="btn-primary">Seguir comprando</Link>
            <a href="https://instagram.com/sorprendeme_med" target="_blank" rel="noreferrer" className="btn-secundario">
              <img src="/img/logoInstagram.png" alt="Instagram" className="icono-red-social" />
              <span>Siguenos en Instagram</span>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
