document.addEventListener('DOMContentLoaded', () => {
    const btnBuscarEnfermero = document.getElementById('btnBuscarEnfermero');
    const btnSoyEnfermero = document.getElementById('btnSoyEnfermero');

    // "Busco Enfermero" siempre lleva a la lista de enfermeros
    btnBuscarEnfermero.onclick = () => {
        window.location.href = '../vistas/nuestrosEnf.html';
    };

    // "Soy Enfermero" depende de si hay sesión iniciada
    btnSoyEnfermero.onclick = () => {
        const usuarioGuardado = localStorage.getItem('usuarioLogueado');

        if (usuarioGuardado) {
            const usuario = JSON.parse(usuarioGuardado);

            if (usuario.tipo === 'enfermero') {
                // Ya está logueado como enfermero -> va a su perfil
                window.location.href = '../vistas/miPerfilEnferm.html';
            } else {
                // Está logueado pero como paciente -> no tiene perfil de enfermero
                alert('Tu cuenta está registrada como paciente. Iniciá sesión con una cuenta de enfermero.');
                window.location.href = '../vistas/iniciarSesion.html';
            }
        } else {
            // No hay sesión -> va a iniciar sesión
            window.location.href = '../vistas/iniciarSesion.html';
        }
    };

const formContacto = document.getElementById('formContacto');
    const popupOverlay = document.getElementById('popupOverlay');
    const btnCerrarPopup = document.getElementById('btnCerrarPopup');

    formContacto.addEventListener('submit', (e) => {
        e.preventDefault(); // evita que la página se recargue

        const nombre = document.getElementById('inputNombre').value.trim();
        const apellido = document.getElementById('inputApellido').value.trim();
        const correo = document.getElementById('inputCorreo').value.trim();
        const telefono = document.getElementById('inputTelefono').value.trim();
        const mensaje = document.getElementById('inputMensaje').value.trim();

        if (!nombre || !apellido || !correo || !telefono || !mensaje) {
            alert('Por favor completá todos los campos antes de enviar.');
            return;
        }

        // Simulación de envío exitoso (no se manda nada realmente)
        popupOverlay.classList.add('mostrar');

        formContacto.reset();
    });

    btnCerrarPopup.onclick = () => {
        popupOverlay.classList.remove('mostrar');
    };
});

