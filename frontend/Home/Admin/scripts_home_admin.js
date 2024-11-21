document.addEventListener("DOMContentLoaded", () => {
    const expandBtn = document.querySelector(".expand-btn");
    const allLinks = document.querySelectorAll(".sidebar-links a");
    const pagarContainer = document.getElementById("pagar-container");
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const productList = document.getElementById('product-list');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pagarBtn = document.getElementById("pagarBtn");
    const nuevoProductoForm = document.getElementById('nuevo-producto-form');
    const logoLink = document.getElementById('logo-link');
    const homeLink = document.getElementById('home-link');

    const products = [
        { name: 'Playstation 1', price: '$100', img: 'https://upload.wikimedia.org/wikipedia/commons/9/95/PSX-Console-wController.png', category: 'consolas' },
        { name: 'Playstation 2', price: '$150', img: 'https://w7.pngwing.com/pngs/98/809/png-transparent-playstation-2-playstation-3-super-nintendo-entertainment-system-video-game-consoles-playstation-2-game-electronics-gadget-thumbnail.png', category: 'consolas' },
        { name: 'Playstation 3', price: '$200', img: 'https://e7.pngegg.com/pngimages/948/199/png-clipart-playstation-3-playstation-2-playstation-4-video-game-consoles-sony-playstation-game-electronics.png', category: 'consolas' },
        { name: 'Crash Bandicoot', price: '$60', img: 'https://i.3djuegos.com/juegos/10692/crash_bandicoot/fotos/ficha/crash_bandicoot-2464077.jpg', category: 'videojuegos' },
        { name: 'The Last of Us', price: '$70', img: 'https://www.portalgames.com.ar/wp-content/uploads/2020/03/The_Last_of_US.jpg', category: 'videojuegos' },
        { name: 'EA Sports FC 25', price: '$150', img: 'https://www.clarin.com/2024/07/17/ORRRfEnDj_720x0__1.jpg', category: 'videojuegos' },
        { name: 'Nintendo Switch', price: '$300', img: 'https://http2.mlstatic.com/D_NQ_NP_845205-MLA70414548864_072023-O.webp', category: 'consolas' }
    ];

    const itemsPerPage = 6; 
    let currentPage = 1;
    let filteredProducts = products;

    expandBtn.addEventListener("click", () => {
        document.body.classList.toggle("collapsed");
    });

    allLinks.forEach((elem) => {
        elem.addEventListener('click', (e) => {
            e.preventDefault();
            const category = elem.getAttribute('href').substring(1);
            allLinks.forEach((link) => link.classList.remove('active'));
            elem.classList.add("active");
            filterProducts(category);
            pagarContainer.classList.toggle('d-none', category !== 'carrito');
        });
    });

    themeToggleBtn.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark");
        document.body.classList.toggle("light", !isDark);
        document.getElementById("sidebar").classList.toggle("dark", isDark);
        document.getElementById("sidebar").classList.toggle("light", !isDark);
    });

    document.body.classList.add('dark');
    document.getElementById("sidebar").classList.add("dark");

    const iconMoon = document.createElement('span');
    iconMoon.classList.add('icon-moon');
    iconMoon.innerHTML = '&#9728;';
    themeToggleBtn.appendChild(iconMoon);

    function renderProducts() {
        productList.innerHTML = '';
        nuevoProductoForm.innerHTML = ''; // Limpia el formulario de nuevo producto
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const productsToShow = filteredProducts.slice(start, end);

        if (productsToShow.length === 0 && filteredProducts !== products) {
            productList.innerHTML = '<p>No se encontraron productos</p>';
            return;
        }

        productsToShow.forEach(product => {
            const productCard = `
                <div class="col-md-4">
                    <div class="card mb-4 shadow-sm">
                        <img src="${product.img}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.price}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <button class="btn btn-sm btn-primary">Modificar</button>
                                <button class="btn btn-sm btn-danger">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            productList.innerHTML += productCard;
        });
    }

    function filterProducts(category) {
        if (category === 'nuevo') {
            productList.innerHTML = '';
            createNewProductForm();
            return;
        }
        filteredProducts = category === 'todos' ? products : products.filter(product => product.category === category);
        currentPage = 1;
        renderProducts();
    }

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage * itemsPerPage < filteredProducts.length) {
            currentPage++;
            renderProducts();
        }
    });

    filterProducts('todos');

    pagarBtn.addEventListener("click", () => {
        window.location.href = "./Ticket/ticket.html";
    });
    
    // Nuevo producto
    function createNewProductForm() {
        const formContainer = document.getElementById('nuevo-producto-form');
        formContainer.innerHTML = `
            <form id="newProductForm" class="d-flex">
                <div class="flex-grow-1">
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
                    <button type="submit" class="btn btn-primary">Agregar Producto</button>
                </div>
                <div class="ms-5">
                    <div class="mb-3">
                        <label for="productImage" class="form-label">Imagen (URL)</label>
                        <input type="url" class="form-control" id="productImage" required>
                    </div>
                    <img id="imagePreview" src="" alt="Vista previa de la imagen" class="img-thumbnail" style="display: none; max-width: 200px;">
                </div>
            </form>
        `;

        const productImageInput = document.getElementById('productImage');
        const imagePreview = document.getElementById('imagePreview');

        productImageInput.addEventListener('input', () => {
            const imageUrl = productImageInput.value;
            if (imageUrl) {
                imagePreview.src = imageUrl;
                imagePreview.style.display = 'block';
            } else {
                imagePreview.style.display = 'none';
            }
        });
    }

    document.querySelector('a[href="#nuevo"]').addEventListener('click', (event) => {
        event.preventDefault();
        filterProducts('nuevo');
        hidePaginationButtons();
    });

    function hidePaginationButtons() {
        const prevPageButton = document.getElementById('prevPage');
        const nextPageButton = document.getElementById('nextPage');
        if (prevPageButton) prevPageButton.style.display = 'none';
        if (nextPageButton) nextPageButton.style.display = 'none';
    }

    document.querySelectorAll('a[href]:not([href="#nuevo"])').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            showPaginationButtons();
        });
    });

    function showPaginationButtons() {
        const prevPageButton = document.getElementById('prevPage');
        const nextPageButton = document.getElementById('nextPage');
        if (prevPageButton) prevPageButton.style.display = 'block';
        if (nextPageButton) nextPageButton.style.display = 'block';
    }

    logoLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = "../../index.html";
    });

    homeLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = "../home.html";
    });
});
