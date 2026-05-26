import { useState } from 'react';
import { useCarrito } from '../context/CarritoContext';

export default function ProductoCard({ producto }) {
  const { agregar } = useCarrito();
  const [notif, setNotif] = useState(false);

  function handleAgregar() {
    agregar(producto);
    setNotif(true);
    setTimeout(() => setNotif(false), 2000);
  }

  return (
    <article className="producto-card" data-categoria={producto.categoria}>
      <div className="card-imagen">
        <img src={producto.imagen} alt={producto.nombre} />
        <span className="card-categoria">{producto.categoria}</span>
      </div>
      <div className="card-info">
        <h3>{producto.nombre}</h3>
        <p>{producto.descripcion}</p>
        <div className="card-footer">
          <span className="precio">${producto.precio.toLocaleString('es-CO')}</span>
          <button className="btn-agregar" onClick={handleAgregar}>
            {notif ? '✅ Agregado' : 'Agregar'}
          </button>
        </div>
      </div>
    </article>
  );
}
