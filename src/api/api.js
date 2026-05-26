const BASE_URL = 'http://localhost:8080/api';

// ── PRODUCTOS ──

export async function fetchProductos() {
  const respuesta = await fetch(`${BASE_URL}/productos`);
  if (!respuesta.ok) throw new Error('Error al cargar los productos');
  return respuesta.json();
}

export async function crearProducto(producto) {
  const respuesta = await fetch(`${BASE_URL}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto),
  });
  if (!respuesta.ok) throw new Error('Error al crear el producto');
  return respuesta.json();
}

export async function eliminarProducto(id) {
  const respuesta = await fetch(`${BASE_URL}/productos/${id}`, {
    method: 'DELETE',
  });
  if (!respuesta.ok) throw new Error('Error al eliminar el producto');
}

// ── PEDIDOS ──

export async function crearPedido(pedido) {
  const respuesta = await fetch(`${BASE_URL}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido),
  });
  if (!respuesta.ok) throw new Error('Error al crear el pedido');
  return respuesta.json();
}

export async function fetchPedidos() {
  const respuesta = await fetch(`${BASE_URL}/pedidos`);
  if (!respuesta.ok) throw new Error('Error al cargar los pedidos');
  return respuesta.json();
}

export async function cambiarEstadoPedido(id, nuevoEstado) {
  const respuesta = await fetch(`${BASE_URL}/pedidos/${id}/estado`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado: nuevoEstado }),
  });
  if (!respuesta.ok) throw new Error('Error al cambiar el estado');
  return respuesta.json();
}

export async function eliminarPedido(id) {
  const respuesta = await fetch(`${BASE_URL}/pedidos/${id}`, {
    method: 'DELETE',
  });
  if (!respuesta.ok) throw new Error('Error al eliminar el pedido');
}

// ── USUARIOS ──

/**
 * Registra un nuevo usuario en el backend.
 * Envia: { nombre, email, password }
 * Coincide exactamente con el formulario de registro.
 */
export async function registrarUsuario(datos) {
  const respuesta = await fetch(`${BASE_URL}/usuarios/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!respuesta.ok) {
    const error = await respuesta.json();
    throw new Error(error.error || 'Error al registrar el usuario');
  }
  return respuesta.json();
}

/**
 * Inicia sesion de un usuario.
 * Envia: { email, password }
 * Retorna el usuario con sus datos si las credenciales son correctas.
 */
export async function loginUsuario(email, password) {
  const respuesta = await fetch(`${BASE_URL}/usuarios/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!respuesta.ok) {
    const error = await respuesta.json();
    throw new Error(error.error || 'Correo o contrasena incorrectos');
  }
  return respuesta.json();
}

/**
 * Trae todos los usuarios registrados.
 * Usado en el panel Admin para ver quienes se han registrado.
 */
export async function fetchUsuarios() {
  const respuesta = await fetch(`${BASE_URL}/usuarios`);
  if (!respuesta.ok) throw new Error('Error al cargar los usuarios');
  return respuesta.json();
}
