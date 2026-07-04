//==================================================
// USUARIOS POR DEFECTO
//==================================================

const usuariosBase = [
    {
        id: 1,
        nombre: "Juan Pérez",
        email: "paciente@test.com",
        password: "1234",
        tipo: "paciente"
    },
    {
        id: 2,
        nombre: "María Gómez",
        email: "enfermero@test.com",
        password: "1234",
        tipo: "enfermero"
    }
];


//==================================================
// GESTIÓN DE USUARIOS
//==================================================

// Inicializa el almacenamiento con los usuarios por defecto
// si todavía no existen en el localStorage.
function inicializarUsuarios() {

    if (!localStorage.getItem("usuarios")) {
        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuariosBase)
        );
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

    // Verificar email repetido
    if (buscarUsuarioPorEmail(usuarioNuevo.email)) {
        return {
            exito: false,
            mensaje: "Ya existe un usuario con ese correo."
        };
    }

    // Generar ID automático
    usuarioNuevo.id = usuarios.length + 1;

    usuarios.push(usuarioNuevo);

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );

    return {
        exito: true,
        mensaje: "Usuario registrado correctamente."
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