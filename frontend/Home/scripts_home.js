document.addEventListener("DOMContentLoaded", () => {
  const expandBtn = document.querySelector(".expand-btn");
  const allLinks = document.querySelectorAll(".sidebar-links a");
  const pagarContainer = document.getElementById("pagar-container");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const productList = document.getElementById('product-list');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  const pagarBtn = document.getElementById("pagarBtn");
  const carritoList = document.getElementById('carrito-list');

  const productos = [
    { name: 'Playstation 1', price: 100, img: 'https://upload.wikimedia.org/wikipedia/commons/9/95/PSX-Console-wController.png', category: 'consolas' },
    { name: 'Playstation 2', price: 150, img: 'https://w7.pngwing.com/pngs/98/809/png-transparent-playstation-2-playstation-3-super-nintendo-entertainment-system-video-game-consoles-playstation-2-game-electronics-gadget-thumbnail.png', category: 'consolas' },
    { name: 'Playstation 3', price: 200, img: 'https://e7.pngegg.com/pngimages/948/199/png-clipart-playstation-3-playstation-2-playstation-4-video-game-consoles-sony-playstation-game-electronics.png', category: 'consolas' },
    { name: 'Crash Bandicoot', price: 60, img: 'https://i.3djuegos.com/juegos/10692/crash_bandicoot/fotos/ficha/crash_bandicoot-2464077.jpg', category: 'videojuegos' },
    { name: 'The Last of Us', price: 70, img: 'https://www.portalgames.com.ar/wp-content/uploads/2020/03/The_Last_of_US.jpg', category: 'videojuegos' },
    { name: 'EA Sports FC 25', price: 150, img: 'https://www.clarin.com/2024/07/17/ORRRfEnDj_720x0__1.jpg', category: 'videojuegos' },
    { name: 'Nintendo Switch', price: 300, img: 'https://http2.mlstatic.com/D_NQ_NP_845205-MLA70414548864_072023-O.webp', category: 'consolas' }
  ];

  const itemsPorPagina = 6;
  let paginaActual = 1;
  let productosFiltrados = productos;
  let carrito = [];

  expandBtn.addEventListener("click", () => {
    document.body.classList.toggle("collapsed");
  });

  allLinks.forEach((elem) => {
    elem.addEventListener('click', function (e) {
      e.preventDefault();
      const hrefLinkClick = elem.href;
      allLinks.forEach((link) => {
        link.classList.remove('active');
      });
      elem.classList.add("active");

      const categoria = elem.getAttribute('href').substring(1);
      filtrarProductos(categoria);

      if (categoria === 'carrito') {
        pagarContainer.classList.remove('d-none');
        ocultarBotonesPaginacion();
        renderizarCarrito();
      } else {
        pagarContainer.classList.add('d-none');
        mostrarBotonesPaginacion();
      }
    });
  });

  themeToggleBtn.addEventListener("click", () => {
    if (document.body.classList.contains("dark")) {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
      document.getElementById("sidebar").classList.remove("dark");
      document.getElementById("sidebar").classList.add("light");
    } else {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      document.getElementById("sidebar").classList.remove("light");
      document.getElementById("sidebar").classList.add("dark");
    }
  });

  document.body.classList.add('dark');
  document.getElementById("sidebar").classList.add("dark");

  const iconMoon = document.createElement('span');
  iconMoon.classList.add('icon-moon');
  iconMoon.innerHTML = '&#9728;';
  themeToggleBtn.appendChild(iconMoon);

  function renderizarProductos() {
    productList.innerHTML = '';

    const inicio = (paginaActual - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    const productosAMostrar = productosFiltrados.slice(inicio, fin);

    if (productosAMostrar.length === 0) {
      productList.innerHTML = '<p>No se encontraron productos</p>';
      return;
    }

    productosAMostrar.forEach(producto => {
      const tarjetaProducto = `
        <div class="col-md-4">
          <div class="card mb-4 shadow-sm">
            <img src="${producto.img}" class="card-img-top" alt="${producto.name}">
            <div class="card-body">
              <h5 class="card-title">${producto.name}</h5>
              <p class="card-text">$${producto.price}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-danger decrement-btn">-</button>
                  <span class="mx-2 quantity">1</span>
                  <button class="btn btn-sm btn-outline-success increment-btn">+</button>
                </div>
                <button class="btn btn-sm btn-primary add-to-cart-btn">Agregar al carrito</button>
              </div>
            </div>
          </div>
        </div>
      `;
      productList.innerHTML += tarjetaProducto;
    });

    agregarListenersBotonesCantidad();
    agregarListenersBotonesAgregarCarrito();
  }

  function agregarListenersBotonesCantidad() {
    const botonesIncrementar = document.querySelectorAll('.increment-btn');
    const botonesDecrementar = document.querySelectorAll('.decrement-btn');

    botonesIncrementar.forEach(boton => {
      boton.addEventListener('click', () => {
        const elementoCantidad = boton.parentElement.querySelector('.quantity');
        let cantidad = parseInt(elementoCantidad.textContent);
        cantidad++;
        elementoCantidad.textContent = cantidad;
      });
    });

    botonesDecrementar.forEach(boton => {
      boton.addEventListener('click', () => {
        const elementoCantidad = boton.parentElement.querySelector('.quantity');
        let cantidad = parseInt(elementoCantidad.textContent);
        if (cantidad > 1) {
          cantidad--;
          elementoCantidad.textContent = cantidad;
        }
      });
    });
  }

  function agregarListenersBotonesAgregarCarrito() {
    const botonesAgregarCarrito = document.querySelectorAll('.add-to-cart-btn');

    var notyf = new Notyf();

    botonesAgregarCarrito.forEach(boton => {
      boton.addEventListener('click', () => {
        const tarjeta = boton.closest('.card');
        const nombreProducto = tarjeta.querySelector('.card-title').textContent;
        const precioProducto = parseFloat(tarjeta.querySelector('.card-text').textContent.replace('$', ''));
        const cantidad = parseInt(tarjeta.querySelector('.quantity').textContent);

        const productoEnCarrito = carrito.find(item => item.name === nombreProducto);
        if (productoEnCarrito) {
          productoEnCarrito.quantity += cantidad;
        } else {
          carrito.push({ name: nombreProducto, price: precioProducto, quantity: cantidad });
        }
        // Display a success notification
        notyf.success('Producto agregado al carrito!');
      });
    });
  }

  function renderizarCarrito() {
    productList.innerHTML = '';

    if (carrito.length === 0) {
      productList.innerHTML = `
        <div class="empty-cart-card">
          <div class="card mb-4 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">El carrito está vacío</h5>
            </div>
          </div>
        </div>
      `;
      return;
    }

    carrito.forEach(producto => {
      const tarjetaProducto = `
        <div class="col-md-4">
          <div class="card mb-4 shadow-sm">
            <img src="${producto.img}" class="card-img-top" alt="${producto.name}">
            <div class="card-body">
              <h5 class="card-title">${producto.name}</h5>
              <p class="card-text">$${producto.price}</p>
              <p class="card-text">Cantidad: ${producto.quantity}</p>
              <p class="card-text">Total: $${producto.price * producto.quantity}</p>
              <button class="btn btn-sm btn-danger remove-from-cart-btn">Eliminar</button>
            </div>
          </div>
        </div>
      `;
      productList.innerHTML += tarjetaProducto;
    });

    agregarListenersBotonesEliminarCarrito();
  }

  function agregarListenersBotonesEliminarCarrito() {
    const botonesEliminarCarrito = document.querySelectorAll('.remove-from-cart-btn');

    botonesEliminarCarrito.forEach(boton => {
      boton.addEventListener('click', () => {
        const tarjeta = boton.closest('.card');
        const nombreProducto = tarjeta.querySelector('.card-title').textContent;

        carrito = carrito.filter(item => item.name !== nombreProducto);

        renderizarCarrito();
      });
    });
  }

  function filtrarProductos(categoria) {
    if (categoria === 'todos') {
      productosFiltrados = productos;
    } else {
      productosFiltrados = productos.filter(producto => producto.category === categoria);
    }
    paginaActual = 1;
    renderizarProductos();
  }

  prevPageBtn.addEventListener('click', () => {
    if (paginaActual > 1) {
      paginaActual--;
      renderizarProductos();
    }
  });

  nextPageBtn.addEventListener('click', () => {
    if (paginaActual * itemsPorPagina < productosFiltrados.length) {
      paginaActual++;
      renderizarProductos();
    }
  });

  filtrarProductos('todos');

  pagarBtn.addEventListener("click", () => {
    if (carrito.length === 0) {
      Swal.fire({
        icon: 'error',
        title: '<h4>Carrito vacio</h4>',
        html: `
            <p>No se encontraron items en el carrito</p>
            <img src="https://media.tenor.com/0Yh4P81SBnkAAAAM/fresh-prince-room.gif" alt="empty" style="width:100%; max-width:200px; margin-top: 10px;" />
        `,
        background: '#2b2b2b',
        confirmButtonColor: '#d33ffff',
        confirmButtonText: '<span>Reintentar</span>',
        customClass: {
            popup: 'swal2-popup-retro',
            icon: 'swal2-icon-retro',
            confirmButton: 'swal2-confirm-retro'
        },
        heightAuto: false, // Desactiva la altura automática, ESTE ERA EL MALDITO PROBLEMA!!!! MALDITO SWEATALERT!!!!
      });
      //Swal.fire("El carrito está vacío. No puedes proceder al pago.");
      return;
    }
    localStorage.setItem('carrito', JSON.stringify(carrito)); // Guarda el carrito en localStorage
    window.location.href = "./Ticket/ticket.html";
  });


  function ocultarBotonesPaginacion() {
    if (prevPageBtn) prevPageBtn.style.display = 'none';
    if (nextPageBtn) nextPageBtn.style.display = 'none';
  }

  function mostrarBotonesPaginacion() {
    if (prevPageBtn) prevPageBtn.style.display = 'block';
    if (nextPageBtn) nextPageBtn.style.display = 'block';
  }
});
