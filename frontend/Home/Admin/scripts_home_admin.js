class Producto {
    constructor(nombre, precio, imagen, categoria) {
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.categoria = categoria;
    }
}

class GestorProductos {
    constructor() {
        this.productos = [
            new Producto('Playstation 1', 100, 'https://upload.wikimedia.org/wikipedia/commons/9/95/PSX-Console-wController.png', 'consolas'),
            new Producto('Playstation 2', 150, 'https://w7.pngwing.com/pngs/98/809/png-transparent-playstation-2-playstation-3-super-nintendo-entertainment-system-video-game-consoles-playstation-2-game-electronics-gadget-thumbnail.png', 'consolas'),
            new Producto('Playstation 3', 200, 'https://e7.pngegg.com/pngimages/948/199/png-clipart-playstation-3-playstation-2-playstation-4-video-game-consoles-sony-playstation-game-electronics.png', 'consolas'),
            new Producto('Crash Bandicoot', 60, 'https://i.3djuegos.com/juegos/10692/crash_bandicoot/fotos/ficha/crash_bandicoot-2464077.jpg', 'videojuegos'),
            new Producto('The Last of Us', 70, 'https://www.portalgames.com.ar/wp-content/uploads/2020/03/The_Last_of_US.jpg', 'videojuegos'),
            new Producto('EA Sports FC 25', 150, 'https://www.clarin.com/2024/07/17/ORRRfEnDj_720x0__1.jpg', 'videojuegos'),
            new Producto('Nintendo Switch', 300, 'https://http2.mlstatic.com/D_NQ_NP_845205-MLA70414548864_072023-O.webp', 'consolas')
        ];

        this.itemsPorPagina = 6;
        this.paginaActual = 1;
        this.productosFiltrados = this.productos;
    }

    // Inicializa los event listeners y el filtro de productos por defecto
    init() {
        this.initEventListeners();
        this.filtrarProductos('todos');
    }

    // Configura los event listeners para varios elementos de la interfaz de usuario
    initEventListeners() {
        document.querySelector(".expand-btn").addEventListener("click", () => {
            document.body.classList.toggle("collapsed");
        });

        document.querySelectorAll(".sidebar-links a").forEach((elem) => {
            elem.addEventListener('click', (e) => {
                e.preventDefault();
                const categoria = elem.getAttribute('href').substring(1);
                document.querySelectorAll(".sidebar-links a").forEach((link) => link.classList.remove('active'));
                elem.classList.add("active");
                this.filtrarProductos(categoria);
                document.getElementById("pagar-container").classList.toggle('d-none', categoria !== 'carrito');
            });
        });

        document.getElementById("themeToggleBtn").addEventListener("click", () => {
            const esOscuro = document.body.classList.toggle("dark");
            document.body.classList.toggle("light", !esOscuro);
            document.getElementById("sidebar").classList.toggle("dark", esOscuro);
            document.getElementById("sidebar").classList.toggle("light", !esOscuro);
        });

        document.body.classList.add('dark');
        document.getElementById("sidebar").classList.add("dark");

        const iconoLuna = document.createElement('span');
        iconoLuna.classList.add('icon-moon');
        iconoLuna.innerHTML = '&#9728;';
        document.getElementById("themeToggleBtn").appendChild(iconoLuna);

        document.getElementById('prevPage').addEventListener('click', () => {
            if (this.paginaActual > 1) {
                this.paginaActual--;
                this.renderizarProductos();
            }
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            if (this.paginaActual * this.itemsPorPagina < this.productosFiltrados.length) {
                this.paginaActual++;
                this.renderizarProductos();
            }
        });

        document.getElementById("pagarBtn").addEventListener("click", () => {
            window.location.href = "./Ticket/ticket.html";
        });

        document.querySelector('a[href="#nuevo"]').addEventListener('click', (event) => {
            event.preventDefault();
            this.filtrarProductos('nuevo');
            this.ocultarBotonesPaginacion();
        });

        document.querySelectorAll('a[href]:not([href="#nuevo"])').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                this.mostrarBotonesPaginacion();
            });
        });

        document.getElementById('logo-link').addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = "../../index.html";
        });

        document.getElementById('home-link').addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = "../home.html";
        });
    }

    // Renderiza la lista de productos basada en la página actual y el filtro
    renderizarProductos() {
        const listaProductos = document.getElementById('product-list');
        listaProductos.innerHTML = '';
        document.getElementById('nuevo-producto-form').innerHTML = ''; // Limpia el formulario de nuevo producto
        const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
        const fin = inicio + this.itemsPorPagina;
        const productosAMostrar = this.productosFiltrados.slice(inicio, fin);

        if (productosAMostrar.length === 0 && this.productosFiltrados !== this.productos) {
            listaProductos.innerHTML = '<p>No se encontraron productos</p>';
            return;
        }

        productosAMostrar.forEach((producto, index) => {
            const tarjetaProducto = `
                <div class="col-md-4">
                    <div class="card mb-4 shadow-sm">
                        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">$${producto.precio}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <button class="btn btn-sm btn-primary" onclick="gestorProductos.editarProducto(${index})">Modificar</button>
                                <button class="btn btn-sm btn-danger" id="eliminarProducto${index}">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            listaProductos.innerHTML += tarjetaProducto;
        });

        // Mostrar u ocultar botones de paginación
        this.actualizarBotonesPaginacion();
    }

    // Filtra productos basados en la categoría seleccionada
    filtrarProductos(categoria) {
        if (categoria === 'nuevo') {
            document.getElementById('product-list').innerHTML = '';
            this.crearFormularioNuevoProducto();
            return;
        }
        this.productosFiltrados = categoria === 'todos' ? this.productos : this.productos.filter(producto => producto.categoria === categoria);
        this.paginaActual = 1;
        this.renderizarProductos();
    }

    // Crea el formulario para agregar un nuevo producto
    crearFormularioNuevoProducto() {
        const formContainer = document.getElementById('nuevo-producto-form');
        formContainer.innerHTML = `
            <div class="card mx-auto" style="max-width: 800px;">
                <div class="card-body">
                    <h5 class="card-title">Nuevo Producto</h5>
                    <form id="newProductForm" class="d-flex flex-column">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="productName" class="form-label">Nombre del Producto</label>
                                    <input type="text" class="form-control" id="productName" required>
                                </div>
                                <div class="mb-3">
                                    <label for="productPrice" class="form-label">Precio</label>
                                    <input type="number" class="form-control" id="productPrice" required>
                                </div>
                                <div class="mb-3">
                                    <label for="productType" class="form-label">Tipo</label>
                                    <select class="form-control" id="productType" required>
                                        <option value="consola">Consola</option>
                                        <option value="videojuego">Videojuego</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="productImage" class="form-label">Imagen (URL)</label>
                                    <input type="file" class="form-control" id="productImage" required>
                                </div>
                                <img id="imagePreview" src="" alt="Vista previa de la imagen" class="img-thumbnail mb-3" style="display: none; width: 100%; height: 300px; object-fit: cover;">
                            </div>
                        </div>
                        <div class="d-flex justify-content-center">
                            <button type="submit" class="btn btn-primary">Agregar Producto</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const productImageInput = document.getElementById('productImage');
        const imagePreview = document.getElementById('imagePreview');

        productImageInput.addEventListener('input', () => {
            const url = productImageInput.value;
            if (url) {
                imagePreview.src = url;
                imagePreview.style.display = 'block';
            } else {
                imagePreview.style.display = 'none';
            }
        });

        document.getElementById('newProductForm').addEventListener('submit', (event) => {
            event.preventDefault();
            this.agregarNuevoProducto();
        });
    }

    // Crea el formulario para editar un producto existente
    editarProductoForm(producto) {
        const formContainer = document.getElementById('nuevo-producto-form');
        formContainer.innerHTML = `
            <div class="modal fade show" id="productModal" tabindex="-1" role="dialog" style="display: block; background: rgba(0, 0, 0, 0.5);">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content bg-dark text-light">
                        <div class="modal-header">
                            <h5 class="modal-title">Modificar Producto</h5>
                            <button type="button" class="btn-close" aria-label="Close" onclick="gestorProductos.cerrarModal()" style="filter: invert(1);"></button>
                        </div>
                        <div class="modal-body">
                            <form id="editProductForm" class="d-flex flex-column">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="editProductName" class="form-label">Nombre del Producto</label>
                                            <input type="text" class="form-control bg-dark text-light" id="editProductName" value="${producto.nombre}" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="editProductPrice" class="form-label">Precio</label>
                                            <input type="number" class="form-control bg-dark text-light" id="editProductPrice" value="${producto.precio}" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="editProductType" class="form-label">Tipo</label>
                                            <select class="form-control bg-dark text-light" id="editProductType" required>
                                                <option value="consola" ${producto.categoria === 'consolas' ? 'selected' : ''}>Consola</option>
                                                <option value="videojuego" ${producto.categoria === 'videojuegos' ? 'selected' : ''}>Videojuego</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="editProductImage" class="form-label">Imagen (URL)</label>
                                            <input type="url" class="form-control bg-dark text-light" id="editProductImage" value="${producto.imagen}" required>
                                        </div>
                                        <img id="editImagePreview" src="${producto.imagen}" alt="Vista previa de la imagen" class="img-thumbnail mb-3" style="display: block; width: 100%; height: 300px; object-fit: cover;">
                                    </div>
                                </div>
                                <div class="d-flex justify-content-center">
                                    <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const productImageInput = document.getElementById('editProductImage');
        const imagePreview = document.getElementById('editImagePreview');

        productImageInput.addEventListener('input', () => {
            const url = productImageInput.value;
            if (url) {
                imagePreview.src = url;
                imagePreview.style.display = 'block';
            } else {
                imagePreview.style.display = 'none';
            }
        });

        document.getElementById('editProductForm').addEventListener('submit', (event) => {
            event.preventDefault();
            this.actualizarProducto(producto);
            this.cerrarModal();
        });
    }

    // Cierra el modal
    cerrarModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.parentNode.removeChild(modal);
        }
    }

    // Agrega un nuevo producto a la lista
    agregarNuevoProducto() {
        const nombre = document.getElementById('productName').value;
        const precio = document.getElementById('productPrice').value;
        const imagen = document.getElementById('productImage').value;
        const categoria = document.getElementById('productType').value;

        const nuevoProducto = new Producto(nombre, precio, imagen, categoria);
        this.productos.push(nuevoProducto);
        this.filtrarProductos('todos');
    }

    // Edita un producto existente
    editarProducto(index) {
        const producto = this.productos[index];
        this.editarProductoForm(producto);
    }

    // Actualiza el producto con nuevos valores
    actualizarProducto(producto) {
        producto.nombre = document.getElementById('editProductName').value;
        producto.precio = document.getElementById('editProductPrice').value;
        producto.imagen = document.getElementById('editProductImage').value;
        producto.categoria = document.getElementById('editProductType').value;

        this.filtrarProductos('todos');
    }

    // Oculta los botones de paginación
    ocultarBotonesPaginacion() {
        document.getElementById('prevPage').style.display = 'none';
        document.getElementById('nextPage').style.display = 'none';
    }

    // Actualiza la visibilidad de los botones de paginación
    actualizarBotonesPaginacion() {
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        const totalPages = Math.ceil(this.productosFiltrados.length / this.itemsPorPagina);

        if (totalPages == 1) {
            ocultarBotonesPaginacion();
        } else {
            if (this.paginaActual === 1) {
                prevPageBtn.style.display = 'none';
                nextPageBtn.style.display = 'block';
            } else if (this.paginaActual === totalPages) {
                prevPageBtn.style.display = 'block';
                nextPageBtn.style.display = 'none';
            } else {
                prevPageBtn.style.display = 'block';
                nextPageBtn.style.display = 'block';
            }
        }
    }

    // Función para cambiar el texto del botón y su estilo
    cambiarTextoBoton(boton, texto) {
        boton.textContent = texto;
        if (texto === "Agregar nuevamente") {
            boton.style.border = "2px solid green";
        } else {
            boton.style.border = ""; // Restablecer el borde a su estilo original
        }
    }

    // Función para eliminar producto
    eliminarProducto(index) {
        const producto = this.productos[index];
         // la logica para eliminar un producto va aqui
        // https://www.youtube.com/watch?v=6_qRRmRmqUk

        // Cambia el texto del botón a "Agregar nuevamente"
        const botonEliminar = document.getElementById(`eliminarProducto${index}`);
        this.cambiarTextoBoton(botonEliminar, "Agregar nuevamente");
    }

    // Función para agregar nuevamente el producto
    agregarProducto(index) {
        const producto = this.productos[index];
        // Y aquí colocaría la lógica para agregar nuevamente el producto
        // ... SI TUVIERA UNO! *https://www.youtube.com/watch?v=hBDm3NPwAIA*

        // Cambiar el texto del botón a "Eliminar"
        const botonAgregar = document.getElementById(`eliminarProducto${index}`);
        this.cambiarTextoBoton(botonAgregar, "Eliminar");
    }

    // Asignar eventos a los botones de eliminar/agregar
    asignarEventosBotones() {
        this.productos.forEach((producto, index) => {
            const botonEliminar = document.getElementById(`eliminarProducto${index}`);
            botonEliminar.addEventListener('click', () => {
                if (botonEliminar.textContent === "Eliminar") {
                    this.eliminarProducto(index);
                } else {
                    this.agregarProducto(index);
                }
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.gestorProductos = new GestorProductos();
    gestorProductos.init();
    gestorProductos.asignarEventosBotones();
});
