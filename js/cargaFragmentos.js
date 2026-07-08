async function cargarComponentes() {
        // Carga el header
    const resHeader = await fetch('../vistas/fragmentos/header.html');
    document.getElementById('header-component').innerHTML = await resHeader.text();

    const navToggle = document.getElementById('navToggle');
    const menuDropdown = document.getElementById('menuDropdown');

    function toggleMenu() {
        if (!menuDropdown) return;
        const abierto = menuDropdown.classList.toggle('mostrar');
        navToggle?.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    }

    function cerrarMenu() {
        if (!menuDropdown) return;
        menuDropdown.classList.remove('mostrar');
        navToggle?.setAttribute('aria-expanded', 'false');
    }

    navToggle?.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleMenu();
    });

    // cerrar si se clickea afuera del menú
    document.addEventListener('click', (event) => {
        if (menuDropdown && !menuDropdown.contains(event.target) && event.target !== navToggle) {
            cerrarMenu();
        }
    });

    // cerrar al clickear un link del menú
    menuDropdown?.querySelectorAll('.lista_links a').forEach((link) => {
        link.addEventListener('click', cerrarMenu);
    });

        // Carga el footer
    const resFooter = await fetch('../vistas/fragmentos/footer.html');
    document.getElementById('footer-component').innerHTML = await resFooter.text();
    
    lucide.createIcons();
    inicializarSesion();

}

function inicializarSesion() {
    const btnSesion = document.getElementById('btnSesion'); // Botón clásico
    const contenedorPerfil = document.getElementById('contenedorPerfil'); // Contenedor del ícono + menú
    const btnIconoPerfil = document.getElementById('btnIconoPerfil'); // El ícono en sí
    const dropdownMenu = document.getElementById('dropdownMenu');
    const btnLogout = document.getElementById('btnLogout');
    const linkMiPerfil = document.getElementById('linkMiPerfil');
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (!btnSesion || !contenedorPerfil) return;

    if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);

        // ESTADO: LOGUEADO -> Ocultamos botón, mostramos ícono avatar
        btnSesion.style.display = 'none';
        contenedorPerfil.style.display = 'inline-block';

        // Comportamiento del ícono para desplegar menú
        btnIconoPerfil.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdownMenu.classList.toggle('mostrar');
        };

        linkMiPerfil.onclick = (e) => {
            e.preventDefault();
            if (usuario.tipo === 'enfermero') {
                window.location.href = 'miPerfilEnferm.html';
            } else {
                window.location.href = 'miPerfilPaciente.html';
            }
        };

        btnLogout.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('usuarioLogueado');
            window.location.href = 'home.html';
        };

    } else {
        // ESTADO: SIN LOGUEAR -> Mostramos botón llamativo, ocultamos ícono avatar
        btnSesion.style.display = 'inline-flex';
        contenedorPerfil.style.display = 'none';

        btnSesion.onclick = () => {
            window.location.href = 'iniciarSesion.html';
        };
    }

    // Cerrar el menú desplegable del avatar si se hace click afuera
    document.addEventListener('click', () => {
        if (dropdownMenu) dropdownMenu.classList.remove('mostrar');
    });
}

cargarComponentes();