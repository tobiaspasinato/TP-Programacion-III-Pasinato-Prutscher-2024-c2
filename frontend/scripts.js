// Redirecciona a productos si se ingresa un nombre
document.getElementById('btnLogin').addEventListener('click', () => {
    if (document.getElementById('inputNombreUsuario').value !== '') {
        window.location.href = './Home/home.html'; // Redirige a la página de inicio
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
document.body.classList.add('dark');

// Agrega el ícono del sol al botón al cargar la página
const iconMoon = document.createElement('span');
iconMoon.classList.add('icon-moon');
iconMoon.innerHTML = '&#9728;'; // Ícono de sol
themeToggleBtn.appendChild(iconMoon);

//guarda el nombre en el localstorage
document.getElementById('btnLogin').addEventListener('click', () => {
    const nombreUsuario = document.getElementById('inputNombreUsuario').value;
    localStorage.setItem('nombreUsuario', nombreUsuario);
});