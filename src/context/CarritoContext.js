import { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    return JSON.parse(localStorage.getItem('carrito')) || [];
  });

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  function agregar(producto) {
    setCarrito(prev => {
      const existe = prev.find(i => i.id === producto.id);
      if (existe) {
        return prev.map(i => i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  }

  function cambiarCantidad(id, accion) {
    setCarrito(prev => {
      return prev.reduce((acc, item) => {
        if (item.id !== id) return [...acc, item];
        const nuevaCantidad = accion === 'sumar' ? item.cantidad + 1 : item.cantidad - 1;
        if (nuevaCantidad <= 0) return acc; // elimina
        return [...acc, { ...item, cantidad: nuevaCantidad }];
      }, []);
    });
  }

  function eliminar(id) {
    setCarrito(prev => prev.filter(i => i.id !== id));
  }

  function vaciar() {
    setCarrito([]);
    localStorage.removeItem('carrito');
  }

  const subtotal = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const envio = subtotal > 0 ? 12000 : 0;
  const total = subtotal + envio;

  return (
    <CarritoContext.Provider value={{ carrito, totalItems, agregar, cambiarCantidad, eliminar, vaciar, subtotal, envio, total }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}
