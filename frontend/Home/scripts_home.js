class Producto {
  constructor(name, price, img, category) {
    this.name = name;
    this.price = price;
    this.img = img;
    this.category = category;
  }
}

class Carrito {
  constructor() {
    this.items = [];
  }

  agregarProducto(producto, cantidad, id) {
    const productoEnCarrito = this.items.find(item => item.name === producto.name);
    if (productoEnCarrito) {
      productoEnCarrito.quantity += cantidad;
      productoEnCarrito.id = id;
      productoEnCarrito.total = productoEnCarrito.quantity * producto.price;
    } else {
      this.items.push({ ...producto, quantity: cantidad, id: id, total: producto.price * cantidad });
    }
  }

  eliminarProducto(nombreProducto) {
    this.items = this.items.filter(item => item.name !== nombreProducto);
  }

  actualizarCantidad(nombreProducto, cantidad) {
    this.items = this.items.map(item => {
      if (item.name === nombreProducto) {
        item.quantity = cantidad;
      }
      return item;
    });
  }

  vaciarCarrito() {
    this.items = [];
  }
}

class UI {
  constructor() {
    this.expandBtn = document.querySelector(".expand-btn");
    this.allLinks = document.querySelectorAll(".sidebar-links a");
    this.pagarContainer = document.getElementById("pagar-container");
    this.themeToggleBtn = document.getElementById("themeToggleBtn");
    this.productList = document.getElementById('product-list');
    this.prevPageBtn = document.getElementById('prevPage');
    this.nextPageBtn = document.getElementById('nextPage');
    this.pagarBtn = document.getElementById("pagarBtn");
    this.carritoList = document.getElementById('carrito-list');
    this.carrito = new Carrito();
    this.productos = [    ];
    this.itemsPorPagina = 6;
    this.paginaActual = 1;
    this.productosFiltrados = this.productos;
    this.init();
  }

  init() {

    document.getElementById('usuario').innerHTML = "Bienvenido "+ localStorage.getItem('nombreUsuario');

    this.expandBtn.addEventListener("click", () => {
      document.body.classList.toggle("collapsed");
    });

    this.allLinks.forEach((elem) => {
      elem.addEventListener('click', (e) => {
        e.preventDefault();
        const hrefLinkClick = elem.href;
        this.allLinks.forEach((link) => {
          link.classList.remove('active');
        });
        elem.classList.add("active");

        const categoria = elem.getAttribute('href').substring(1);
        this.filtrarProductos(categoria);

        if (categoria === 'carrito') {
          this.pagarContainer.classList.remove('d-none');
          this.ocultarBotonesPaginacion();
          this.renderizarCarrito();
        } else {
          this.pagarContainer.classList.add('d-none');
          //this.mostrarBotonesPaginacion();
        }
      });
    });

    this.themeToggleBtn.addEventListener("click", () => {
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
    this.themeToggleBtn.appendChild(iconMoon);

    this.prevPageBtn.addEventListener('click', () => {
      if (this.paginaActual > 1) {
        this.paginaActual--;
        this.renderizarProductos();
      }
    });

    this.nextPageBtn.addEventListener('click', () => {
      if (this.paginaActual * this.itemsPorPagina < this.productosFiltrados.length) {
        this.paginaActual++;
        this.renderizarProductos();
      }
    });

    this.pagarBtn.addEventListener("click", () => {
      if (this.carrito.items.length === 0) {
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
          heightAuto: false,
        });
        return;
      }
      localStorage.setItem('carrito', JSON.stringify(this.carrito.items));
      console.log(this.carrito.items.total);
      const total = this.carrito.items.reduce((acc, item) => acc + item.total, 0);
      localStorage.setItem('Total', JSON.stringify(total));
      window.location.href = "./Ticket/ticket.html";
      cargarVentas();
    });

    this.filtrarProductos('todos');
  }

  filtrarProductos(categoria) {
    this.paginaActual = 1;
    const limit = this.itemsPorPagina;
    const offset = (this.paginaActual - 1) * this.itemsPorPagina;
    this.cargarProductos(categoria, limit, offset);
  }

  async cargarProductos(categoria, limit, offset) {
    try {
        const queryString = categoria === 'todos' ? `limit=${limit}&offset=${offset}` : `categoria=${categoria}&limit=${limit}&offset=${offset}`;
        const response = await fetch(`http://localhost:3000/productos/list?${queryString}`);
        const html = await response.text();

        if (html.trim() === '') {
            return false; 
        }

        this.productList.innerHTML = html;
        this.agregarListenersBotonesCantidadGral();
        this.agregarListenersBotonesAgregarCarrito();
        this.actualizarBotonesPaginacion(); 
        return true; 
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        return false; 
    }
  }

renderizarProductos() {
  this.nextPageBtn.addEventListener('click', async () => {
      const limit = this.itemsPorPagina;
      const offset = this.paginaActual * limit;

      const productsLoaded = await this.cargarProductos('todos', limit, offset);
      if (productsLoaded) {
          this.paginaActual++;
          this.actualizarBotonesPaginacion(); 
      }
  });

    this.prevPageBtn.addEventListener('click', () => {
        if (this.paginaActual > 1) {
            this.paginaActual--;
            const limit = this.itemsPorPagina;
            const offset = (this.paginaActual - 1) * limit;
            console.log(`Previous page clicked. Current page: ${this.paginaActual}, Limit: ${limit}, Offset: ${offset}`); // Debugging line
            this.cargarProductos('todos', limit, offset);
        }
    });
}

  agregarListenersBotonesAgregarCarrito() {
    const botonesAgregarCarrito = document.querySelectorAll('.add-to-cart-btn');

    var notyf = new Notyf();

    botonesAgregarCarrito.forEach(boton => {
      boton.addEventListener('click', () => {
        const tarjeta = boton.closest('.card');
        const nombreProducto = tarjeta.querySelector('.card-title').textContent;
        const precioProducto = parseFloat(tarjeta.querySelector('.card-text').textContent.replace('$', ''));
        const cantidad = parseInt(tarjeta.querySelector('.quantity').textContent);
        const id = parseInt(tarjeta.querySelector('.card-id').textContent);
        console.log(id);

        const producto = new Producto(nombreProducto, precioProducto, '', '');
        this.carrito.agregarProducto(producto, cantidad, id);

        notyf.success('Producto agregado al carrito!');
      });
    });
  }

  renderizarCarrito() {
    console.log('Renderizando el carrito');

    this.productList.innerHTML = '';

    if (this.carrito.items.length === 0) {
      this.productList.innerHTML = `
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

    this.carrito.items.forEach(producto => {
      const tarjetaProducto = `
        <div class="col-md-4">
          <div class="card mb-4 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">${producto.name}</h5>
              <p class="card-text">$${producto.price}</p>
              <p class="card-text">Cantidad: ${producto.quantity}</p>
              <p class="card-text">Total: $${producto.price * producto.quantity}</p>
              <button class="btn btn-sm btn-danger remove-from-cart-btn">Eliminar</button>
              <button class="btn btn-sm btn-secondary decrement-quantity-btn">-</button>
              <button class="btn btn-sm btn-secondary increment-quantity-btn">+</button>
            </div>
          </div>
        </div>
      `;
      this.productList.innerHTML += tarjetaProducto;
    });

    this.agregarListenersBotonesEliminarCarrito();
    this.agregarListenersBotonesCantidad();
  }
  // Oculta los botones de paginación
  ocultarBotonesPaginacion() {
    this.prevPageBtn.style.display = 'none';
    this.nextPageBtn.style.display = 'none';
  }

  // Actualiza la visibilidad de los botones de paginación
  actualizarBotonesPaginacion() {
    const totalPages = Math.ceil(this.productosFiltrados.length / this.itemsPorPagina);

    if (totalPages == 1) {
        this.ocultarBotonesPaginacion();
    } else {
        if (this.paginaActual === 1) {
            this.prevPageBtn.style.display = 'none';
            this.nextPageBtn.style.display = 'block';
        } else if (this.paginaActual === totalPages) {
            this.prevPageBtn.style.display = 'block';
            this.nextPageBtn.style.display = 'none';
        } else {
            this.prevPageBtn.style.display = 'block';
            this.nextPageBtn.style.display = 'block';
        }
    }
  }

  agregarListenersBotonesEliminarCarrito() {
    const botonesEliminarCarrito = document.querySelectorAll('.remove-from-cart-btn');

    botonesEliminarCarrito.forEach(boton => {
      boton.addEventListener('click', () => {
        const tarjeta = boton.closest('.card');
        const nombreProducto = tarjeta.querySelector('.card-title').textContent;

        this.carrito.eliminarProducto(nombreProducto);
        this.renderizarCarrito();
      });
    });
  }

  agregarListenersBotonesCantidad() {
    const botonesIncrementar = document.querySelectorAll('.increment-quantity-btn');
    const botonesDecrementar = document.querySelectorAll('.decrement-quantity-btn');
    botonesIncrementar.forEach(boton => {
      boton.addEventListener('click', () => {
        const tarjeta = boton.closest('.card');
        const nombreProducto = tarjeta.querySelector('.card-title').textContent;

        this.carrito.actualizarCantidad(nombreProducto, this.carrito.items.find(item => item.name === nombreProducto).quantity + 1);
        this.renderizarCarrito();
      });
    });
    botonesDecrementar.forEach(boton => {
      boton.addEventListener('click', () => {
        const tarjeta = boton.closest('.card');
        const nombreProducto = tarjeta.querySelector('.card-title').textContent;

        const cantidadActual = this.carrito.items.find(item => item.name === nombreProducto).quantity;
        if (cantidadActual > 1) {
          this.carrito.actualizarCantidad(nombreProducto, cantidadActual - 1);
          this.renderizarCarrito();
        }
      });
    });
  }

  agregarListenersBotonesCantidadGral() {
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

  /*filtrarProductos(categoria) {
    if (categoria === 'todos') {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(producto => producto.category === categoria);
    }
    this.paginaActual = 1;
    this.renderizarProductos();
  }*/
}

async function cargarVentas() {
  //editar para que tome el local storage
  const nombre = localStorage.getItem('nombreUsuario');
  const total = localStorage.getItem('Total');
  const productos = localStorage.getItem('carrito');

  const datos = {
      nombre: nombre,
      total: total,
      productos: productos
  };

  const pedido = await fetch("http://localhost:3000/ventas/insert", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
  });

  const respuesta = await pedido.json();
  console.log(respuesta);
}

document.addEventListener("DOMContentLoaded", () => {
  new UI();
});