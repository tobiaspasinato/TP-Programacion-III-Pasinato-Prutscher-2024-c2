// Redirecciona a productos si se ingresa un nombre
document.getElementById('btnLogin').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    if (username.trim()) {
        alert(`Bienvenido, ${username}!`);
        window.location.href = 'productos.html'; // Redirige a la página de productos
    } else {
        alert('Por favor, ingrese un nombre para continuar.');
    }
});

// Alterna entre tema claro y oscuro
const themeToggleBtn = document.getElementById('themeToggleBtn');
themeToggleBtn.addEventListener('click', () => {
    const body = document.body;

    // Alterna entre las clases 'light' y 'dark'
    if (body.classList.contains('light')) {
        body.classList.remove('light');
        body.classList.add('dark');
    } else {
        body.classList.remove('dark');
        body.classList.add('light');
    }

    // Animación del botón
    themeToggleBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggleBtn.style.transform = '';
    }, 300);
});

// Al cargar la página, aplicamos el tema oscuro por defecto
document.body.classList.add('light');

// Agrega el ícono del sol al botón al cargar la página
const iconMoon = document.createElement('span');
iconMoon.classList.add('icon-moon');
iconMoon.innerHTML = '&#9728;'; // Ícono de sol
themeToggleBtn.appendChild(iconMoon);
