document.addEventListener("DOMContentLoaded", () => {
    // === LÓGICA PARA CONTRAER / EXPANDIR SECCIONES ===
    document.querySelectorAll(".btn-toggle-seccion").forEach(btn => {
        btn.addEventListener("click", () => {
            const seccion = btn.closest(".info-paciente, .enfermeros-asoc, .medicamentos-vacunas, .mis-antecedentes");
            if (seccion) {
                seccion.classList.toggle("colapsada");
            }
        });
    });

    // Verificación de seguridad para asegurar que usuariosBase exista
    if (typeof usuariosBase === 'undefined') {
        console.error("Error: 'usuariosBase' no está definido.");
        return;
    }

    // Simulamos trabajar con el usuario Juan (ID 1)
    let usuarioActual = usuariosBase.find(u => u.id === 1);
    
    if (!usuarioActual) {
        console.error("No se encontró el usuario con ID 1");
        return;
    }

    if (!usuarioActual.medicamentos) {
        usuarioActual.medicamentos = [];
    }

    const contenedor = document.getElementById("contenedor-medicamentos");
    const modalMed = document.getElementById("popupMedicamento");
    const formMed = document.getElementById("formMedicamento");
    
    const iconosTipo = {
        pastilla: "pill",
        inyeccion: "syringe",
        jarabe: "droplet",
        gotas: "pipette"
    };

    // --- FUNCIÓN RENDERIZAR MEDICAMENTOS ---
    function renderMedicamentos() {
        contenedor.innerHTML = ""; 

        if (usuarioActual.medicamentos.length === 0) {
            contenedor.innerHTML = `
                <div class="sin-datos-vacio">
                    <i data-lucide="archive"></i>
                    <p>No tienes medicamentos cargados en este momento.</p>
                </div>
            `;
            if (window.lucide) lucide.createIcons();
            return;
        }

        const diasSemanaFijos = ["L", "M", "Mi", "J", "V", "S", "D"];

        usuarioActual.medicamentos.forEach(med => {
            const icono = iconosTipo[med.tipo] || "pill";
            
            // Generar contenedor de días
            let diasHTML = `<div class="med-dias-lista">`;
            diasSemanaFijos.forEach(d => {
                const activo = med.dias.includes(d);
                const claseActivo = activo ? "dia-activo" : "dia-inactivo";
                diasHTML += `<span class="med-dia-burbuja ${claseActivo}">${d}</span>`;
            });
            diasHTML += `</div>`;

            // Card con estructura idéntica a enfermeros
            const card = document.createElement("div");
            card.className = "card-info-divs";
            card.innerHTML = `
                <div class="med-detalle-bloque">
                    <div class="icono-med-tipo">
                        <i data-lucide="${icono}"></i>
                    </div>
                    <div class="med-info-texto">
                        <h3>${med.nombre} <small>(${med.duracion})</small></h3>
                        ${diasHTML}
                        <p><strong>Horarios:</strong> ${med.horarios.join(" - ")} (${med.frecuencia} veces al día)</p>
                        <p class="med-indicaciones"><strong>Indicaciones:</strong> ${med.indicaciones || 'Sin indicaciones.'}</p>
                    </div>
                </div>
                <div class="acciones-enfermero">
                    <button class="btn-alerta-med" data-id="${med.id}" aria-label="Alerta"><i data-lucide="bell"></i></button>
                    <button class="btn-editar-med" data-id="${med.id}" aria-label="Editar"><i data-lucide="pencil"></i></button>
                    <button class="btn-borrar-med" data-id="${med.id}" aria-label="Borrar"><i data-lucide="trash-2"></i></button>
                </div>
            `;
            contenedor.appendChild(card);
        });

        if (window.lucide) lucide.createIcons();
        asignarEventosAcciones();
    }

    // --- MANEJO DE ACCIONES (EDITAR / BORRAR / ALERTA) ---
    function asignarEventosAcciones() {
        // Borrar
        document.querySelectorAll(".btn-borrar-med").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                usuarioActual.medicamentos = usuarioActual.medicamentos.filter(m => m.id !== id);
                renderMedicamentos();
            });
        });

        // Editar
        document.querySelectorAll(".btn-editar-med").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const med = usuarioActual.medicamentos.find(m => m.id === id);
                if (med) {
                    document.getElementById("tituloModalMedicamento").innerText = "Editar Medicamento";
                    document.getElementById("inputMedId").value = med.id;
                    document.getElementById("inputMedNombre").value = med.nombre;
                    document.getElementById("selectMedTipo").value = med.tipo;
                    document.getElementById("inputMedFrecuencia").value = med.frecuencia;
                    document.getElementById("inputMedHorarios").value = med.horarios.join(", ");
                    document.getElementById("inputMedDuracion").value = med.duracion;
                    document.getElementById("txtMedIndicaciones").value = med.indicaciones;

                    document.querySelectorAll('#formMedicamento input[name="dias"]').forEach(cb => {
                        cb.checked = med.dias.includes(cb.value);
                    });

                    modalMed.classList.add("active");
                    modalMed.style.display = "block"; 
                }
            });
        });

        // Alerta
        document.querySelectorAll(".btn-alerta-med").forEach(btn => {
            btn.addEventListener("click", () => {
                alert("Configuración de recordatorios/alertas activada.");
            });
        });
    }

    // --- MODAL ABRIR / CERRAR ---
    document.getElementById("btnNuevoMedicamento").addEventListener("click", () => {
        document.getElementById("tituloModalMedicamento").innerText = "Cargar Nuevo Medicamento";
        formMed.reset();
        document.getElementById("inputMedId").value = "";
        modalMed.classList.add("active");
        modalMed.style.display = "block";
    });

    document.getElementById("btnCerrarMedicamento").addEventListener("click", () => {
        modalMed.classList.remove("active");
        modalMed.style.display = "none";
    });

    // --- GUARDAR FORMULARIO ---
    formMed.addEventListener("submit", (e) => {
        e.preventDefault();

        const medId = document.getElementById("inputMedId").value;
        const nombre = document.getElementById("inputMedNombre").value;
        const tipo = document.getElementById("selectMedTipo").value;
        const frecuencia = document.getElementById("inputMedFrecuencia").value;
        const duracion = document.getElementById("inputMedDuracion").value;
        const indicaciones = document.getElementById("txtMedIndicaciones").value;
        const horarios = document.getElementById("inputMedHorarios").value.split(",").map(h => h.trim());

        const dias = [];
        document.querySelectorAll('#formMedicamento input[name="dias"]:checked').forEach(cb => {
            dias.push(cb.value);
        });

        if (medId) {
            const index = usuarioActual.medicamentos.findIndex(m => m.id === medId);
            if (index !== -1) {
                usuarioActual.medicamentos[index] = { id: medId, nombre, tipo, dias, frecuencia, horarios, duracion, indicaciones };
            }
        } else {
            const nuevoMed = {
                id: "med-" + Date.now(),
                nombre, tipo, dias, frecuencia, horarios, duracion, indicaciones
            };
            usuarioActual.medicamentos.push(nuevoMed);
        }

        modalMed.style.display = "none";
        modalMed.classList.remove("active");
        renderMedicamentos();
        
        const popupExito = document.getElementById("popupEdicionExitosa");
        if (popupExito) popupExito.style.display = "block";
    });

    if (document.getElementById("btnCerrarPopupExito")) {
        document.getElementById("btnCerrarPopupExito").addEventListener("click", () => {
            document.getElementById("popupEdicionExitosa").style.display = "none";
        });
    }

    renderMedicamentos();
});
