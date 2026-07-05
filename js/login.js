// =========================================================
// Vista Login — validación de formulario
// =========================================================

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Asegurarse de que exista la lista de usuarios en localStorage.
inicializarUsuarios();

function mostrarError(idSpan, mensaje, input) {
    const span = document.getElementById(idSpan);
    span.textContent = mensaje;
    if (input) input.classList.toggle('input-error', Boolean(mensaje));
}

function validarFormularioLogin(email, password) {
    let esValido = true;

    if (!email) {
        mostrarError('error-email', 'Ingresá tu email.', document.getElementById('email'));
        esValido = false;
    } else if (!REGEX_EMAIL.test(email)) {
        mostrarError('error-email', 'El email no es válido.', document.getElementById('email'));
        esValido = false;
    } else {
        mostrarError('error-email', '', document.getElementById('email'));
    }

    if (!password) {
        mostrarError('error-password', 'Ingresá tu contraseña.', document.getElementById('password'));
        esValido = false;
    } else {
        mostrarError('error-password', '', document.getElementById('password'));
    }

    return esValido;
}

async function manejarLogin(event) {
    event.preventDefault();

    mostrarError('error-login', '');

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!validarFormularioLogin(email, password)) {
        return;
    }

    const btnIngresar = document.querySelector('.btn-ingresar');
    btnIngresar.disabled = true;

    try {
        const usuarioValido = validarLogin(email, password);
        if (!usuarioValido) {
            throw new Error('Credenciales inválidas');
        }

         // Guardamos el usuario logueado para que el resto del sitio sepa que hay sesión activa
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioValido));
        
        // Simulación breve para animar el botón y luego redirigir.
        await new Promise((resolve) => setTimeout(resolve, 600));

        window.location.href = '/vistas/home.html';
    } catch (error) {
        mostrarError('error-login', 'No pudimos iniciar sesión. Verificá tus datos e intentá de nuevo.');
    } finally {
        btnIngresar.disabled = false;
    }
}

document.getElementById('form-login').addEventListener('submit', manejarLogin);
