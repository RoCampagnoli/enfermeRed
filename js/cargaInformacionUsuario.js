document.addEventListener("DOMContentLoaded", () => {

    inicializarUsuarios();

    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

    if (!usuarioLogueado) {
        window.location.href = "login.html";
        return;
    }

    const paciente = buscarUsuarioPorId(usuarioLogueado.id) || usuarioLogueado;

    renderizarDatosPaciente(paciente);
    renderizarEnfermerosAsociados(paciente.enfermerosAsociados || []);
renderizarAntecedentes(paciente.antecedentes || []);



    inicializarPopup('popupWhatsapp', 'btnCerrarWhatsapp');

    // ---------- Modal de edición ----------
    const modalEditar = document.getElementById("popupEditarDatos");
    const popupExito = document.getElementById("popupEdicionExitosa");
    const btnEditar = document.getElementById("btnEditarDatos");
    const btnCerrarEditar = document.getElementById("btnCerrarEditar");
    const btnCerrarExito = document.getElementById("btnCerrarPopupExito");
    const formEditar = document.getElementById("formEditarDatos");

    function abrirModalEditar() {
        const usuarioActual = buscarUsuarioPorId(usuarioLogueado.id);

        formEditar.nombre.value = usuarioActual.nombre || "";
        formEditar.apellido.value = usuarioActual.apellido || "";
        formEditar.dni.value = usuarioActual.dni || "";
        formEditar.edad.value = usuarioActual.edad || "";
        formEditar.sexo.value = usuarioActual.sexo || "";
        formEditar.direccion.value = usuarioActual.direccion || "";
        formEditar.telefono.value = usuarioActual.telefono || "";
        formEditar.email.value = usuarioActual.email || "";
        formEditar.celular.value = usuarioActual.celular || "";

        modalEditar.classList.add("mostrar");
    }

    function cerrarModalEditar() {
        modalEditar.classList.remove("mostrar");
    }

    btnEditar.addEventListener("click", abrirModalEditar);
    btnCerrarEditar.addEventListener("click", cerrarModalEditar);

    modalEditar.addEventListener("click", (event) => {
        if (event.target === modalEditar) cerrarModalEditar();
    });

    formEditar.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(formEditar);

        const datosNuevos = {
            nombre: formData.get("nombre"),
            apellido: formData.get("apellido"),
            dni: formData.get("dni"),
            edad: formData.get("edad"),
            sexo: formData.get("sexo"),
            direccion: formData.get("direccion"),
            telefono: formData.get("telefono"),
            email: formData.get("email"),
            celular: formData.get("celular"),
        };

        const resultado = actualizarUsuario(usuarioLogueado.id, datosNuevos);

        if (resultado.exito) {
            localStorage.setItem("usuarioLogueado", JSON.stringify(resultado.usuario));
            renderizarDatosPaciente(resultado.usuario);
            cerrarModalEditar();
            popupExito.classList.add("mostrar");
        }
    });

    btnCerrarExito.addEventListener("click", () => {
        popupExito.classList.remove("mostrar");
    });

    // ---------- Modal de edición de salud ----------
    const modalEditarSalud = document.getElementById("popupEditarSalud");
    const btnEditarSalud = document.getElementById("btnEditarSalud");
    const btnCerrarEditarSalud = document.getElementById("btnCerrarEditarSalud");
    const formEditarSalud = document.getElementById("formEditarSalud");

    function abrirModalEditarSalud() {
        const usuarioActual = buscarUsuarioPorId(usuarioLogueado.id);

        formEditarSalud.tipoSangre.value = usuarioActual.tipoSangre || "";
        formEditarSalud.alergias.value = usuarioActual.alergias || "";
        formEditarSalud.diagnostico.value = usuarioActual.diagnostico || "";

        modalEditarSalud.classList.add("mostrar");
    }

    function cerrarModalEditarSalud() {
        modalEditarSalud.classList.remove("mostrar");
    }

    btnEditarSalud.addEventListener("click", abrirModalEditarSalud);
    btnCerrarEditarSalud.addEventListener("click", cerrarModalEditarSalud);

    modalEditarSalud.addEventListener("click", (event) => {
        if (event.target === modalEditarSalud) cerrarModalEditarSalud();
    });

    formEditarSalud.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(formEditarSalud);

        const datosNuevos = {
            tipoSangre: formData.get("tipoSangre"),
            alergias: formData.get("alergias"),
            diagnostico: formData.get("diagnostico")
        };

        const resultado = actualizarUsuario(usuarioLogueado.id, datosNuevos);

        if (resultado.exito) {
            localStorage.setItem("usuarioLogueado", JSON.stringify(resultado.usuario));
            renderizarDatosPaciente(resultado.usuario);
            cerrarModalEditarSalud();
            popupExito.classList.add("mostrar");
        }
    });


    // ---------- Modal de edición de antecedentes ----------
const modalEditarAntecedente = document.getElementById("popupEditarAntecedente");
const btnCerrarEditarAntecedente = document.getElementById("btnCerrarEditarAntecedente");
const formEditarAntecedente = document.getElementById("formEditarAntecedente");

function abrirModalEditarAntecedente(idAntecedente) {
    const usuarioActual = buscarUsuarioPorId(usuarioLogueado.id);
    const antecedente = (usuarioActual.antecedentes || []).find(a => a.id === idAntecedente);
    if (!antecedente) return;

    formEditarAntecedente.id.value = antecedente.id;
    formEditarAntecedente.enfermedad.value = antecedente.enfermedad === "Antecedente sin nombre (completar)" ? "" : antecedente.enfermedad;
    formEditarAntecedente.fecha.value = antecedente.fecha || "";
    formEditarAntecedente.tratamiento.value = antecedente.tratamiento || "";

    modalEditarAntecedente.classList.add("mostrar");
}

function cerrarModalEditarAntecedente() {
    modalEditarAntecedente.classList.remove("mostrar");
}

btnCerrarEditarAntecedente.addEventListener("click", cerrarModalEditarAntecedente);

modalEditarAntecedente.addEventListener("click", (event) => {
    if (event.target === modalEditarAntecedente) cerrarModalEditarAntecedente();
});

formEditarAntecedente.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(formEditarAntecedente);
    const idAntecedente = formData.get("id");

    const usuarioActual = buscarUsuarioPorId(usuarioLogueado.id);
    const antecedentesActualizados = (usuarioActual.antecedentes || []).map(antecedente => {
        if (antecedente.id !== idAntecedente) return antecedente;
        return {
            ...antecedente,
            enfermedad: formData.get("enfermedad"),
            fecha: formData.get("fecha"),
            tratamiento: formData.get("tratamiento")
        };
    });

    const resultado = actualizarUsuario(usuarioLogueado.id, { antecedentes: antecedentesActualizados });

    if (resultado.exito) {
        localStorage.setItem("usuarioLogueado", JSON.stringify(resultado.usuario));
        renderizarAntecedentes(resultado.usuario.antecedentes);
        cerrarModalEditarAntecedente();
        popupExito.classList.add("mostrar");
    }
});

function borrarAntecedente(idAntecedente) {
    const usuarioActual = buscarUsuarioPorId(usuarioLogueado.id);
    const antecedentesActualizados = (usuarioActual.antecedentes || []).filter(a => a.id !== idAntecedente);

    const resultado = actualizarUsuario(usuarioLogueado.id, { antecedentes: antecedentesActualizados });

    if (resultado.exito) {
        localStorage.setItem("usuarioLogueado", JSON.stringify(resultado.usuario));
        renderizarAntecedentes(resultado.usuario.antecedentes);
    }
}

// Delegación de eventos: como las cards se generan dinámicamente,
// escuchamos los clics en el contenedor padre en vez de en cada botón.
document.getElementById("listaAntecedentes").addEventListener("click", (event) => {
    const btnEditar = event.target.closest(".btn-editar-antecedente");
    if (btnEditar) {
        abrirModalEditarAntecedente(btnEditar.dataset.id);
        return;
    }

    const btnBorrar = event.target.closest(".btn-borrar-antecedente");
    if (btnBorrar) {
        if (confirm("¿Seguro que querés borrar este antecedente médico?")) {
            borrarAntecedente(btnBorrar.dataset.id);
        }
    }
});

}); // <-- acá cierra el DOMContentLoaded, después de todo lo anterior





function huboErrorDeExtraccion(antecedente) {
    // Si la enfermedad quedó con el texto de fallback, o si TODOS los campos
    // relevantes vinieron vacíos, consideramos que la lectura del PDF falló.
    const sinNombre = antecedente.enfermedad === "Antecedente sin nombre (completar)" || !antecedente.enfermedad;
    const sinFecha = !antecedente.fecha;
    const sinTratamiento = !antecedente.tratamiento;

    return sinNombre && sinFecha && sinTratamiento;
}

function renderizarAntecedentes(antecedentes) {
    const contenedor = document.getElementById("listaAntecedentes");
    if (!contenedor) return;

    if (!antecedentes || antecedentes.length === 0) {
        contenedor.innerHTML = `
            <div class="sin-datos-vacio">
                <i data-lucide="file-text"></i>
                <p>Todavía no cargaste antecedentes médicos.</p>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        return;
    }

    contenedor.innerHTML = antecedentes.map(antecedente => {
        if (huboErrorDeExtraccion(antecedente)) {
            return `
                <div class="card-info-divs card-antecedente-error" data-id="${antecedente.id}">
                    <div>
                        <h3><i data-lucide="alert-triangle"></i> No se pudo cargar la información del PDF subido</h3>
                        <p>Archivo: ${antecedente.archivoNombre || "sin nombre"}</p>
                        <p>Por favor, editá los datos manualmente.</p>
                    </div>
                    <div class="acciones-enfermero">
                        <button class="btn-editar-antecedente" data-id="${antecedente.id}" aria-label="Editar antecedente"><i data-lucide="pencil"></i></button>
                        <button class="btn-borrar-antecedente" data-id="${antecedente.id}" aria-label="Borrar antecedente"><i data-lucide="trash-2"></i></button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="card-info-divs" data-id="${antecedente.id}">
                <div>
                    <h3>${antecedente.enfermedad}</h3>
                    <p>Fecha de diagnóstico: ${antecedente.fecha || "-"}</p>
                    <p>Tratamiento: ${antecedente.tratamiento || "-"}</p>
                </div>
                <div class="acciones-enfermero">
                    <button class="btn-editar-antecedente" data-id="${antecedente.id}" aria-label="Editar antecedente"><i data-lucide="pencil"></i></button>
                    <button class="btn-borrar-antecedente" data-id="${antecedente.id}" aria-label="Borrar antecedente"><i data-lucide="trash-2"></i></button>
                </div>
            </div>
        `;
    }).join('');

    if (window.lucide) lucide.createIcons();
}


function renderizarEnfermerosAsociados(enfermeros) {
    const contenedor = document.getElementById("enfermerosAsociadosContenido");
    if (!contenedor) return;

    if (!enfermeros || enfermeros.length === 0) {
        contenedor.innerHTML = `
            <div class="sin-datos-vacio">
                <i data-lucide="heart-crack"></i>
                <p>No tienes enfermeros asociados aún.</p>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        return;
    }

    contenedor.innerHTML = enfermeros.map(enfermero => `
        <div class="card-info-divs">
            <div class="enfermero-header">
                <img src="${enfermero.avatar || '../imagenes/avatar_camila.png'}" alt="Foto de ${enfermero.nombre}" class="foto-enfermero">
                <div>
                    <h3>${enfermero.nombre}</h3>
                    <p>${enfermero.especialidad || '-'}</p>
                    <p>${enfermero.matricula || '-'}</p>
                </div>
            </div>
            <div class="acciones-enfermero">
                <button aria-label="Llamar"><i data-lucide="phone"></i></button>
                <button class="btn-enviar-mensaje-enfermero" aria-label="Enviar mensaje"><i data-lucide="message-circle"></i></button>
            </div>
        </div>
    `).join('');

    if (window.lucide) lucide.createIcons();

    document.querySelectorAll('.btn-enviar-mensaje-enfermero').forEach((btn) => {
        btn.addEventListener('click', () => abrirPopup('popupWhatsapp'));
    });
}

function renderizarDatosPaciente(paciente) {

    document.getElementById("dato-nombre-saludo").textContent = paciente.nombre || "";

    document.getElementById("dato-nombre").textContent = paciente.nombre || "-";
    document.getElementById("dato-apellido").textContent = paciente.apellido || "-";
    document.getElementById("dato-dni").textContent = paciente.dni || "-";
    document.getElementById("dato-edad").textContent = paciente.edad || "-";
    document.getElementById("dato-sexo").textContent = paciente.sexo || "-";

    document.getElementById("dato-direccion").textContent = paciente.direccion || "-";
    document.getElementById("dato-telefono").textContent = paciente.telefono || "-";
    document.getElementById("dato-correo").textContent = paciente.email || "-";
    document.getElementById("dato-celular").textContent = paciente.celular || "-";

    document.getElementById("dato-tipo-sangre").textContent = paciente.tipoSangre || "-";
    document.getElementById("dato-alergias").textContent = paciente.alergias || "-";
    document.getElementById("dato-diagnostico").textContent = paciente.diagnostico || "-";

}