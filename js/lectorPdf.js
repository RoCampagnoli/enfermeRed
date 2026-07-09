// =========================================================
// Lector de PDF: extracción de texto y datos de antecedentes
// =========================================================

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

async function extraerTextoDePdf(archivo) {
    const arrayBuffer = await archivo.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let textoCompleto = "";
    for (let i = 1; i <= pdf.numPages; i++) {
        const pagina = await pdf.getPage(i);
        const contenido = await pagina.getTextContent();
        textoCompleto += contenido.items.map(item => item.str).join(" ") + "\n";
    }
    return textoCompleto;
}

function extraerDatosEpicrisis(texto) {
    const datos = { enfermedad: "", fecha: "", tratamiento: "" };

    const matchDiagnostico = texto.match(/diagn[oó]stico[:\s]+([^\n\.]{3,80})/i);
    if (matchDiagnostico) datos.enfermedad = matchDiagnostico[1].trim();

    const matchFecha = texto.match(/fecha de (ingreso|diagn[oó]stico)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
    if (matchFecha) datos.fecha = matchFecha[2].trim();

    const matchTratamiento = texto.match(/tratamiento[:\s]+([^\n\.]{3,150})/i);
    if (matchTratamiento) datos.tratamiento = matchTratamiento[1].trim();

    return datos;
}

function convertirArchivoABase64(archivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(archivo);
    });
}

// Procesa un PDF completo: extrae texto, datos y lo convierte a base64
// para poder guardarlo (ya que no hay backend, se persiste en localStorage).
async function procesarPdfAntecedente(archivo) {
    const [texto, archivoBase64] = await Promise.all([
        extraerTextoDePdf(archivo),
        convertirArchivoABase64(archivo)
    ]);

    const datos = extraerDatosEpicrisis(texto);

    return {
        id: "ant-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
        enfermedad: datos.enfermedad || "Antecedente sin nombre (completar)",
        fecha: datos.fecha || "",
        tratamiento: datos.tratamiento || "",
        archivoNombre: archivo.name,
        archivoBase64
    };
}