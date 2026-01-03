const negocio = {
  nombre: 'Distribuidora Altavista',
  telefono: '5215512345678',
  pedidoMinimo: 1500,
};

const formatoMoneda = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

const productosData = [
  {
    id: 'cafe-arabica-kg',
    titulo: 'Café arábica tostado',
    descripcion: 'Tostado medio, ideal para espresso en cafeterías de alto volumen.',
    precio: 860,
    imagen:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    paquete: 'Caja con 8 bolsas de 1 kg',
    sku: 'SKU CAF-001',
  },
  {
    id: 'jarabes-premium',
    titulo: 'Variedad de jarabes premium',
    descripcion: 'Display surtido (vainilla, caramelo y avellana) con bomba dosificadora.',
    precio: 1290,
    imagen:
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80',
    paquete: 'Caja con 12 botellas de 750 ml',
    sku: 'SKU JAV-014',
  },
  {
    id: 'tazas-termicas',
    titulo: 'Tazas térmicas acero',
    descripcion: 'Acero inoxidable con tapa antiderrame, grabado láser incluido.',
    precio: 2100,
    imagen:
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=600&q=80',
    paquete: 'Caja con 24 piezas',
    sku: 'SKU ACC-233',
  },
  {
    id: 'matcha-hojas',
    titulo: 'Matcha ceremonial',
    descripcion: 'Grado ceremonial importado, molienda fina para bebidas frías y calientes.',
    precio: 1480,
    imagen:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80&sat=-80',
    paquete: 'Caja con 20 latas de 80 g',
    sku: 'SKU MAT-088',
  },
  {
    id: 'granola-foodservice',
    titulo: 'Granola foodservice',
    descripcion: 'Mezcla con frutos secos y miel, pensada para desayunos ejecutivos.',
    precio: 990,
    imagen:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    paquete: 'Sacos con 10 kg',
    sku: 'SKU GRA-510',
  },
  {
    id: 'combo-desayuno',
    titulo: 'Combo desayuno corporativo',
    descripcion: 'Incluye bebida caliente, panadería fina y fruta premium para 20 personas.',
    precio: 3200,
    imagen:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    paquete: 'Kit completo para 20 porciones',
    sku: 'SKU KIT-902',
  },
];

const productosContainer = document.getElementById('productos');
const templateProducto = document.getElementById('productoTemplate');
const carritoItems = document.getElementById('carritoItems');
const templateCarrito = document.getElementById('itemCarritoTemplate');
const totalTexto = document.getElementById('total');
const btnWhatsApp = document.getElementById('enviarPedido');
const buscador = document.getElementById('buscador');
const nombreCliente = document.getElementById('nombreCliente');
const scrollToCatalog = document.getElementById('scrollToCatalog');
const minimoPedido = document.getElementById('minimoPedido');
const estadoCarrito = document.getElementById('estadoCarrito');
const btnCopiarLink = document.getElementById('copiarLink');
const toastLink = document.getElementById('toastLink');

const carrito = new Map();
const URL_ACTUAL = window.location.href;

function renderProductos(lista = productosData) {
  productosContainer.innerHTML = '';

  lista.forEach((producto) => {
    const node = templateProducto.content.cloneNode(true);
    const imagen = node.querySelector('.producto__imagen');
    const titulo = node.querySelector('.producto__titulo');
    const desc = node.querySelector('.producto__desc');
    const precio = node.querySelector('.producto__precio');
    const btn = node.querySelector('.producto__btn');
    const paquete = node.querySelector('.producto__paquete');
    const sku = node.querySelector('.producto__sku');

    imagen.src = producto.imagen;
    imagen.alt = producto.titulo;
    titulo.textContent = producto.titulo;
    desc.textContent = producto.descripcion;
    paquete.textContent = producto.paquete;
    sku.textContent = producto.sku;
    precio.textContent = formatoMoneda.format(producto.precio);
    btn.dataset.id = producto.id;

    productosContainer.appendChild(node);
  });
}

function actualizarEstadoCarrito(total) {
  if (carrito.size === 0) {
    estadoCarrito.textContent = 'Agrega productos al carrito para conocer el total.';
    return;
  }

  if (total < negocio.pedidoMinimo) {
    const faltante = negocio.pedidoMinimo - total;
    estadoCarrito.textContent = `Agrega ${formatoMoneda.format(faltante)} más para alcanzar el pedido mínimo.`;
  } else {
    estadoCarrito.textContent = 'Superaste el mínimo, el pedido está listo para enviarse a WhatsApp.';
  }
}

function actualizarCarrito() {
  carritoItems.innerHTML = '';
  let total = 0;

  carrito.forEach((item) => {
    const node = templateCarrito.content.cloneNode(true);
    node.querySelector('.item-carrito__titulo').textContent = item.titulo;
    node
      .querySelector('.item-carrito__detalle')
      .textContent = `${item.paquete} · ${formatoMoneda.format(item.precio)} x ${item.cantidad}`;
    node.querySelector('.item-carrito__cantidad').textContent = item.cantidad;

    const [btnRestar, btnSumar] = node.querySelectorAll('.item-carrito__btn');
    btnRestar.dataset.id = item.id;
    btnSumar.dataset.id = item.id;

    carritoItems.appendChild(node);
    total += item.precio * item.cantidad;
  });

  totalTexto.textContent = formatoMoneda.format(total);
  btnWhatsApp.disabled = carrito.size === 0 || total < negocio.pedidoMinimo;
  actualizarEstadoCarrito(total);
}

function agregarAlCarrito(idProducto) {
  const producto = productosData.find((item) => item.id === idProducto);
  if (!producto) return;

  const existente = carrito.get(idProducto) ?? {
    ...producto,
    cantidad: 0,
  };

  existente.cantidad += 1;
  carrito.set(idProducto, existente);
  actualizarCarrito();
}

function modificarCantidad(id, accion) {
  const item = carrito.get(id);
  if (!item) return;

  if (accion === 'sumar') item.cantidad += 1;
  if (accion === 'restar') item.cantidad -= 1;

  if (item.cantidad <= 0) {
    carrito.delete(id);
  } else {
    carrito.set(id, item);
  }
  actualizarCarrito();
}

function filtrarProductos(texto) {
  const termino = texto.toLowerCase();
  const filtrados = productosData.filter((producto) =>
    `${producto.titulo} ${producto.descripcion} ${producto.sku}`.toLowerCase().includes(termino)
  );
  renderProductos(filtrados);
}

function generarMensajeWhatsApp() {
  const nombre = nombreCliente.value.trim() || 'Cliente mayorista';
  const lineas = [`Hola, soy ${nombre}. Me gustaría confirmar el siguiente pedido para ${negocio.nombre}:`];

  carrito.forEach((item) => {
    lineas.push(`- ${item.cantidad} x ${item.titulo} (${item.paquete}) - ${formatoMoneda.format(item.precio)}`);
  });

  lineas.push(`Total estimado: ${totalTexto.textContent}`);
  lineas.push('¿Está disponible el stock y la fecha de entrega?');

  return encodeURIComponent(lineas.join('\n'));
}

function enviarWhatsApp() {
  const mensaje = generarMensajeWhatsApp();
  const url = `https://wa.me/${negocio.telefono}?text=${mensaje}`;
  window.open(url, '_blank');
}

function mostrarToast(texto) {
  if (!toastLink) return;
  toastLink.textContent = texto;
  toastLink.classList.add('is-visible');
  setTimeout(() => {
    toastLink.classList.remove('is-visible');
  }, 3000);
}

function copiarLink() {
  const mensajeExito = 'Link copiado. Compártelo en WhatsApp o correo.';

  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(URL_ACTUAL)
      .then(() => mostrarToast(mensajeExito))
      .catch(() => mostrarToast('No se pudo copiar automáticamente, selecciona la barra de direcciones.'));
    return;
  }

  const input = document.createElement('input');
  input.value = URL_ACTUAL;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  mostrarToast(mensajeExito);
}

productosContainer.addEventListener('click', (event) => {
  const id = event.target.dataset.id;
  if (!id) return;
  agregarAlCarrito(id);
});

carritoItems.addEventListener('click', (event) => {
  const btn = event.target.closest('.item-carrito__btn');
  if (!btn) return;
  modificarCantidad(btn.dataset.id, btn.dataset.accion);
});

btnWhatsApp.addEventListener('click', enviarWhatsApp);

buscador.addEventListener('input', (event) => filtrarProductos(event.target.value));

scrollToCatalog.addEventListener('click', () => {
  document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
});

btnCopiarLink?.addEventListener('click', copiarLink);

renderProductos();
actualizarCarrito();
minimoPedido.textContent = `Pedido mínimo: ${formatoMoneda.format(negocio.pedidoMinimo)}`;
