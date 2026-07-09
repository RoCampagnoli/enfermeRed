document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('filterSidebar');
    const btnAbrir = document.getElementById('btnAbrirFiltro');
    const btnCerrar = document.getElementById('btnCerrarFiltro');

    function pintarValoracionCard(card, valoracion) {
        const rating = card.querySelector('.nurse-rating');
        if (!rating) return;

        card.setAttribute('data-valoracion', valoracion);
        rating.innerHTML = [1, 2, 3].map((estrella) =>
            `<i class="${estrella <= valoracion ? 'fa-solid' : 'fa-regular'} fa-star"></i>`
        ).join('');
    }

    function aplicarValoracionesGuardadas() {
        const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || 'null');
        if (!usuarioLogueado || usuarioLogueado.tipo !== 'paciente') return;

        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const paciente = usuarios.find((usuario) => usuario.id === usuarioLogueado.id) || usuarioLogueado;
        const enfermerosAsociados = paciente.enfermerosAsociados || [];

        document.querySelectorAll('.nurse-card').forEach((card) => {
            const nombre = card.querySelector('h2')?.textContent.trim() || '';
            const matricula = card.querySelectorAll('.nurse-meta')[0]?.textContent.trim() || '';
            const enfermeroGuardado = enfermerosAsociados.find((enfermero) =>
                enfermero.nombre === nombre && enfermero.matricula === matricula
            );

            if (enfermeroGuardado && enfermeroGuardado.valoracion !== undefined) {
                pintarValoracionCard(card, Number(enfermeroGuardado.valoracion) || 0);
            }
        });
    }

    aplicarValoracionesGuardadas();

    // 1. Apertura y Cierre del Sidebar
    if (btnAbrir) {
        btnAbrir.addEventListener('click', () => sidebar.classList.add('active'));
    }
    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => sidebar.classList.remove('active'));
    }

    // 2. Interactividad de Estrellas (Valoración)
    const estrellas = document.querySelectorAll('#containerEstrellas span');
    estrellas.forEach(star => {
        star.addEventListener('click', (e) => {
            const val = parseInt(e.target.getAttribute('data-value'));
            document.getElementById('valoracionSeleccionada').value = val;
            
            estrellas.forEach((s, index) => {
                s.style.color = index < val ? '#f59e0b' : '#ccc'; // Amarillo o Gris
            });
        });
    });

    // 3. Lógica Principal: Filtrado y Ordenamiento
    const btnAplicar = document.getElementById('btnAplicarFiltros');
    if (btnAplicar) {
        btnAplicar.addEventListener('click', () => {
            const inputPrecio = document.getElementById('filtroPrecio').value.trim();
            const precioMax = inputPrecio === "" ? Infinity : parseFloat(inputPrecio);
            
            const fechaSelect = document.getElementById('filtroDia').value; 
            const valoracionMin = parseInt(document.getElementById('valoracionSeleccionada').value) || 0;
            const zonaSelect = document.getElementById('filtroZona').value.toLowerCase();
            const metodoOrden = document.getElementById('ordenadorOpciones').value;

            const listaContenedor = document.querySelector('.nuestros-lista');
            const cards = Array.from(document.querySelectorAll('.nurse-card'));

            // --- FASE 1: FILTRADO ---
            cards.forEach(card => {

                let rawPrice = card.getAttribute('data-precio') || "0";
                
                const p = parseFloat(rawPrice.replace(/\D/g, ''));

                const disp = card.getAttribute('data-disponibilidad') || ""; 
                const v = parseInt(card.getAttribute('data-valoracion')) || 0;
                const z = (card.getAttribute('data-zona') || "").toLowerCase();

                const cumplePrecio = p <= precioMax;
                const cumpleZona = zonaSelect === "" || z === zonaSelect;
                const cumpleValoracion = v >= valoracionMin;
                
                const diasArray = disp.split(' ').filter(d => d.trim() !== ""); 
                const cumpleFecha = fechaSelect === "" || diasArray.includes(fechaSelect);

                if (cumplePrecio && cumpleZona && cumpleValoracion && cumpleFecha) {
                    card.style.display = 'grid'; 
                } else {
                    card.style.display = 'none';
                }
            });

            // --- FASE 2: ORDENAMIENTO ---
            if (metodoOrden !== "") {
                cards.sort((cardA, cardB) => {
                    // Extraer precio limpiando caracteres no numéricos
                    let precioA = parseFloat((cardA.getAttribute('data-precio') || "0").replace(/\./g, ''));
                    let precioB = parseFloat((cardB.getAttribute('data-precio') || "0").replace(/\./g, ''));
                    
                    let valA = parseInt(cardA.getAttribute('data-valoracion')) || 0;
                    let valB = parseInt(cardB.getAttribute('data-valoracion')) || 0;

                    if (metodoOrden === "destacado") {
                        return valB - valA; 
                    } else if (metodoOrden === "precioDesc") {
                        return precioB - precioA;
                    } else if (metodoOrden === "precioAsc") {
                        return precioA - precioB;
                    }
                    return 0;
                });

                cards.forEach(card => listaContenedor.appendChild(card));
            }
            
            sidebar.classList.remove('active'); 
        });
    }

    // 4. Lógica de Borrar Filtros
    const btnLimpiar = document.getElementById('btnLimpiarFiltros');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            document.getElementById('filtroPrecio').value = '';
            document.getElementById('filtroDia').value = '';
            document.getElementById('filtroZona').value = '';
            document.getElementById('valoracionSeleccionada').value = '0';
            document.getElementById('ordenadorOpciones').value = '';

            estrellas.forEach(s => s.style.color = '#ccc');

            // Mostrar nuevamente todas las tarjetas sin criterios de exclusión
            document.querySelectorAll('.nurse-card').forEach(card => {
                card.style.display = 'grid'; 
            });

            sidebar.classList.remove('active');
        });
    }
});
