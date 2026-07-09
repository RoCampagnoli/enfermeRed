//gestionUsuarios.js
//==================================================
// GESTIÓN DE USUARIOS
//==================================================

// Inicializa el almacenamiento con los usuarios por defecto
// si todavía no existen en el localStorage.
function inicializarUsuarios() {

    const huellaActual = JSON.stringify(usuariosBase);
    const huellaGuardada = localStorage.getItem("usuariosBaseHuella");

    // Si no hay usuarios guardados, o usuariosBase cambió respecto
    // a la última vez, se refresca el localStorage automáticamente.
    if (!localStorage.getItem("usuarios") || huellaGuardada !== huellaActual) {
        localStorage.setItem("usuarios", JSON.stringify(usuariosBase));
        localStorage.setItem("usuariosBaseHuella", huellaActual);
    }

}

// Devuelve todos los usuarios registrados.
function obtenerUsuarios() {

    return JSON.parse(localStorage.getItem("usuarios")) || [];

}

// Busca un usuario por su correo electrónico.
function buscarUsuarioPorEmail(email) {

    const usuarios = obtenerUsuarios();

    return usuarios.find(
        usuario => usuario.email === email
    );

}

// Busca un usuario por su ID.
function buscarUsuarioPorId(id) {

    const usuarios = obtenerUsuarios();

    return usuarios.find(
        usuario => usuario.id === id
    );

}


//==================================================
// REGISTRO DE USUARIOS
//==================================================

// Registra un nuevo usuario verificando que el correo
// no se encuentre previamente registrado.
function registrarUsuario(usuarioNuevo) {

    const usuarios = obtenerUsuarios();

    if (buscarUsuarioPorEmail(usuarioNuevo.email)) {
        return {
            exito: false,
            mensaje: "Ya existe un usuario con ese correo."
        };
    }

    usuarioNuevo.id = usuarios.length + 1;

    usuarios.push(usuarioNuevo);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    return {
        exito: true,
        mensaje: "Usuario registrado correctamente.",
        usuario: usuarioNuevo   // <-- Nuevo: devolvemos el usuario con su id ya asignado
    };

}


//==================================================
// INICIO DE SESIÓN
//==================================================

// Valida las credenciales ingresadas.
// Devuelve el objeto usuario si las credenciales son correctas,
// o undefined en caso contrario.
function validarLogin(email, password) {

    const usuarios = obtenerUsuarios();

    return usuarios.find(
        usuario =>
            usuario.email === email &&
            usuario.password === password
    );

}

//==================================================
// ACTUALIZACIÓN DE USUARIOS
//==================================================

// Actualiza los datos de un usuario existente (identificado por su ID)
// y persiste el cambio en localStorage.
function actualizarUsuario(id, datosNuevos) {

    const usuarios = obtenerUsuarios();
    const indice = usuarios.findIndex(usuario => usuario.id === id);

    if (indice === -1) {
        return { exito: false, mensaje: "Usuario no encontrado." };
    }

    usuarios[indice] = { ...usuarios[indice], ...datosNuevos };

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    return { exito: true, usuario: usuarios[indice] };

}