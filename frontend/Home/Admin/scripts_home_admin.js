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
        this.filtrarProductos('todos');
        this.initEventListeners();
    }

    // Configura los event listeners para varios elementos de la interfaz de usuario
    initEventListeners() {
        document.getElementById('modificar').addEventListener('click', function(event) {
            event.preventDefault(); // Evita el comportamiento predeterminado del enlace
            document.getElementById('edit-producto-form').style.display = 'block';
        });

        const form = document.getElementById('nuevo-producto-form');
        console.log(form);
        document.getElementById('nuevo-link').addEventListener('click', function(event) {
            event.preventDefault(); 
            document.getElementById('nuevo-producto-form').style.display = 'block';
        });
        
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
                if(categoria !== 'nuevo'){
                    document.getElementById('nuevo-producto-form').style.display = 'none';
                }
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
                                <button class="btn btn-sm btn-primary" onclick="gestorProductos.editarProducto(${index})" id="modificar">Modificar</button>
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
        else if(categoria !== 'nuevo'){
            document.getElementById('nuevo-producto-form').style.display = 'none';
        }
        this.productosFiltrados = categoria === 'todos' ? this.productos : this.productos.filter(producto => producto.categoria === categoria);
        this.paginaActual = 1;
        this.renderizarProductos();
    }

    // Crea el formulario para agregar un nuevo producto
    crearFormularioNuevoProducto() {}

    // Crea el formulario para editar un producto existente
    editarProductoForm(producto) {
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

async function cargarDatos() {
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;
    const tipo = document.getElementById("tipo").value;
    const imagen = document.getElementById("imagen").files[0];

    const datos = new FormData();
    datos.append("nombre", nombre);
    datos.append("precio", precio);
    datos.append("tipo", tipo);
    datos.append("image", imagen);

    const pedido = await fetch("http://localhost:3000/productos/insert", {
        method: "POST",
        body: datos,
    });

    const respuesta = await pedido.json();
};

async function borrarDatos(id) {
    const pedido = await fetch("http://localhost:3000/productos/delete/" + id, {
        method: "DELETE",
    });
    const respuesta = await pedido.json();
};

async function activarDatos(id) {
    const pedido = await fetch("http://localhost:3000/productos/restore/" + id, {
        method: "PATCH",
    });
    const respuesta = await pedido.json();
};

async function modificarDatos(id) {
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;
    const tipo = document.getElementById("tipo").value;

    const datos = new FormData();
    datos.append("nombre", nombre);
    datos.append("precio", precio);
    datos.append("tipo", tipo);

    console.log(datos);
    const pedido = await fetch("http://localhost:3000/productos/update/" + id, {
        method: "UPDATE",
        body: datos,
    });
    const respuesta = await pedido.json();
}

async function cargarProductos(categoria, limit, offset) {
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
// Cierra el formulario de edición
function cerrar() {
    document.getElementById('edit-producto-form').style.display = 'none';
}

document.addEventListener("DOMContentLoaded", () => {
    window.gestorProductos = new GestorProductos();
    gestorProductos.init();
    gestorProductos.asignarEventosBotones();
});
