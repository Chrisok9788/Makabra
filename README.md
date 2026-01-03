# Catálogo mayorista con carrito y pedido por WhatsApp

Sitio estático pensado para mayoristas que venden a cafeterías, hoteles o negocios independientes. Permite consultar el catálogo por caja, agregar cantidades al carrito y disparar el pedido completo a WhatsApp con el texto ya redactado.

## Cómo verlo y compartirlo

1. Instala un servidor estático simple (`npm i -g serve` o usa Python).
2. Desde la carpeta del proyecto ejecuta uno de estos comandos:
   - `serve -l 4173 .`
   - `python3 -m http.server 4173`
3. Abre [http://localhost:4173](http://localhost:4173) y utiliza el botón “Copiar link para compartir” para entregar el enlace a tus clientes o vendedores. Si lo publicas en un hosting (Netlify, GitHub Pages, etc.) el botón copiará automáticamente esa URL pública.

## Personalización rápida

- **Productos**: edita el arreglo `productosData` en `app.js` para actualizar nombre, precio por caja, SKU y descripción.
- **Pedido mínimo y WhatsApp**: ajusta los valores del objeto `negocio` (`telefono` y `pedidoMinimo`). El botón solo se habilita cuando el total supera ese mínimo.
- **Logo**: reemplaza `logo.svg` con tu imagen (mantén el mismo nombre o actualiza la ruta en `index.html`).
- **Textos**: toda la narrativa B2B (hero, avisos y etiquetas) está en `index.html` para que adaptes el tono a tu marca.

## Características

- Buscador por nombre o SKU para facilitar la atención a clientes recurrentes.
- Carrito con detalle de presentación y cantidades pensado para compras por caja o display.
- Estado dinámico del mínimo requerido antes de habilitar el envío por WhatsApp.
- Botón para copiar el enlace del catálogo y compartirlo en segundos.
