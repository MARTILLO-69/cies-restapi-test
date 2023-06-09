import { getConnection } from "./../database/database.js";
import { uploadImageToStorage } from "../service/googleCloud.js";



const getPacientes = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT * FROM pacientes WHERE estado = ?", estado);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getServicios = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT s.*, c.nombre_categoria FROM servicios s INNER JOIN categoria_servicios c ON s.id_categoria = c.id WHERE s.estado = ? ORDER BY s.fecha_creacion DESC;", estado);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getServiciosID = async (req, res) => {
    try {
        const { id_categoria } = req.params;
        const estado = true;
        const [result] = await getConnection.query("SELECT s.*, c.nombre_categoria FROM servicios s INNER JOIN categoria_servicios c ON s.id_categoria = c.id WHERE s.estado = ? AND s.id_categoria = ? ORDER BY s.fecha_creacion DESC;", [estado,id_categoria]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getMedicosID = async (req, res) => {
    try {
        const { id_servicio } = req.params;
        const estado = true;
        const [result] = await getConnection.query("SELECT m.id,m.id_usuario,m.id_servicio, s.nombre_servicio, u.nombres, u.apellidos FROM medicos m INNER JOIN usuarios u ON m.id_usuario = u.id INNER JOIN servicios s ON m.id_servicio = s.id WHERE m.estado = ? AND m.id_servicio = ? ORDER BY m.id_usuario DESC;", [estado,id_servicio]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getServiciosIDmedico = async (req, res) => {
    try {
        const { id_medico } = req.params;
        const estado = true;
        const [result] = await getConnection.query("SELECT m.id, h.fichas_disponibles, h.dia_semana, h.hora_inicio, h.hora_final,m.especialidad, u.nombres,u.apellidos,u.correo,u.rol, s.codigo,s.nombre_servicio FROM horarios_medicos h INNER JOIN medicos m ON h.id_medico = m.id INNER JOIN usuarios u ON m.id_usuario = u.id INNER JOIN servicios s ON m.id_servicio = s.id WHERE m.estado = ? AND h.id_medico = ? ORDER BY h.dia_semana ASC", [estado,id_medico]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const listarCategorias = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT * FROM categoria_servicios WHERE estado = ?", estado);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const addServicio = async (req, res) => {
    try {
        const { nombre_servicio, descripcion_servicio, id_categoria } = req.body;

        const folder = 'servicios'
        const imageUrl = await uploadImageToStorage(req.file, folder);

        const [lastCodeResult] = await getConnection.query('SELECT codigo FROM servicios ORDER BY codigo DESC LIMIT 1');

        let newCode = 'SER-001';

        if (lastCodeResult.length > 0) {

            let lastCode = lastCodeResult[0].codigo;
            let lastNumber = parseInt(lastCode.replace('SER-', ''));
            let newNumber = lastNumber + 1;

            let formattedNumber = ("000" + newNumber).slice(-3);
            newCode = 'SER-' + formattedNumber;
        }

        const serviciosProps = { codigo: newCode, nombre_servicio, descripcion_servicio, id_categoria, ruta_imagen: imageUrl, 'estado_servicio': 'Pendiente', 'estado': true };
        const [result] = await getConnection.query("INSERT INTO servicios SET ?", serviciosProps);
        res.json(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

const addCategoria = async (req, res) => {
    try {
        const { nombre_categoria, descripcion_categoria } = req.body;

        const folder = 'categoria_servicio'
        const imageUrlCategoria = await uploadImageToStorage(req.file, folder);

        const [lastCodeResult] = await getConnection.query('SELECT codigo FROM categoria_servicios ORDER BY codigo DESC LIMIT 1');

        let newCode = 'CAT-001';

        if (lastCodeResult.length > 0) {

            let lastCode = lastCodeResult[0].codigo;
            let lastNumber = parseInt(lastCode.replace('CAT-', ''));
            let newNumber = lastNumber + 1;

            let formattedNumber = ("000" + newNumber).slice(-3);
            newCode = 'CAT-' + formattedNumber;
        }

        const categoriaProps = {
            codigo: newCode,
            nombre_categoria,
            descripcion_categoria,
            ruta_imagen: imageUrlCategoria,
            'estado': true
        };
        const [result] = await getConnection.query("INSERT INTO categoria_servicios SET ?", categoriaProps);
        res.json(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}



const updateServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_servicio, descripcion_servicio, id_categoria } = req.body;
        const serviciosProps = { nombre_servicio, descripcion_servicio, id_categoria };
        const [result] = await getConnection.query("UPDATE servicios SET ? WHERE id = ?", [serviciosProps, id]);
        res.json(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

const updateCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_categoria, descripcion_categoria } = req.body;
        const categoriaProps = { nombre_categoria, descripcion_categoria };
        const [result] = await getConnection.query("UPDATE categoria_servicios SET ? WHERE id = ?", [categoriaProps, id]);
        res.json(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

const estadoServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado_servicio } = req.body;
        const [result] = await getConnection.query("UPDATE servicios SET estado_servicio = ? WHERE id = ?", [estado_servicio, id]);
        res.json(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

const deleteServicio = async (req, res) => {

    try {
        const { id } = req.params;
        const estado = false;
        const [result] = await getConnection.query("UPDATE servicios SET estado = ? WHERE id = ?", [estado, id]);
        res.json(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

const deleteCategoria = async (req, res) => {

    try {
        const { id } = req.params;
        const estado = false;
        const [result] = await getConnection.query("UPDATE categoria_servicios SET estado = ? WHERE id = ?", [estado, id]);
        res.json(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

const deleteServicios = async (req, res) => {
    try {
        const { ids } = req.body;
        const estado = false;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "IDs inválidos" });
        }
        const sql = "UPDATE servicios SET estado = ? WHERE id IN (?)";
        const [result] = await getConnection.query(sql, [estado, ids]);

        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const deleteCategorias = async (req, res) => {
    try {
        const { ids } = req.body;
        const estado = false;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "IDs inválidos" });
        }
        const sql = "UPDATE categoria_servicios SET estado = ? WHERE id IN (?)";
        const [result] = await getConnection.query(sql, [estado, ids]);

        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


export const methods = {
    getServicios,
    addServicio,
    addCategoria,
    listarCategorias,
    updateServicio,
    estadoServicio,
    deleteServicio,
    deleteServicios,
    updateCategoria,
    deleteCategoria,
    deleteCategorias,
    getServiciosID,
    getServiciosIDmedico,
    getMedicosID,
    getPacientes
}