function abrirPopup(popupId) {
    const overlay = document.getElementById(popupId);
    if (!overlay) return;
    overlay.classList.add('mostrar');
    // Prevent background from scrolling while popup is open
    document.body.style.overflow = 'hidden';
}

function cerrarPopup(popupId) {
    const overlay = document.getElementById(popupId);
    if (!overlay) return;
    overlay.classList.remove('mostrar');
    // Restore background scrolling
    document.body.style.overflow = '';
}

let cardSeleccionadaParaContratar = null;

function obtenerDatosEnfermeroDesdeCard(card) {
    if (!card) return null;
    return {
        nombre: card.querySelector('h2')?.textContent.trim() || '',
        especialidad: card.querySelector('.nurse-subtitulo')?.textContent.trim() || '',
        matricula: card.querySelectorAll('.nurse-meta')[0]?.textContent.trim() || '',
        precio: card.querySelector('.nurse-precio')?.textContent.trim() || '',
        avatar: card.querySelector('.nurse-avatar img')?.getAttribute('src') || '',
        studies: Array.from(card.querySelectorAll('.nurse-studies li')).map(li => li.textContent.trim()).filter(Boolean),
        habilidades: Array.from(card.querySelectorAll('.nurse-habilidades li')).map(li => li.textContent.trim()).filter(Boolean),
        manejo: Array.from(card.querySelectorAll('.nurse-manejo li')).map(li => li.textContent.trim()).filter(Boolean),
        disponibilidad: Array.from(card.querySelectorAll('.nurse-disponibilidad span.activo'))
            .map((span) => span.textContent.trim())
            .filter(Boolean),
    };
}

function poblarPopupConfirmar(enfermero) {
    if (!enfermero) return;
    const nombreEl = document.getElementById('confirmNombre');
    const especialidadEl = document.getElementById('confirmEspecialidad');
    const matriculaEl = document.getElementById('confirmMatricula');
    const precioEl = document.getElementById('confirmPrecio');
    const disponibilidadContainer = document.getElementById('confirmDisponibilidad');
    const avatarEl = document.getElementById('confirmAvatar');
    const habilidadesList = document.getElementById('confirmHabilidadesList');
    const manejoList = document.getElementById('confirmManejoList');
    const studiesList = document.getElementById('confirmStudiesList');
    if (nombreEl) nombreEl.textContent = enfermero.nombre;
    if (especialidadEl) especialidadEl.textContent = enfermero.especialidad;
    if (matriculaEl) matriculaEl.textContent = enfermero.matricula;
    if (precioEl) precioEl.textContent = enfermero.precio;
    if (avatarEl && enfermero.avatar) avatarEl.setAttribute('src', enfermero.avatar);
    if (studiesList) {
        studiesList.innerHTML = '';
        if (enfermero.studies && enfermero.studies.length) {
            enfermero.studies.forEach(s => {
                const li = document.createElement('li');
                li.textContent = s;
                studiesList.appendChild(li);
            });
        } else {
            const li = document.createElement('li'); li.textContent = 'No especificado'; studiesList.appendChild(li);
        }
    }
    if (habilidadesList) {
        habilidadesList.innerHTML = '';
        if (enfermero.habilidades && enfermero.habilidades.length) {
            enfermero.habilidades.forEach(h => {
                const li = document.createElement('li');
                li.textContent = h;
                habilidadesList.appendChild(li);
            });
        } else {
            const li = document.createElement('li'); li.textContent = 'No especificado'; habilidadesList.appendChild(li);
        }
    }
    if (manejoList) {
        manejoList.innerHTML = '';
        if (enfermero.manejo && enfermero.manejo.length) {
            enfermero.manejo.forEach(m => {
                const li = document.createElement('li');
                li.textContent = m;
                manejoList.appendChild(li);
            });
        } else {
            const li = document.createElement('li'); li.textContent = 'No especificado'; manejoList.appendChild(li);
        }
    }

    // Price: keep only numeric/amount part if present
    if (precioEl) {
        const raw = enfermero.precio || '';
        // attempt to extract currency and amount
        const match = raw.match(/\$\s?([0-9.,]+)/);
        if (match) precioEl.textContent = `$ ${match[1]}`;
        else precioEl.textContent = raw;
    }
    if (disponibilidadContainer) {
        disponibilidadContainer.innerHTML = '';
        enfermero.disponibilidad.forEach((dia) => {
            const span = document.createElement('span');
            span.className = 'confirm-badge';
            span.textContent = dia;
            disponibilidadContainer.appendChild(span);
        });
    }
}

function obtenerDiasDisponiblesDesdeCardElement(card) {
    if (!card) return [];
    return Array.from(card.querySelectorAll('.nurse-disponibilidad span.activo'))
        .map((span) => DIA_COMPLETO[span.textContent.trim()] || span.textContent.trim())
        .filter(Boolean);
}

function inicializarPopup(popupId, cerrarBtnId) {
    const overlay = document.getElementById(popupId);
    const cerrarBtn = document.getElementById(cerrarBtnId);

    if (!overlay || !cerrarBtn) return;

    cerrarBtn.addEventListener('click', () => {
        cerrarPopup(popupId);
    });

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            cerrarPopup(popupId);
        }
    });
}

const DIA_COMPLETO = {
    L: 'Lunes',
    M: 'Martes',
    Mi: 'Miércoles',
    J: 'Jueves',
    V: 'Viernes',
    S: 'Sábado',
    D: 'Domingo',
};

function obtenerDiasDisponiblesDesdeBoton(button) {
    const card = button.closest('.nurse-card');
    if (!card) return [];

    return Array.from(card.querySelectorAll('.nurse-disponibilidad span.activo'))
        .map((span) => DIA_COMPLETO[span.textContent.trim()] || span.textContent.trim())
        .filter(Boolean);
}

function obtenerHorariosSeleccionados() {
    return Array.from(document.querySelectorAll('#popupContratar .popup-horarios input:checked'))
        .map((input) => input.value);
}

function limpiarHorariosSeleccionados() {
    document.querySelectorAll('#popupContratar .popup-horarios input').forEach((input) => {
        input.checked = false;
    });
}

function actualizarResumen() {
    const select = document.getElementById('popupDia');
    const resumen = document.getElementById('popupResumen');
    const error = document.getElementById('popupError');
    if (!select || !resumen || !error) return;

    error.textContent = '';

    const dia = select.value;
    const horarios = obtenerHorariosSeleccionados();

    if (!dia) {
        resumen.textContent = 'No hay días disponibles.';
        return;
    }

    if (horarios.length === 0) {
        resumen.textContent = `Seleccionó: día ${dia}`;
        return;
    }

    resumen.textContent = `Seleccionó: día ${dia}, ${horarios.join(', ')}`;
}

function procederPago() {
    const error = document.getElementById('popupError');
    if (!error) return;

    const horarios = obtenerHorariosSeleccionados();
    if (horarios.length === 0) {
        error.textContent = 'Debe seleccionar el horario que desee';
        return;
    }

    error.textContent = '';
    const overlay = document.getElementById('popupContratar');
    if (overlay) overlay.classList.remove('mostrar');
    window.location.href = 'pagoExitoso.html';
}

function poblarDiasDisponibles(dias) {
    const select = document.getElementById('popupDia');
    const error = document.getElementById('popupError');
    if (!select) return;

    select.innerHTML = '';
    limpiarHorariosSeleccionados();
    if (error) error.textContent = '';

    if (dias.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Sin días disponibles';
        option.disabled = true;
        option.selected = true;
        select.appendChild(option);
        actualizarResumen();
        return;
    }

    dias.forEach((dia, index) => {
        const option = document.createElement('option');
        option.value = dia;
        option.textContent = dia;
        if (index === 0) option.selected = true;
        select.appendChild(option);
    });

    actualizarResumen();
}

function inicializarPopups() {
    document.querySelectorAll('[data-popup-target]').forEach((button) => {
        const popupId = button.dataset.popupTarget;
        button.addEventListener('click', () => {
            const card = button.closest('.nurse-card');
            cardSeleccionadaParaContratar = card;
            const enfermero = obtenerDatosEnfermeroDesdeCard(card);
            poblarPopupConfirmar(enfermero);
            abrirPopup('popupConfirmar');
        });
    });

    document.querySelectorAll('[data-popup-close]').forEach((button) => {
        const popupId = button.dataset.popupClose;
        button.addEventListener('click', () => {
            cerrarPopup(popupId);
        });
    });

    const select = document.getElementById('popupDia');
    if (select) {
        select.addEventListener('change', actualizarResumen);
    }

    document.querySelectorAll('#popupContratar .popup-horarios input').forEach((input) => {
        input.addEventListener('change', actualizarResumen);
    });

    const btnProceder = document.getElementById('btnProcederPago');
    if (btnProceder) {
        btnProceder.addEventListener('click', procederPago);
    }

    const btnConfirmarContratacion = document.getElementById('btnConfirmarContratacion');
    if (btnConfirmarContratacion) {
        btnConfirmarContratacion.addEventListener('click', () => {
            if (!cardSeleccionadaParaContratar) return;
            const dias = obtenerDiasDisponiblesDesdeCardElement(cardSeleccionadaParaContratar);
            poblarDiasDisponibles(dias);
            cerrarPopup('popupConfirmar');
            abrirPopup('popupContratar');
        });
    }
}

window.abrirPopup = abrirPopup;
window.cerrarPopup = cerrarPopup;
window.inicializarPopup = inicializarPopup;
window.inicializarPopups = inicializarPopups;

document.addEventListener('DOMContentLoaded', () => {
    inicializarPopups();
});
