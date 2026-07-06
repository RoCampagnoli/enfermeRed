// =========================================================
// Vista Registro de Paciente - Validación de formulario
// =========================================================

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_TELEFONO = /^[0-9\s\-\+\(\)]+$/;

// Lista de archivos cargados
let archivosSeleccionados = [];

function mostrarError(idSpan, mensaje, input) {
    const span = document.getElementById(idSpan);
    span.textContent = mensaje;
    if (input) input.classList.toggle('input-error', Boolean(mensaje));
}

function validarFormularioRegistro() {
    let esValido = true;

    // Validar Nombres
    const nombres = document.getElementById('nombres').value.trim();
    if (!nombres) {
        mostrarError('error-nombres', 'Ingresá tu nombre.', document.getElementById('nombres'));
        esValido = false;
    } else {
        mostrarError('error-nombres', '', document.getElementById('nombres'));
    }

    // Validar Apellido
    const apellido = document.getElementById('apellido').value.trim();
    if (!apellido) {
        mostrarError('error-apellido', 'Ingresá tu apellido.', document.getElementById('apellido'));
        esValido = false;
    } else {
        mostrarError('error-apellido', '', document.getElementById('apellido'));
    }

    // Validar Mail
    const mail = document.getElementById('mail').value.trim();
    if (!mail) {
        mostrarError('error-mail', 'Ingresá tu email.', document.getElementById('mail'));
        esValido = false;
    } else if (!REGEX_EMAIL.test(mail)) {
        mostrarError('error-mail', 'El email no es válido.', document.getElementById('mail'));
        esValido = false;
    } else {
        mostrarError('error-mail', '', document.getElementById('mail'));
    }

    // Validar Dirección
    const direccion = document.getElementById('direccion').value.trim();
    if (!direccion) {
        mostrarError('error-direccion', 'Ingresá tu dirección.', document.getElementById('direccion'));
        esValido = false;
    } else {
        mostrarError('error-direccion', '', document.getElementById('direccion'));
    }

    // Validar Teléfono
    const telefono = document.getElementById('telefono').value.trim();
    if (!telefono) {
        mostrarError('error-telefono', 'Ingresá tu teléfono.', document.getElementById('telefono'));
        esValido = false;
    } else if (!REGEX_TELEFONO.test(telefono)) {
        mostrarError('error-telefono', 'El teléfono no es válido.', document.getElementById('telefono'));
        esValido = false;
    } else {
        mostrarError('error-telefono', '', document.getElementById('telefono'));
    }

    // Validar Descripción de necesidades
    const necesidades = document.getElementById('necesidades').value.trim();
    if (!necesidades) {
        mostrarError('error-necesidades', 'Ingresá una breve descripción de tus necesidades.', document.getElementById('necesidades'));
        esValido = false;
    } else {
        mostrarError('error-necesidades', '', document.getElementById('necesidades'));
    }

    return esValido;
}

function getIconoArchivo(nombreArchivo) {
    const extension = nombreArchivo.split('.').pop().toLowerCase();
    if (extension === 'pdf') {
        return '<i class="fas fa-file-pdf"></i>';
    } else if (['png', 'jpg', 'jpeg'].includes(extension)) {
        return '<i class="fas fa-file-image"></i>';
    }
    return '<i class="fas fa-file"></i>';
}

function actualizarListaArchivos() {
    const lista = document.getElementById('listaArchivos');
    lista.innerHTML = '';

    if (archivosSeleccionados.length === 0) {
        return;
    }

    archivosSeleccionados.forEach((archivo, index) => {
        const archivoEl = document.createElement('div');
        archivoEl.className = 'archivo-item';
        archivoEl.innerHTML = `
            ${getIconoArchivo(archivo.name)}
            <span class="nombre-archivo">${archivo.name}</span>
            <button type="button" class="btn-eliminar-archivo" data-index="${index}">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Agregar evento al botón de eliminar
        archivoEl.querySelector('.btn-eliminar-archivo').addEventListener('click', (e) => {
            e.preventDefault();
            archivosSeleccionados.splice(index, 1);
            actualizarListaArchivos();
        });

        lista.appendChild(archivoEl);
    });
}

function manejarCargaArchivos(event) {
    const archivos = Array.from(event.target.files);

    // Validar que no excedan 5 archivos en total
    if (archivosSeleccionados.length + archivos.length > 5) {
        mostrarError('error-archivos', 'No puedes cargar más de 5 archivos.', null);
        return;
    }

    // Validar tipo de archivo
    const tiposValidos = ['application/pdf', 'image/png', 'image/jpeg'];
    for (let archivo of archivos) {
        if (!tiposValidos.includes(archivo.type) && !archivo.name.toLowerCase().endsWith('.pdf')) {
            mostrarError('error-archivos', `El archivo "${archivo.name}" no es válido. Solo se permiten PDF, PNG y JPG.`, null);
            return;
        }
    }

    // Validar tamaño de archivo (máximo 5MB por archivo)
    for (let archivo of archivos) {
        if (archivo.size > 5 * 1024 * 1024) {
            mostrarError('error-archivos', `El archivo "${archivo.name}" es demasiado grande (máximo 5MB).`, null);
            return;
        }
    }

    archivosSeleccionados.push(...archivos);
    mostrarError('error-archivos', '', null);
    actualizarListaArchivos();

    // Limpiar el input de archivo
    event.target.value = '';
}

async function manejarRegistro(event) {
    event.preventDefault();

    if (!validarFormularioRegistro()) {
        return;
    }

    const btnEnviar = document.querySelector('.btn-enviar');
    btnEnviar.disabled = true;

    try {
        // Aquí iría la lógica para enviar los datos del paciente al servidor
        // Por ahora, simulamos que se registró correctamente

        const nuevoUsuario = {
            nombre: document.getElementById('nombres').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            email: document.getElementById('mail').value.trim(),
            direccion: document.getElementById('direccion').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            necesidades: document.getElementById('necesidades').value.trim(),
            tipo: 'paciente',
            archivos: archivosSeleccionados.length
        };

        // Guardar usuario (simulado)
        const resultado = registrarUsuario({
            ...nuevoUsuario,
            password: 'temporal123' // Contraseña temporal (esto debería venir del usuario)
        });

        if (!resultado.exito) {
            throw new Error(resultado.mensaje);
        }

        // Simulación breve para animar el botón
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Iniciar sesión automáticamente
        localStorage.setItem('usuarioLogueado', JSON.stringify({
            email: nuevoUsuario.email,
            nombre: nuevoUsuario.nombre,
            tipo: 'paciente'
        }));

        // Mostrar popup de éxito
        mostrarPopupExito();

    } catch (error) {
        console.error('Error en registro:', error);
        mostrarError('error-archivos', 'Hubo un error al registrar. Intenta nuevamente.');
    } finally {
        btnEnviar.disabled = false;
    }
}

function mostrarPopupExito() {
    const popup = document.getElementById('popupRegistroExitoso');
    if (popup) {
        popup.classList.add('mostrar');
        document.body.style.overflow = 'hidden';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formRegistro = document.getElementById('form-registro-paciente');
    const inputArchivos = document.getElementById('input-archivos');

    if (formRegistro) {
        formRegistro.addEventListener('submit', manejarRegistro);
    }

    if (inputArchivos) {
        inputArchivos.addEventListener('change', manejarCargaArchivos);
    }
});
