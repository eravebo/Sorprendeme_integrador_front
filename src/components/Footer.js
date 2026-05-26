export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        <div className="footer-info">
          <h3>Sorpréndeme - Tienda de regalos</h3>
          <p>Medellín, Colombia</p>
          <p>📞 300 000 0000</p>
        </div>
        <div className="footer-redes">
          <h4>Síguenos</h4>
          <a href="https://www.instagram.com/sorprendeme_med" target="_blank" rel="noreferrer">
            <img src="/img/logoInstagram.png" className="icono-red-social" alt="Instagram" />
            @sorprendeme_med
          </a>
        </div>
        <div className="footer-legal">
          <p>&copy; 2026 Sorpréndeme. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
