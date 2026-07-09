document.querySelectorAll('.pasos-toggle').forEach(header => {
    header.addEventListener('click', () => {
        header.closest('.info, .pasos-columna').classList.toggle('contraido');
    });
});