import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MisPedidos from './MisPedidos';

// ── Mocks ──

// Mockeamos useAuth para simular un usuario logueado
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    usuarioActual: { nombre: 'Maria Garcia', email: 'maria@gmail.com' },
  }),
}));

// Mockeamos el Footer para simplificar el render
jest.mock('../../components/Footer', () => () => <div>Footer</div>);

// Mockeamos fetchPedidos para no llamar al backend real
jest.mock('../../api/api', () => ({
  fetchPedidos: jest.fn(),
}));

import { fetchPedidos } from '../../api/api';

// ── Helper ──
function renderMisPedidos() {
  return render(
    <MemoryRouter>
      <MisPedidos />
    </MemoryRouter>
  );
}

// ── Tests ──

describe('MisPedidos', () => {

  /**
   * Test 1: Muestra "Cargando..." mientras espera la respuesta del backend.
   */
  test('muestra mensaje de cargando al inicio', () => {
    // fetchPedidos nunca resuelve → queda en estado cargando
    fetchPedidos.mockReturnValue(new Promise(() => {}));

    renderMisPedidos();

    expect(screen.getByText('Cargando pedidos...')).toBeInTheDocument();
  });

  /**
   * Test 2: Muestra mensaje vacío cuando el usuario no tiene pedidos.
   */
  test('muestra mensaje vacío cuando no hay pedidos del usuario', async () => {
    // El backend retorna pedidos de otro usuario
    fetchPedidos.mockResolvedValue([
      {
        id: 99,
        email: 'otro@gmail.com',
        estado: 'pendiente',
        fecha: '2026-05-01T10:00:00',
        detalles: [],
      },
    ]);

    renderMisPedidos();

    await waitFor(() => {
      expect(screen.getByText('Aún no tienes pedidos.')).toBeInTheDocument();
    });
  });

  /**
   * Test 3: Muestra los pedidos del usuario logueado correctamente.
   */
  test('muestra los pedidos del usuario logueado', async () => {
    fetchPedidos.mockResolvedValue([
      {
        id: 1,
        email: 'maria@gmail.com',
        estado: 'pendiente',
        fecha: '2026-05-13T10:00:00',
        detalles: [
          { id: 1, cantidad: 2, precio: 85000, producto: { nombre: 'Ancheta Romantica' } },
        ],
      },
      {
        id: 2,
        email: 'otro@gmail.com', // este no debe aparecer
        estado: 'pagado',
        fecha: '2026-05-12T10:00:00',
        detalles: [],
      },
    ]);

    renderMisPedidos();

    await waitFor(() => {
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText(/Ancheta Romantica/i)).toBeInTheDocument();
      expect(screen.getByText('pendiente')).toBeInTheDocument();
    });

    // El pedido del otro usuario NO debe aparecer
    expect(screen.queryByText('#2')).not.toBeInTheDocument();
  });

  /**
   * Test 4: Muestra varios pedidos ordenados del más reciente al más antiguo.
   */
  test('muestra múltiples pedidos ordenados por id descendente', async () => {
    fetchPedidos.mockResolvedValue([
      {
        id: 1,
        email: 'maria@gmail.com',
        estado: 'entregado',
        fecha: '2026-05-10T10:00:00',
        detalles: [{ id: 1, cantidad: 1, precio: 50000, producto: { nombre: 'Peluche Osito' } }],
      },
      {
        id: 3,
        email: 'maria@gmail.com',
        estado: 'pagado',
        fecha: '2026-05-13T10:00:00',
        detalles: [{ id: 2, cantidad: 1, precio: 115000, producto: { nombre: 'Peluche Lotso' } }],
      },
    ]);

    renderMisPedidos();

    await waitFor(() => {
      const filas = screen.getAllByRole('row');
      // fila 0 es el thead, fila 1 debe ser el pedido #3 (más reciente)
      expect(filas[1]).toHaveTextContent('#3');
      expect(filas[2]).toHaveTextContent('#1');
    });
  });

  /**
   * Test 5: Muestra mensaje de error si el backend falla.
   */
  test('muestra lista vacía si el backend falla', async () => {
    fetchPedidos.mockRejectedValue(new Error('Error de red'));

    renderMisPedidos();

    await waitFor(() => {
      expect(screen.getByText('Aún no tienes pedidos.')).toBeInTheDocument();
    });
  });

});