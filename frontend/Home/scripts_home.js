document.addEventListener("DOMContentLoaded", () => {
  // El código que se ejecutará cuando el DOM esté completamente cargado

  const expand_btn = document.querySelector(".expand-btn");

  expand_btn.addEventListener("click", () => {
    document.body.classList.toggle("collapsed");
  });

  const allLinks = document.querySelectorAll(".sidebar-links a");

  allLinks.forEach((elem) => {
    elem.addEventListener('click', function () {
      const hrefLinkClick = elem.href;
      allLinks.forEach((link) => {
        if (link.href == hrefLinkClick) {
          link.classList.add("active");
        } else {
          link.classList.remove('active');
        }
      });
    });
  });

  const themeToggleBtn = document.getElementById("themeToggleBtn");
  themeToggleBtn.addEventListener("click", () => {
    if (document.body.classList.contains("dark")) {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    }
  });

  // Productos
  const products = [
    {
      name: 'Playstation 1',
      price: '$100',
      img: 'https://upload.wikimedia.org/wikipedia/commons/9/95/PSX-Console-wController.png'
    },
    {
      name: 'Playstation 2',
      price: '$150',
      img: 'https://w7.pngwing.com/pngs/98/809/png-transparent-playstation-2-playstation-3-super-nintendo-entertainment-system-video-game-consoles-playstation-2-game-electronics-gadget-thumbnail.png'
    },
    {
      name: 'Playstation 3',
      price: '$200',
      img: 'https://e7.pngegg.com/pngimages/948/199/png-clipart-playstation-3-playstation-2-playstation-4-video-game-consoles-sony-playstation-game-electronics.png'
    }
  ];

  // Carga de los productos
  const productList = document.getElementById('product-list');
  
  // Verifica si el contenedor existe
  if (productList) {
    products.forEach(product => {
      const productCard = `
        <div class="col-md-4">
          <div class="product-card">
            <img src="${product.img}" alt="${product.name}">
            <h5>${product.name}</h5>
            <p>${product.price}</p>
            <button class="btn btn-danger">-</button>
            <span>1</span>
            <button class="btn btn-success">+</button>
          </div>
        </div>
      `;
      productList.innerHTML += productCard;
    });
  } else {
    console.error("Contenedor de productos no encontrado");
  }
});
