# CLAUDE.md — Sorprendeme_integrador_front

Contexto del proyecto para Claude Code. Léelo antes de cualquier tarea.

## Descripción

Frontend React de SorpréndemeWeb — tienda de regalos de Medellín (proyecto NT_20261, martes).
Consume un backend Spring Boot en `localhost:8080`.

## Integrantes y responsabilidades

| Integrante | Responsabilidad | Rama |
|---|---|---|
| Evelyn Rave | PRODUCTO — catálogo, sección productos del Dashboard | sus propias ramas |
| Andrés Quintero | PEDIDO — sección pedidos del Dashboard | `andres/dashboard-pedidos` |

**Regla crítica:** No modificar el código de Evelyn a menos que sea estrictamente necesario. Siempre agregar código nuevo debajo o aparte del suyo.

## Repositorios relacionados

- **Este repo (frontend):** `https://github.com/eravebo/Sorprendeme_integrador_front`
- **Pipeline de datos:** `https://github.com/eravebo/NT_20261_SorprendemeWeb`
- **Backend Spring Boot:** carpeta local `Sorprendeme_integrador_backend/`

## Cómo correr el proyecto

```bash
# Requisitos previos
# 1. XAMPP corriendo con Apache y MySQL activos
# 2. Backend Spring Boot corriendo en IntelliJ (puerto 8080)

# Primera vez
npm install

# Correr el servidor de desarrollo
npm start
# → http://localhost:3000
```

## Estructura del proyecto

```
src/
├── App.js                        # Rutas principales
├── styles.css                    # Estilos globales (variables CSS)
├── index.js
├── api/
│   └── api.js                    # Todas las llamadas al backend (BASE_URL: localhost:8080/api)
├── context/
│   ├── AuthContext.js            # Contexto de autenticación de usuario
│   └── CarritoContext.js         # Contexto del carrito de compras
├── components/
│   ├── Navbar.js                 # Barra de navegación
│   ├── Footer.js
│   ├── ProductoCard.js           # Tarjeta de producto
│   ├── Notificacion.js
│   └── PrivateRoute.js           # Guard para rutas protegidas
├── pages/
│   ├── Home/                     # Catálogo de productos (página principal)
│   ├── Login/                    # Login de usuarios
│   ├── AdminLogin/               # Login del administrador
│   ├── Admin/                    # Panel administrador (gestión productos y pedidos)
│   ├── Dashboard/
│   │   └── Dashboard.js          # Dashboard de análisis (EVELYN + ANDRÉS)
│   ├── Carrito/                  # Carrito de compras
│   ├── Checkout/                 # Proceso de pago (ruta protegida)
│   ├── Confirmacion/             # Confirmación del pedido
│   └── MisPedidos/               # Historial de pedidos del usuario (ruta protegida)
├── assets/
│   └── graficos/                 # PNGs generados por el pipeline Python
│       ├── barras_premium.png
│       ├── histograma_precios.png
│       ├── lineas_anchetas.png
│       ├── mapa_calor_categoria_nombre.png
│       ├── torta_economicos.png
│       ├── mapa_calor_pedidos_mes_estado.png  ← ANDRÉS
│       └── histograma_horas_pedido.png        ← ANDRÉS
└── data/                         # Solo en src — ver public/data para los JSON del dashboard
public/
└── data/                         # JSONs leídos por el Dashboard con fetch()
    ├── anchetas_por_fecha.json
    ├── productos_premium_por_categoria.json
    ├── productos_economicos_por_categoria.json
    ├── distribucion_general.json
    ├── calor_categoria_nombre.json
    ├── stock_bajo_por_categoria.json
    ├── pedidos_por_fecha.json               ← ANDRÉS
    ├── pedidos_por_estado.json              ← ANDRÉS
    ├── pedidos_aprobados_por_mes.json       ← ANDRÉS
    └── distribucion_pedidos_general.json    ← ANDRÉS
```

## Rutas de la aplicación

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Home — catálogo de productos | Público |
| `/login` | Login de usuario | Público |
| `/carrito` | Carrito de compras | Público |
| `/checkout` | Proceso de pago | Privado (login requerido) |
| `/confirmacion` | Confirmación del pedido | Público |
| `/mis-pedidos` | Historial del usuario | Privado (login requerido) |
| `/admin/login` | Login administrador | Público |
| `/admin` | Panel administrador | Admin |
| `/dashboard` | Dashboard de análisis | Público |

## Dashboard — estructura

**Archivo:** `src/pages/Dashboard/Dashboard.js`

Tiene dos secciones claramente separadas:

### Sección PRODUCTO (Evelyn — líneas 1–193)
- KPIs: total productos, productos premium, productos económicos
- Gráfica 1 — Línea: anchetas por fecha (Recharts, datos de `anchetas_por_fecha.json`)
- Gráfica 2 — Barras: productos premium por categoría (Recharts)
- Gráfica 3 — Torta: productos económicos por categoría (Recharts)
- Gráfica 4 — PNG: mapa de calor categoría vs nombre
- Gráfica 5 — PNG: histograma de precios

### Sección PEDIDO (Andrés — línea 195 en adelante)
- KPIs: total pedidos, aprobados, pendientes
- Gráfica P1 — Línea: pedidos por fecha (Recharts, datos de `pedidos_por_fecha.json`)
- Gráfica P2 — Torta: distribución por estado (Recharts)
- Gráfica P3 — Barras: pedidos aprobados por mes (Recharts)
- Gráfica P4 — PNG: mapa de calor mes vs estado
- Gráfica P5 — PNG: histograma de horas del día

### Librería de gráficas
**Recharts** — ya instalada. Componentes usados: `LineChart`, `BarChart`, `PieChart`, `ResponsiveContainer`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `Legend`, `Bar`, `Line`, `Pie`, `Cell`.

### Paleta de colores del Dashboard
```js
COLOR_PRIMARIO   = "#ec3d6c"  // rosa fuerte
COLOR_SECUNDARIO = "#f5b5c1"  // rosa claro
COLOR_ACENTO     = "#f77fa0"  // rosa medio
COLOR_FONDO      = "#fffafa"  // fondo general
```

## API — endpoints consumidos

Todos apuntan a `http://localhost:8080/api`:

| Función | Método | Endpoint |
|---|---|---|
| `fetchProductos` | GET | `/productos` |
| `crearProducto` | POST | `/productos` |
| `eliminarProducto` | DELETE | `/productos/:id` |
| `fetchPedidos` | GET | `/pedidos` |
| `crearPedido` | POST | `/pedidos` |
| `cambiarEstadoPedido` | PUT | `/pedidos/:id/estado` |
| `eliminarPedido` | DELETE | `/pedidos/:id` |
| `registrarUsuario` | POST | `/usuarios/registro` |
| `loginUsuario` | POST | `/usuarios/login` |
| `fetchUsuarios` | GET | `/usuarios` |

## Convenciones

- Responder siempre en **español**
- Ramas de Andrés: prefijo `andres/`
- Branch base: `main`
- No modificar código de Evelyn salvo que sea estrictamente necesario
- Los JSONs de `public/data/` se actualizan corriendo `main.py` en el repo del pipeline
- Los PNGs de `src/assets/graficos/` también se generan con `main.py`
