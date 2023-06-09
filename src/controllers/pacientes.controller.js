import { getConnection } from "./../database/database.js";

//Busqueda
const getPacientes = async (req, res) => {
    try {
        const [result] = await getConnection.query("SELECT p.*, DATE_FORMAT(p.fecha_nacimiento, '%Y-%m-%d') AS fecha_nacimiento, d.calle, d.ciudad FROM pacientes p LEFT JOIN direccion d ON p.id = d.id WHERE p.estado = 1");
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


const listarDirecciones = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT id, CONCAT('zona: ', zona, ', ', 'calle: ', calle, ', ', 'ciudad: ', ciudad, ', ','provincia: ', provincia) AS direccion FROM direccion WHERE estado = ? GROUP BY zona, calle", estado);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await getConnection.query("SELECT * FROM pacientes WHERE id = ?", id);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//Insercion
const addPaciente = async (req, res) => {
    try {
        const { nombres, apellidos, fecha_nacimiento, sexo, telefono, correo_electronico, id_direccion, usuario,contrasenia } = req.body;

        const pacientesProps = { nombres, apellidos, fecha_nacimiento, sexo, telefono, correo_electronico, id_direccion, 'estado': true, usuario, contrasenia };

        const [result] = await getConnection.query("INSERT INTO pacientes SET ?", pacientesProps);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//Actualizacion
const updatePaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, apellidos, fecha_nacimiento, sexo, telefono, correo_electronico, id_direccion, usuario, contrasenia} = req.body;
        const pacientesProps = { nombres, apellidos, fecha_nacimiento, sexo, telefono, correo_electronico, id_direccion, usuario, contrasenia, 'estado': true }
        const [result] = await getConnection.query("UPDATE pacientes SET ? WHERE id = ?", [pacientesProps, id]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


//Eliminacion
const deletePaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const estado = false;
        const [result] = await getConnection.query("UPDATE pacientes SET estado = ? WHERE id = ? ", [estado, id]);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const deletePacientes = async (req, res) => {
    try {
        const { ids } = req.body;
        const estado = false;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "IDs inválidos" });
        }
        const sql = "UPDATE pacientes SET estado = ? WHERE id IN (?)";
        const [result] = await getConnection.query(sql, [estado, ids]);

        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


export const methods = {
    getPacientes,
    getPaciente,
    addPaciente,
    deletePaciente,
    updatePaciente,
    listarDirecciones,
    deletePacientes
}