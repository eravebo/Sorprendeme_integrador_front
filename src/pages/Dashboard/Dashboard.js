import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer
} from "recharts";

import mapaCalor from "../../assets/graficos/mapa_calor_categoria_nombre.png";
import histograma from "../../assets/graficos/histograma_precios.png";

// Paleta de colores alineada con el diseño de Sorprendeme
const COLOR_PRIMARIO   = "#ec3d6c";  // rosa fuerte
const COLOR_SECUNDARIO = "#f5b5c1";  // rosa claro
const COLOR_ACENTO     = "#f77fa0";  // rosa medio
const COLOR_FONDO      = "#fffafa";
const COLOR_GRIS       = "#f6f6f6";

const COLORES_TORTA = [COLOR_PRIMARIO, COLOR_SECUNDARIO, COLOR_ACENTO];

export default function Dashboard() {
  const [datosLineas, setDatosLineas]     = useState([]);
  const [datosBarras, setDatosBarras]     = useState([]);
  const [datosTorta, setDatosTorta]       = useState([]);
  const [totalProductos, setTotalProductos]   = useState(0);
  const [totalPremium, setTotalPremium]       = useState(0);
  const [totalEconomicos, setTotalEconomicos] = useState(0);

  useEffect(() => {
    fetch("/data/anchetas_por_fecha.json")
      .then(r => r.json()).then(data => setDatosLineas(data));

    fetch("/data/productos_premium_por_categoria.json")
      .then(r => r.json()).then(data => {
        setDatosBarras(data);
        setTotalPremium(data.reduce((s, i) => s + i.conteo, 0));
      });

    fetch("/data/productos_economicos_por_categoria.json")
      .then(r => r.json()).then(data => {
        setDatosTorta(data);
        setTotalEconomicos(data.reduce((s, i) => s + i.conteo, 0));
      });

    fetch("/data/distribucion_general.json")
      .then(r => r.json()).then(data => {
        setTotalProductos(data.reduce((s, i) => s + i.conteo, 0));
      });
  }, []);

  return (
    <div style={{ padding: "2rem", backgroundColor: COLOR_FONDO, minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>

      {/* Título */}
      <h1 style={{
        textAlign: "center", marginBottom: "0.5rem",
        color: COLOR_PRIMARIO, fontFamily: "'Playfair Display', serif", fontSize: "2rem"
      }}>
        Dashboard — Sorpréndeme
      </h1>
      <p style={{ textAlign: "center", color: "#888", marginBottom: "2rem", fontSize: "0.9rem" }}>
        Análisis de productos del catálogo
      </p>

      {/* KPIs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", justifyContent: "center", flexWrap: "wrap" }}>

        <div style={tarjeta(COLOR_PRIMARIO)}>
          <p style={kpiLabel}>Total productos</p>
          <p style={kpiValor}>{totalProductos}</p>
          <p style={kpiSub}>en el catálogo</p>
        </div>

        <div style={tarjeta(COLOR_ACENTO)}>
          <p style={kpiLabel}>Productos premium</p>
          <p style={kpiValor}>{totalPremium}</p>
          <p style={kpiSub}>precio ≥ $100.000</p>
        </div>

        <div style={tarjeta(COLOR_SECUNDARIO, "#ec3d6c")}>
          <p style={kpiLabel}>Productos económicos</p>
          <p style={kpiValor}>{totalEconomicos}</p>
          <p style={kpiSub}>precio ≤ $50.000</p>
        </div>

      </div>

      {/* Gráfica 1 — Líneas */}
      <div style={panel}>
        <h2 style={tituloGrafica}>Anchetas registradas por fecha</h2>
        <p style={conclusion}>
          📌 Identifica en qué fechas se registran más anchetas, útil para planear stock en temporadas altas como San Valentín o Día de la Madre.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={datosLineas}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5b5c1" />
            <XAxis dataKey="fecha_creacion" tick={{ fontSize: 9, fill: "#888" }} />
            <YAxis tick={{ fill: "#888" }} />
            <Tooltip contentStyle={{ borderColor: COLOR_PRIMARIO, borderRadius: "8px" }} />
            <Legend />
            <Line type="monotone" dataKey="conteo" stroke={COLOR_PRIMARIO} strokeWidth={2} dot={false} name="Anchetas" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica 2 — Barras */}
      <div style={panel}>
        <h2 style={tituloGrafica}>Productos premium por categoría (precio ≥ $100.000)</h2>
        <p style={conclusion}>
          📌 Muestra qué categoría concentra más productos de alto valor para enfocar estrategias de venta y vitrina.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosBarras}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5b5c1" />
            <XAxis dataKey="categoria" tick={{ fill: "#555" }} />
            <YAxis tick={{ fill: "#888" }} />
            <Tooltip contentStyle={{ borderColor: COLOR_PRIMARIO, borderRadius: "8px" }} />
            <Legend />
            <Bar dataKey="conteo" fill={COLOR_PRIMARIO} radius={[6, 6, 0, 0]} name="Cantidad" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica 3 — Torta */}
      <div style={panel}>
        <h2 style={tituloGrafica}>Productos económicos por categoría (precio ≤ $50.000)</h2>
        <p style={conclusion}>
          📌 Revela qué categoría domina el segmento de bajo precio y la accesibilidad del catálogo para diferentes presupuestos.
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={datosTorta} dataKey="conteo" nameKey="categoria"
              cx="50%" cy="50%" outerRadius={130}
              label={({ categoria, percent }) => `${categoria} ${(percent * 100).toFixed(1)}%`}
            >
              {datosTorta.map((_, i) => (
                <Cell key={i} fill={COLORES_TORTA[i % COLORES_TORTA.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderColor: COLOR_PRIMARIO, borderRadius: "8px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica 4 — Mapa de calor PNG */}
      <div style={panel}>
        <h2 style={tituloGrafica}>Mapa de calor — Categoría vs Nombre (precio ≥ $50.000)</h2>
        <p style={conclusion}>
          📌 Identifica qué productos específicos tienen mayor presencia en el segmento medio-alto por categoría.
        </p>
        <img src={mapaCalor} alt="Mapa de calor" style={{ width: "100%", borderRadius: "8px", border: `1px solid ${COLOR_SECUNDARIO}` }} />
      </div>

      {/* Gráfica 5 — Histograma PNG */}
      <div style={panel}>
        <h2 style={tituloGrafica}>Distribución de precios de todos los productos</h2>
        <p style={conclusion}>
          📌 Muestra en qué rango de precios se concentra la mayoría del catálogo, útil para ajustar la estrategia de precios de la tienda.
        </p>
        <img src={histograma} alt="Histograma de precios" style={{ width: "100%", borderRadius: "8px", border: `1px solid ${COLOR_SECUNDARIO}` }} />
      </div>

    </div>
  );
}

// ── Estilos ──
const tarjeta = (bgColor, textColor = "white") => ({
  backgroundColor: bgColor,
  color: textColor,
  borderRadius: "12px",
  padding: "1.5rem 2rem",
  minWidth: "180px",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(236, 61, 108, 0.2)"
});

const panel = {
  backgroundColor: "white",
  borderRadius: "12px",
  padding: "1.5rem",
  marginBottom: "1.5rem",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  borderTop: "3px solid #ec3d6c"
};

const tituloGrafica = {
  fontSize: "1rem",
  fontWeight: "600",
  marginBottom: "0.4rem",
  color: "#ec3d6c",
  fontFamily: "'Playfair Display', serif"
};

const conclusion = {
  fontSize: "0.85rem",
  color: "#888",
  marginBottom: "1rem",
  fontStyle: "italic",
  borderLeft: "3px solid #f5b5c1",
  paddingLeft: "0.75rem"
};

const kpiLabel = { margin: 0, fontSize: "0.85rem", opacity: 0.9, fontWeight: "500" };
const kpiValor = { margin: "0.3rem 0", fontSize: "2rem", fontWeight: "bold" };
const kpiSub   = { margin: 0, fontSize: "0.75rem", opacity: 0.85 };