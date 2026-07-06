async function cargarComponentes() {
        // Carga el header
    const resHeader = await fetch('../vistas/fragmentos/header.html');
    document.getElementById('header-component').innerHTML = await resHeader.text();

        // Carga el footer
    const resFooter = await fetch('../vistas/fragmentos/footer.html');
    document.getElementById('footer-component').innerHTML = await resFooter.text();
    
    lucide.createIcons();
    inicializarSesion();

}

function inicializarSesion() {
    const btnSesion = document.getElementById('btnSesion');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const btnLogout = document.getElementById('btnLogout');
    const linkMiPerfil = document.getElementById('linkMiPerfil');
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (!btnSesion) return;

    if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado); // 👈 esto faltaba

        btnSesion.textContent = 'Mi perfil';

        btnSesion.onclick = (e) => {
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
        btnSesion.textContent = 'Iniciar sesión';
        btnSesion.onclick = () => {
            window.location.href = 'iniciarSesion.html';
        };
    }

    document.addEventListener('click', () => {
        if (dropdownMenu) dropdownMenu.classList.remove('mostrar');
    });
}

cargarComponentes();
