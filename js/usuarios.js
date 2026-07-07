//usuarios.js
// ==================================================
// USUARIOS POR DEFECTO
//==================================================

const usuariosBase = [
    {
        id: 1,
        nombre: "Juan",
        apellido: "Pérez",
        email: "paciente@test.com",
        password: "1234",
        tipo: "paciente",
        dni: "30123456",
        edad: 34,
        sexo: "Masculino",
        direccion: "Av. Siempre Viva 742",
        telefono: "011-4555-1234",
        celular: "11-6555-9876",
        tipoSangre: "O+",
        alergias: "-",
        diagnostico: "Hipertensión, Diabetes",
        // Nueva estructura de medicamentos asociada al usuario
        medicamentos: [
            {
                id: "med-1",
                nombre: "Metformina",
                tipo: "pastilla", // pastilla, inyeccion, jarabe, etc.
                dias: ["L", "Mi", "V"], // Días seleccionados
                frecuencia: "2", // Veces al día
                horarios: ["08:00", "20:00"],
                duracion: "30 días",
                indicaciones: "Tomar después de las comidas para controlar la Diabetes."
            }
        ]
    },
    {
        id: 2,
        nombre: "María",
        apellido: "Gómez",
        email: "enfermero@test.com",
        password: "1234",
        tipo: "enfermero"
    }
];