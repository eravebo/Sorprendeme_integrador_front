import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchProductos, crearProducto, eliminarProducto, fetchPedidos, cambiarEstadoPedido, eliminarPedido, fetchUsuarios } from '../../api/api';

var CATEGORIAS = ['ancheta', 'flores', 'peluche'];
var FORM_VACIO = { nombre: '', categoria: '', precio: '', stock: '', descripcion: '', imagen: '' };
var ESTADOS = ['pendiente', 'en_produccion', 'enviado', 'cancelado'];

export default function Admin() {
  var navigate = useNavigate();
  var auth = useAuth();
  var adminLogueado = auth.adminLogueado;
  var logoutAdmin = auth.logoutAdmin;

  var [tabActivo, setTabActivo] = useState('productos');
  var [productos, setProductos] = useState([]);
  var [pedidos, setPedidos] = useState([]);
  var [usuarios, setUsuarios] = useState([]);
  var [mostrarForm, setMostrarForm] = useState(false);
  var [form, setForm] = useState(FORM_VACIO);
  var [formError, setFormError] = useState('');
  var [cargando, setCargando] = useState(false);

  useEffect(function() {
    if (!adminLogueado) navigate('/admin/login');
  }, [adminLogueado, navigate]);

  useEffect(function() {
    if (adminLogueado) {
      setCargando(true);
      Promise.all([fetchProductos(), fetchPedidos(), fetchUsuarios()])
        .then(function(resultados) {
          setProductos(resultados[0].map(function(p) { return { ...p, imagen: p.imagenUrl }; }));
          setPedidos(resultados[1]);
          setUsuarios(resultados[2]);
        })
        .catch(function(err) { console.error('Error cargando datos:', err); })
        .finally(function() { setCargando(false); });
    }
  }, [adminLogueado]);

  function cambiarForm(campo, valor) {
    setForm(function(f) { return { ...f, [campo]: valor }; });
  }

  function abrirNuevo() { setForm(FORM_VACIO); setFormError(''); setMostrarForm(true); }
  function cancelarForm() { setMostrarForm(false); setForm(FORM_VACIO); }

  async function guardar() {
    if (!form.nombre || !form.categoria || !form.precio || !form.descripcion || !form.imagen) {
      setFormError('Completa todos los campos obligatorios'); return;
    }
    try {
      await crearProducto({ nombre: form.nombre, categoria: form.categoria, precio: Number(form.precio), stock: Number(form.stock) || 0, descripcion: form.descripcion, imagenUrl: form.imagen });
      var data = await fetchProductos();
      setProductos(data.map(function(p) { return { ...p, imagen: p.imagenUrl }; }));
      cancelarForm();
    } catch (error) { setFormError('Error al guardar el producto.'); }
  }

  async function eliminar(id) {
    if (!window.confirm('Eliminar este producto?')) return;
    try {
      await eliminarProducto(id);
      setProductos(function(prev) { return prev.filter(function(p) { return p.id !== id; }); });
    } catch (error) { alert('Error al eliminar el producto.'); }
  }

  async function handleCambiarEstado(id, nuevoEstado) {
    try {
      var actualizado = await cambiarEstadoPedido(id, nuevoEstado);
      setPedidos(function(prev) { return prev.map(function(p) { return p.id === id ? { ...p, estado: actualizado.estado } : p; }); });
    } catch (error) { alert('Error al cambiar el estado.'); }
  }

  async function handleEliminarPedido(id) {
    if (!window.confirm('Eliminar este pedido?')) return;
    try {
      await eliminarPedido(id);
      setPedidos(function(prev) { return prev.filter(function(p) { return p.id !== id; }); });
    } catch (error) { alert('Error al eliminar el pedido.'); }
  }

  function handleLogout() { logoutAdmin(); navigate('/admin/login'); }

  if (!adminLogueado) return null;

  var pedidosOrdenados = [...pedidos].sort(function(a, b) { return b.id - a.id; });

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Panel Admin - Sorprendeme</h1>
        <button className="btn-logout" onClick={handleLogout}>Cerrar sesion</button>
      </header>

      <div className="admin-tabs">
        <button className={`tab-btn ${tabActivo === 'productos' ? 'activo' : ''}`} onClick={function() { setTabActivo('productos'); }}>Productos</button>
        <button className={`tab-btn ${tabActivo === 'pedidos' ? 'activo' : ''}`} onClick={function() { setTabActivo('pedidos'); }}>Pedidos</button>
        <button className={`tab-btn ${tabActivo === 'usuarios' ? 'activo' : ''}`} onClick={function() { setTabActivo('usuarios'); }}>Usuarios</button>
        <button className="tab-btn" onClick={function() { navigate('/dashboard'); }}>Dashboard</button>
      </div>

      {cargando && <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando datos...</p>}

      {/* TAB PRODUCTOS */}
      {tabActivo === 'productos' && !cargando && (
        <div className="tab-content">
          <div className="admin-toolbar">
            <h2>Gestion de Productos</h2>
            <button className="btn-primary" onClick={abrirNuevo}>+ Nuevo Producto</button>
          </div>
          {mostrarForm && (
            <div className="producto-form-container">
              <h3>Nuevo Producto</h3>
              <div className="producto-form-grid">
                <div className="form-grupo"><label>Nombre *</label><input type="text" value={form.nombre} onChange={function(e) { cambiarForm('nombre', e.target.value); }} /></div>
                <div className="form-grupo"><label>Categoria *</label>
                  <select value={form.categoria} onChange={function(e) { cambiarForm('categoria', e.target.value); }}>
                    <option value="">Selecciona...</option>
                    {CATEGORIAS.map(function(c) { return <option key={c} value={c}>{c}</option>; })}
                  </select>
                </div>
                <div className="form-grupo"><label>Precio *</label><input type="number" value={form.precio} onChange={function(e) { cambiarForm('precio', e.target.value); }} /></div>
                <div className="form-grupo"><label>Stock *</label><input type="number" value={form.stock} onChange={function(e) { cambiarForm('stock', e.target.value); }} /></div>
                <div className="form-grupo form-grupo-full"><label>Descripcion *</label><textarea rows="2" value={form.descripcion} onChange={function(e) { cambiarForm('descripcion', e.target.value); }} /></div>
                <div className="form-grupo form-grupo-full"><label>URL de imagen *</label><input type="text" value={form.imagen} onChange={function(e) { cambiarForm('imagen', e.target.value); }} /></div>
              </div>
              {formError && <span className="error-msg">{formError}</span>}
              <div className="form-acciones">
                <button className="btn-primary" onClick={guardar}>Guardar</button>
                <button className="btn-secundario" onClick={cancelarForm}>Cancelar</button>
              </div>
            </div>
          )}
          <div className="tabla-container">
            <table className="admin-tabla">
              <thead><tr><th>Imagen</th><th>Nombre</th><th>Categoria</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
              <tbody>
                {productos.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No hay productos</td></tr>
                : productos.map(function(p) {
                  return (
                    <tr key={p.id}>
                      <td><img src={p.imagen} alt={p.nombre} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} /></td>
                      <td>{p.nombre}</td><td>{p.categoria}</td>
                      <td>${p.precio.toLocaleString('es-CO')}</td><td>{p.stock}</td>
                      <td><button className="btn-eliminar-prod" onClick={function() { eliminar(p.id); }}>Eliminar</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB PEDIDOS */}
      {tabActivo === 'pedidos' && !cargando && (
        <div className="tab-content">
          <div className="admin-toolbar"><h2>Pedidos Recibidos</h2></div>
          <div className="tabla-container">
            <table className="admin-tabla">
              <thead><tr><th>#Pedido</th><th>Cliente</th><th>Telefono</th><th>Direccion</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {pedidosOrdenados.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No hay pedidos aun</td></tr>
                : pedidosOrdenados.map(function(p) {
                  return (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td><strong>{p.nombreCliente}</strong><br /><small>{p.email}</small></td>
                      <td>{p.telefono}</td><td>{p.direccionEnvio}</td>
                      <td>
                        <select value={p.estado} onChange={function(e) { handleCambiarEstado(p.id, e.target.value); }} className={`badge badge-${p.estado}`}>
                          {ESTADOS.map(function(estado) { return <option key={estado} value={estado}>{estado}</option>; })}
                        </select>
                      </td>
                      <td><button className="btn-eliminar-prod" onClick={function() { handleEliminarPedido(p.id); }}>Eliminar</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB USUARIOS */}
      {tabActivo === 'usuarios' && !cargando && (
        <div className="tab-content">
          <div className="admin-toolbar">
            <h2>Usuarios Registrados</h2>
            <span style={{ color: '#888', fontSize: '0.9rem' }}>{usuarios.length} usuario(s) en total</span>
          </div>
          <div className="tabla-container">
            <table className="admin-tabla">
              <thead>
                <tr><th>#ID</th><th>Nombre</th><th>Correo</th><th>Fecha Registro</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {usuarios.length === 0
                  ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No hay usuarios registrados aun</td></tr>
                  : usuarios.map(function(u) {
                    return (
                      <tr key={u.id}>
                        <td>#{u.id}</td>
                        <td><strong>{u.nombre}</strong></td>
                        <td>{u.email}</td>
                        <td>{u.fechaRegistro ? new Date(u.fechaRegistro).toLocaleDateString('es-CO') : '-'}</td>
                        <td>
                          <span style={{
                            padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem',
                            background: u.activo ? '#d4edda' : '#f8d7da',
                            color: u.activo ? '#155724' : '#721c24'
                          }}>
                            {u.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
