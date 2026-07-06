function abrirPopup(popupId) {
    const overlay = document.getElementById(popupId);
    if (!overlay) return;
    overlay.classList.add('mostrar');
}

function cerrarPopup(popupId) {
    const overlay = document.getElementById(popupId);
    if (!overlay) return;
    overlay.classList.remove('mostrar');
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
    window.location.href = '/vistas/pagoExitoso.html';
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
            const dias = obtenerDiasDisponiblesDesdeBoton(button);
            poblarDiasDisponibles(dias);
            abrirPopup(popupId);
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
}

window.abrirPopup = abrirPopup;
window.cerrarPopup = cerrarPopup;
window.inicializarPopup = inicializarPopup;
window.inicializarPopups = inicializarPopups;

document.addEventListener('DOMContentLoaded', () => {
    inicializarPopups();
});
