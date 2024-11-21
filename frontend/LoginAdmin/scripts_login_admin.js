document.getElementById('btnBack').addEventListener('click', () => {
    window.location.href = '../index.html'; // Redirige a la página de inicio
});

document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Evita que el formulario se envíe

    const username = document.getElementById('inputNombreUsuarioAdmin').value;
    const password = document.getElementById('inputContraAdmin').value;

    if (username === 'admin' && password === '123') {
        window.location.href = '../Home/Admin/home_admin.html'; // Redirige al home del admin
    } else {
        Swal.fire({
            icon: 'error',
            title: '<h4 style="color: #ff4040; font-family: Sixtyfour Convergence, sans-serif;">Error de autenticación</h4>',
            html: `
                <p style="color: #fff; font-family: Sixtyfour Convergence, sans-serif;">Usuario o contraseña incorrectos</p>
                <img src="https://media.tenor.com/8TsyGKoXGVIAAAAM/spongebob-squarepants-spongebob.gif" alt="nyan cat" style="width:100%; max-width:200px; margin-top: 10px;" />
            `,
            background: '#2b2b2b', 
            confirmButtonColor: '#d33',
            confirmButtonText: '<span style="color: #fff; font-family: Sixtyfour Convergence, sans-serif;">OK</span>',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            customClass: {
                popup: 'swal2-popup-retro',
                icon: 'swal2-icon-retro',
                confirmButton: 'swal2-confirm-retro'
            },
            height: '100%'
        });
        /*Swal.fire({
            icon: "error",
            title: "Error de autenticación",
            text: "Usuario o contraseña incorrectos",
        });*/
    }
});

// Alterna entre tema claro y oscuro
const themeToggleBtn = document.getElementById('themeToggleBtn');
themeToggleBtn.addEventListener('click', () => {
    const body = document.body;

    if (body.classList.contains('light')) {
        body.classList.remove('light');
        body.classList.add('dark');
    } else {
        body.classList.remove('dark');
        body.classList.add('light');
    }

    themeToggleBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggleBtn.style.transform = '';
    }, 300);
});

// Aplicar tema oscuro por defecto
document.body.classList.add('dark');

// Agrega el ícono del sol al botón al cargar la página
const iconMoon = document.createElement('span');
iconMoon.classList.add('icon-moon');
iconMoon.innerHTML = '&#9728;';
themeToggleBtn.appendChild(iconMoon);
