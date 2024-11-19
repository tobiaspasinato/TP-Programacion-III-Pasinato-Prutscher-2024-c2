document.addEventListener("DOMContentLoaded", () => {
	const expandBtn = document.querySelector(".expand-btn");
	const allLinks = document.querySelectorAll(".sidebar-links a");
	const pagarContainer = document.getElementById("pagar-container");
	const themeToggleBtn = document.getElementById("themeToggleBtn");
	const productList = document.getElementById('product-list');
	const prevPageBtn = document.getElementById('prevPage');
	const nextPageBtn = document.getElementById('nextPage');
	const pagarBtn = document.getElementById("pagarBtn");

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
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		const productsToShow = filteredProducts.slice(start, end);

		if (productsToShow.length === 0) {
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
});
