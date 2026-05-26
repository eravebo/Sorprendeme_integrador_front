import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../../context/CarritoContext';
import { useAuth } from '../../context/AuthContext';
import { crearPedido } from '../../api/api';
import Footer from '../../components/Footer';

export default function Checkout() {
  const navigate = useNavigate();
  const { carrito, subtotal, envio, total, vaciar } = useCarrito();
  const { usuarioActual } = useAuth();

  const [form, setForm] = useState({
    nombre: usuarioActual ? usuarioActual.nombre : '',
    email: usuarioActual ? usuarioActual.email : '',
    telefono: '',
    direccion: '',
  });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  function cambiar(campo, valor) {
    setForm(function(f) { return { ...f, [campo]: valor }; });
    setErrores(function(e) { return { ...e, [campo]: '' }; });
  }

  function validar() {
    var nuevos = {};
    if (form.nombre.trim().length < 3) nuevos.nombre = 'Ingresa tu nombre completo';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nuevos.email = 'Correo no valido';
    if (form.telefono.trim().length < 10) nuevos.telefono = 'Telefono no valido';
    if (form.direccion.trim().length < 5) nuevos.direccion = 'Ingresa tu direccion completa';
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  async function handlePagar() {
    if (!validar()) return;
    if (carrito.length === 0) { navigate('/carrito'); return; }

    var pedido = {
      nombreCliente: form.nombre,
      email: form.email,
      telefono: form.telefono,
      direccionEnvio: form.direccion,
      estado: 'pendiente',
      detalles: carrito.map(function(item) {
        return {
          producto: { id: item.id },
          cantidad: item.cantidad,
          precio: item.precio,
        };
      }),
    };

    try {
      setEnviando(true);
      var pedidoGuardado = await crearPedido(pedido);
      localStorage.setItem('pedido-actual', JSON.stringify({
        ...pedidoGuardado,
        items: carrito,
        subtotal: subtotal,
        envio: envio,
        total: total,
      }));
      vaciar();
      navigate('/confirmacion');
    } catch (error) {
      alert('Hubo un error al procesar el pedido. Verifica que el backend este corriendo e intenta de nuevo.');
      console.error('Error al crear pedido:', error);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <main>
        <section className="checkout-section">
          <h2>Finalizar Pedido</h2>
          <div className="checkout-container">
            <div className="checkout-form">
              <h3>Tus datos</h3>

              <div className="form-grupo">
                <label>Nombre completo *</label>
                <input type="text" placeholder="Ej: Maria Bonilla" value={form.nombre}
                  onChange={function(e) { cambiar('nombre', e.target.value); }}
                  className={errores.nombre ? 'invalido' : ''} />
                {errores.nombre && <span className="error-msg">{errores.nombre}</span>}
              </div>

              <div className="form-grupo">
                <label>Correo electronico *</label>
                <input type="email" placeholder="Ej: maria@gmail.com" value={form.email}
                  onChange={function(e) { cambiar('email', e.target.value); }}
                  className={errores.email ? 'invalido' : ''} />
                {errores.email && <span className="error-msg">{errores.email}</span>}
              </div>

              <div className="form-grupo">
                <label>Telefono *</label>
                <input type="tel" placeholder="Ej: 3001234567" value={form.telefono}
                  onChange={function(e) { cambiar('telefono', e.target.value); }}
                  className={errores.telefono ? 'invalido' : ''} />
                {errores.telefono && <span className="error-msg">{errores.telefono}</span>}
              </div>

              <div className="form-grupo">
                <label>Direccion de envio *</label>
                <input type="text" placeholder="Ej: Calle 50 #30-20, Medellin" value={form.direccion}
                  onChange={function(e) { cambiar('direccion', e.target.value); }}
                  className={errores.direccion ? 'invalido' : ''} />
                {errores.direccion && <span className="error-msg">{errores.direccion}</span>}
              </div>

              <button className="btn-primary" onClick={handlePagar} disabled={enviando}>
                {enviando ? 'Procesando...' : 'Pagar con MercadoPago'}
              </button>
              <img src="/img/mercadoPago.png" alt="Mercado Pago" className="mercado-pago-logo" />
            </div>

            <div className="checkout-resumen">
              <h3>Tu pedido</h3>
              {carrito.map(function(item) {
                return (
                  <div className="resumen-item-checkout" key={item.id}>
                    <span>{item.nombre} x{item.cantidad}</span>
                    <span>${(item.precio * item.cantidad).toLocaleString('es-CO')}</span>
                  </div>
                );
              })}
              <div className="resumen-linea">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString('es-CO')}</span>
              </div>
              <div className="resumen-linea">
                <span>Envio</span>
                <span>${envio.toLocaleString('es-CO')}</span>
              </div>
              <div className="resumen-linea total">
                <span>Total</span>
                <span>${total.toLocaleString('es-CO')}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
