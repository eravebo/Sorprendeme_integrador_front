/**
 * Pruebas UNITARIAS de api.js
 *
 * Concepto clave: estas pruebas simulan el fetch para no hacer
 * peticiones reales al backend. Probamos solo la logica de api.js.
 *
 * jest.fn() crea una funcion simulada que podemos controlar.
 */

import { fetchProductos, crearProducto, eliminarProducto, crearPedido, fetchPedidos, cambiarEstadoPedido } from './api';

// Antes de cada test, reemplazamos fetch con una funcion simulada
beforeEach(() => {
  global.fetch = jest.fn();
});

// Despues de cada test, limpiamos los mocks
afterEach(() => {
  jest.resetAllMocks();
});

// ── PRODUCTOS ──

describe('fetchProductos', () => {

  test('debe retornar lista de productos cuando la respuesta es exitosa', async () => {
    // Datos de prueba que simulamos que devuelve el backend
    const productosMock = [
      { id: 1, nombre: 'Ancheta Romantica', precio: 85000, categoria: 'ancheta' },
      { id: 2, nombre: 'Peluche Lotso', precio: 115000, categoria: 'peluche' },
    ];

    // Simulamos que fetch devuelve una respuesta exitosa con esos datos
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => productosMock,
    });

    const resultado = await fetchProductos();

    expect(resultado).toHaveLength(2);
    expect(resultado[0].nombre).toBe('Ancheta Romantica');
    expect(resultado[1].categoria).toBe('peluche');
    // Verificamos que se llamo a la URL correcta
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/productos');
  });

  test('debe lanzar error cuando el servidor falla', async () => {
    // Simulamos que el servidor responde con error
    global.fetch.mockResolvedValueOnce({ ok: false });

    await expect(fetchProductos()).rejects.toThrow('Error al cargar los productos');
  });

});

describe('crearProducto', () => {

  test('debe enviar POST con los datos correctos y retornar el producto creado', async () => {
    const nuevoProducto = {
      nombre: 'Ancheta Premium',
      precio: 150000,
      categoria: 'ancheta',
    };
    const respuestaMock = { ...nuevoProducto, id: 6, activo: true };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => respuestaMock,
    });

    const resultado = await crearProducto(nuevoProducto);

    expect(resultado.id).toBe(6);
    expect(resultado.nombre).toBe('Ancheta Premium');

    // Verificamos que se envio con el metodo correcto y headers correctos
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/productos',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  test('debe lanzar error cuando no se puede crear el producto', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });

    await expect(crearProducto({})).rejects.toThrow('Error al crear el producto');
  });

});

describe('eliminarProducto', () => {

  test('debe enviar DELETE al endpoint correcto', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });

    await eliminarProducto(1);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/productos/1',
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  test('debe lanzar error cuando el producto no existe', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });

    await expect(eliminarProducto(99)).rejects.toThrow('Error al eliminar el producto');
  });

});

// ── PEDIDOS ──

describe('crearPedido', () => {

  test('debe enviar POST con los datos del pedido y retornar el pedido guardado', async () => {
    const nuevoPedido = {
      nombreCliente: 'Maria Garcia',
      email: 'maria@gmail.com',
      telefono: '3001234567',
      direccionEnvio: 'Calle 123, Medellin',
      estado: 'pendiente',
    };
    const respuestaMock = { ...nuevoPedido, id: 1 };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => respuestaMock,
    });

    const resultado = await crearPedido(nuevoPedido);

    expect(resultado.id).toBe(1);
    expect(resultado.nombreCliente).toBe('Maria Garcia');
    expect(resultado.estado).toBe('pendiente');
  });

  test('debe lanzar error cuando falla la creacion del pedido', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });

    await expect(crearPedido({})).rejects.toThrow('Error al crear el pedido');
  });

});

describe('fetchPedidos', () => {

  test('debe retornar lista de pedidos cuando la respuesta es exitosa', async () => {
    const pedidosMock = [
      { id: 1, nombreCliente: 'Maria Garcia', estado: 'pendiente' },
      { id: 2, nombreCliente: 'Carlos Lopez', estado: 'pagado' },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => pedidosMock,
    });

    const resultado = await fetchPedidos();

    expect(resultado).toHaveLength(2);
    expect(resultado[0].estado).toBe('pendiente');
    expect(resultado[1].nombreCliente).toBe('Carlos Lopez');
  });

});

describe('cambiarEstadoPedido', () => {

  test('debe enviar PATCH con el nuevo estado y retornar el pedido actualizado', async () => {
    const respuestaMock = { id: 1, nombreCliente: 'Maria Garcia', estado: 'pagado' };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => respuestaMock,
    });

    const resultado = await cambiarEstadoPedido(1, 'pagado');

    expect(resultado.estado).toBe('pagado');
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/pedidos/1/estado?estado=pagado',
      expect.objectContaining({ method: 'PATCH' })
    );
  });

});
