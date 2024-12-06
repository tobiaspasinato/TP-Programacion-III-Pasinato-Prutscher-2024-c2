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
        this.productos = [ ];
        
        this.itemsPorPagina = 6;
        this.paginaActual = 1;
        this.productosFiltrados = this.productos;
        this.productList = document.getElementById('product-list');
    }

    // Inicializa los event listeners y el filtro de productos por defecto
    init() {
        this.filtrarProductos('todos');
        this.initEventListeners();
    }

    // Configura los event listeners para varios elementos de la interfaz de usuario
    initEventListeners() {
        document.querySelectorAll('.btn-primary').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                document.getElementById('edit-producto-form').style.display = 'block';
            });
        });

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
        this.paginaActual = 1;
        const limit = this.itemsPorPagina;
        const offset = (this.paginaActual - 1) * this.itemsPorPagina;
        this.cargarProductos(categoria, limit, offset);
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
    async cargarProductos(categoria, limit, offset) {
        try {
            const queryString = categoria === 'todos' ? `limit=${limit}&offset=${offset}` : `categoria=${categoria}&limit=${limit}&offset=${offset}`;
            const response = await fetch(`http://localhost:3000/productos/listAdmin?${queryString}`);
            const html = await response.text();
    
            if (html.trim() === '') {
                return false; 
            }
    
            this.productList.innerHTML = html;
            this.actualizarBotonesPaginacion(); 
            return true; 
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            return false; 
        }
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
    console.log(id);
    const pedido = await fetch("http://localhost:3000/productos/delete/" + id, {
        method: "DELETE",
    });
    console.log(pedido);
};

async function activarDatos(id) {
    const pedido = await fetch("http://localhost:3000/productos/restore/" + id, {
        method: "PATCH",
    });
    console.log(pedido);
};

async function modificarDatos(id) {
    const nombre = document.getElementById("nombreMod").value;
    const precio = document.getElementById("precioMod").value;
    const tipo = document.getElementById("tipoMod").value;

    const datos = {
        nombre: nombre,
        precio: precio,
        tipo: tipo,
    };

    
    const pedido = await fetch("http://localhost:3000/productos/update/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
    });
    const respuesta = await manejarRespuesta(pedido);
    if (respuesta.ok) {
        gestorProductos.filtrarProductos('todos');
        cerrar();
    } else {
        console.error('Error actualizando producto:', respuesta);
    }
}

// Cierra el formulario de edición
function cerrar() {
    document.getElementById('edit-producto-form').style.display = 'none';
}

function intermedio(id) {
    console.log("hola");
    document.getElementById('edit-producto-form').style.display = 'block';

    const boton = document.getElementById("pBoton");

    // Eliminar cualquier event listener existente
    const nuevoBoton = boton.cloneNode(true);
    boton.parentNode.replaceChild(nuevoBoton, boton);

    nuevoBoton.addEventListener("click", function(event) {
        event.preventDefault();
        modificarDatos(id);
        cerrar()
    });
}

document.addEventListener("DOMContentLoaded", () => {
    window.gestorProductos = new GestorProductos();
    gestorProductos.init();
    gestorProductos.asignarEventosBotones();
});
