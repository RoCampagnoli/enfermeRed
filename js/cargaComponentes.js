async function cargarComponentes() {
        // Carga el header
        const resHeader = await fetch('/vistas/fragmentos/header.html');
        document.getElementById('header-component').innerHTML = await resHeader.text();

        // Carga el footer
        const resFooter = await fetch('/vistas/fragmentos/footer.html');
        document.getElementById('footer-component').innerHTML = await resFooter.text();
    }
    cargarComponentes();