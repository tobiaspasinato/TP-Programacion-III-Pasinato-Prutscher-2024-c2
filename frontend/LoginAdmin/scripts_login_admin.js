document.getElementById('btnBack').addEventListener('click', () => {
    window.location.href = '../index.html'; // Redirige a la página de inicio
});

document.getElementById('loginForm').addEventListener('submit', (event) => {
    const username = document.getElementById('inputNombreUsuarioAdmin').value;
    const password = document.getElementById('inputContraAdmin').value;

    if (username === 'admin' && password === '123') {
        window.location.href= '../Home/Admin/home_admin.html'; // Redirige al home del admin
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: 'Usuario o contraseña incorrectos'
        }); //alert mas lindo? dudoso pero bueno despues lo cambio por otro mejor
        event.preventDefault(); // Evita que el formulario se envíe
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