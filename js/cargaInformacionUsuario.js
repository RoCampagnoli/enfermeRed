document.addEventListener("DOMContentLoaded", () => {

    inicializarUsuarios();

    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

    if (!usuarioLogueado) {
        window.location.href = "login.html";
        return;
    }

    const paciente = buscarUsuarioPorId(usuarioLogueado.id) || usuarioLogueado;

    renderizarDatosPaciente(paciente);

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
        formEditar.tipoSangre.value = usuarioActual.tipoSangre || "";
        formEditar.alergias.value = usuarioActual.alergias || "";
        formEditar.diagnostico.value = usuarioActual.diagnostico || "";

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
            tipoSangre: formData.get("tipoSangre"),
            alergias: formData.get("alergias"),
            diagnostico: formData.get("diagnostico")
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

});

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