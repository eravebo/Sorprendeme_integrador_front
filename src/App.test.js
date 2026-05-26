import { render, screen } from '@testing-library/react';
import App from './App';

test('renderiza la página principal de Sorpréndeme', () => {
  render(<App />);
  const titulo = screen.getByText(/Regalos que enamoran/i);
  expect(titulo).toBeInTheDocument();
});