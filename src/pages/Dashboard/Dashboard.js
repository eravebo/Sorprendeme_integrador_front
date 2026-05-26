import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer
} from "recharts";

import mapaCalor from "../../assets/graficos/mapa_calor_categoria_nombre.png";
import histograma from "../../assets/graficos/histograma_precios.png";

// ANDRÉS QUINTERO — Tabla PEDIDO
import mapaCalorPedidos    from "../../assets/graficos/mapa_calor_pedidos_mes_estado.png";
import histogramaPedidos   from "../../assets/graficos/histograma_horas_pedido.png";

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

  // ANDRÉS QUINTERO — Tabla PEDIDO
  const [datosPedidosFecha,     setDatosPedidosFecha]     = useState([]);
  const [datosPedidosEstado,    setDatosPedidosEstado]     = useState([]);
  const [datosPedidosAprobados, setDatosPedidosAprobados] = useState([]);
  const [totalPedidos,    setTotalPedidos]    = useState(0);
  const [totalAprobados,  setTotalAprobados]  = useState(0);
  const [totalPendientes, setTotalPendientes] = useState(0);

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

    // ANDRÉS QUINTERO — Tabla PEDIDO
    fetch("/data/pedidos_por_fecha.json")
      .then(r => r.json()).then(data => setDatosPedidosFecha(data));

    fetch("/data/pedidos_por_estado.json")
      .then(r => r.json()).then(data => {
        setDatosPedidosEstado(data);
        const aprobados  = data.find(d => d.estado === "aprobado");
        const pendientes = data.find(d => d.estado === "pendiente");
        setTotalAprobados(aprobados  ? aprobados.conteo  : 0);
        setTotalPendientes(pendientes ? pendientes.conteo : 0);
      });

    fetch("/data/pedidos_aprobados_por_mes.json")
      .then(r => r.json()).then(data => setDatosPedidosAprobados(data));

    fetch("/data/distribucion_pedidos_general.json")
      .then(r => r.json()).then(data => {
        setTotalPedidos(data.reduce((s, i) => s + i.conteo, 0));
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

      {/* ── ANDRÉS QUINTERO — Tabla PEDIDO ────────────────────── */}

      <h2 style={{
        textAlign: "center", marginTop: "2.5rem", marginBottom: "0.5rem",
        color: COLOR_PRIMARIO, fontFamily: "'Playfair Display', serif", fontSize: "1.6rem"
      }}>
        Análisis de Pedidos
      </h2>
      <p style={{ textAlign: "center", color: "#888", marginBottom: "2rem", fontSize: "0.9rem" }}>
        Comportamiento y estados de los pedidos registrados en la tienda
      </p>

      {/* KPIs Pedidos */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
        <div style={tarjeta(COLOR_PRIMARIO)}>
          <p style={kpiLabel}>Total pedidos</p>
          <p style={kpiValor}>{totalPedidos}</p>
          <p style={kpiSub}>registrados</p>
        </div>
        <div style={tarjeta(COLOR_ACENTO)}>
          <p style={kpiLabel}>Aprobados</p>
          <p style={kpiValor}>{totalAprobados}</p>
          <p style={kpiSub}>pagos confirmados</p>
        </div>
        <div style={tarjeta(COLOR_SECUNDARIO, "#ec3d6c")}>
          <p style={kpiLabel}>Pendientes</p>
          <p style={kpiValor}>{totalPendientes}</p>
          <p style={kpiSub}>en proceso</p>
        </div>
      </div>

      {/* Gráfica P1 — Línea: pedidos por fecha */}
      <div style={panel}>
        <h2 style={tituloGrafica}>Pedidos registrados por fecha</h2>
        <p style={conclusion}>
          📌 Identifica los días con mayor volumen de pedidos para anticipar picos de demanda y reforzar la operación en temporadas altas.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={datosPedidosFecha}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5b5c1" />
            <XAxis dataKey="fecha_dia" tick={{ fontSize: 9, fill: "#888" }} />
            <YAxis tick={{ fill: "#888" }} />
            <Tooltip contentStyle={{ borderColor: COLOR_PRIMARIO, borderRadius: "8px" }} />
            <Legend />
            <Line type="monotone" dataKey="conteo" stroke={COLOR_PRIMARIO} strokeWidth={2} dot={false} name="Pedidos" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica P2 — Torta: distribución por estado */}
      <div style={panel}>
        <h2 style={tituloGrafica}>Distribución de pedidos por estado</h2>
        <p style={conclusion}>
          📌 Muestra la proporción de pedidos aprobados, pendientes y rechazados para evaluar la efectividad del proceso de pago.
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={datosPedidosEstado} dataKey="conteo" nameKey="estado"
              cx="50%" cy="50%" outerRadius={130}
              label={({ estado, percent }) => `${estado} ${(percent * 100).toFixed(1)}%`}
            >
              {datosPedidosEstado.map((_, i) => (
                <Cell key={i} fill={COLORES_TORTA[i % COLORES_TORTA.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderColor: COLOR_PRIMARIO, borderRadius: "8px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica P3 — Barras: pedidos aprobados por mes */}
      <div style={panel}>
        <h2 style={tituloGrafica}>Pedidos aprobados por mes</h2>
        <p style={conclusion}>
          📌 Revela la tendencia mensual de pedidos exitosos para identificar meses de alta y baja conversión a lo largo del año.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosPedidosAprobados}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5b5c1" />
            <XAxis dataKey="mes" tick={{ fontSize: 9, fill: "#555" }} />
            <YAxis tick={{ fill: "#888" }} />
            <Tooltip contentStyle={{ borderColor: COLOR_PRIMARIO, borderRadius: "8px" }} />
            <Legend />
            <Bar dataKey="conteo" fill={COLOR_PRIMARIO} radius={[6, 6, 0, 0]} name="Aprobados" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica P4 — Mapa de calor PNG: pedidos por mes y estado */}
      <div style={panel}>
        <h2 style={tituloGrafica}>Mapa de calor — Pedidos por mes y estado</h2>
        <p style={conclusion}>
          📌 Identifica en qué meses se concentran más pedidos aprobados o rechazados, útil para detectar patrones estacionales por tipo de resultado.
        </p>
        <img src={mapaCalorPedidos} alt="Mapa de calor pedidos" style={{ width: "100%", borderRadius: "8px", border: `1px solid ${COLOR_SECUNDARIO}` }} />
      </div>

      {/* Gráfica P5 — Histograma PNG: distribución por hora */}
      <div style={panel}>
        <h2 style={tituloGrafica}>Distribución de pedidos por hora del día</h2>
        <p style={conclusion}>
          📌 Muestra en qué horas del día se realizan más pedidos para optimizar atención al cliente y disponibilidad del sistema en los picos horarios.
        </p>
        <img src={histogramaPedidos} alt="Histograma horas pedido" style={{ width: "100%", borderRadius: "8px", border: `1px solid ${COLOR_SECUNDARIO}` }} />
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