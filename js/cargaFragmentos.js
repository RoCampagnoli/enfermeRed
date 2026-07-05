async function cargarComponentes() {
        // Carga el header
    const resHeader = await fetch('/vistas/fragmentos/header.html');
    document.getElementById('header-component').innerHTML = await resHeader.text();

        // Carga el footer
    const resFooter = await fetch('/vistas/fragmentos/footer.html');
    document.getElementById('footer-component').innerHTML = await resFooter.text();
    
    lucide.createIcons();
    inicializarSesion();

}

function inicializarSesion() {
    const btnSesion = document.getElementById('btnSesion');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const btnLogout = document.getElementById('btnLogout');
    const usuario = localStorage.getItem('usuarioLogueado');

    if (!btnSesion) return; // por seguridad, si algo falla no rompe el resto

    if (usuario) {
        btnSesion.textContent = 'Mi perfil';

        // Al hacer clic en el botón, se abre/cierra el menú
        btnSesion.onclick = (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('mostrar');
        };

        btnLogout.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('usuarioLogueado');
            window.location.href = '/vistas/home.html';
        };

    } else {
        // Si no hay sesión, el botón va directo a login (sin dropdown)
        btnSesion.textContent = 'Iniciar sesión';
        btnSesion.onclick = () => {
            window.location.href = '/vistas/iniciarSesion.html';
        };
    }
    // Cerrar el menú si se hace clic afuera
    document.addEventListener('click', () => {
        dropdownMenu.classList.remove('mostrar');
    });
}

cargarComponentes();
