const productosIniciales = [
  {
    id: 1,
    nombre: "Ancheta Romántica",
    descripcion: "Chocolates artesanales, vino rosado y detalles especiales",
    precio: 85000,
    categoria: "ancheta",
    imagen: "/img/Ancheta_1.jpeg",
    stock: 10,
  },
  {
    id: 2,
    nombre: "Ancheta Termo GYM",
    descripcion: "Ancheta con termo para GYM y peluche",
    precio: 65000,
    categoria: "ancheta",
    imagen: "/img/Ancheta_2.jpeg",
    stock: 8,
  },
  {
    id: 3,
    nombre: "Ancheta con Peluche y frutas",
    descripcion: "Ancheta con peluche de oso, flores y frutas",
    precio: 55000,
    categoria: "ancheta",
    imagen: "/img/Ancheta_3.jpeg",
    stock: 12,
  },
  {
    id: 4,
    nombre: "Ancheta Peluche Lucifer",
    descripcion: "Ancheta con peluche temático de Lucifer con chocolates y cerveza",
    precio: 75000,
    categoria: "ancheta",
    imagen: "/img/Ancheta_4.jpeg",
    stock: 6,
  },
  {
    id: 5,
    nombre: "Peluche Lotso Dormilón",
    descripcion: "Peluche temático de Lotso Dormilón con flores eternas y chocolates",
    precio: 115000,
    categoria: "peluche",
    imagen: "/img/Peluche_1.jpeg",
    stock: 5,
  },
  {
    id: 6,
    nombre: "Ancheta Amor con Vaca",
    descripcion: "Ancheta con peluche de vaca, rosas y chocolates Ferrero",
    precio: 55000,
    categoria: "ancheta",
    imagen: "/img/Ancheta_6.jpeg",
    stock: 9,
  },
];

export function getProductos() {
  const guardados = localStorage.getItem('productos-admin');
  if (guardados) return JSON.parse(guardados);
  return productosIniciales;
}

export function guardarProductos(lista) {
  localStorage.setItem('productos-admin', JSON.stringify(lista));
}

export { productosIniciales };
