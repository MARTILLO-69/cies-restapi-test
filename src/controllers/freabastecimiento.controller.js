import { getConnection } from "./../database/database.js";

//mostrar un listado de ventas
const listarReabastecimientoDisponibles = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT r.*, DATE_FORMAT(r.fecha_reabastecimiento, '%d-%m-%Y') AS fecha_reabastecimiento, m.nombre_medicamento, p.nombre_proveedor FROM inventario_reabastecimiento r INNER JOIN inventario_medicamentos m ON r.producto_id = m.id_medicamento INNER JOIN inventario_proveedores p ON r.proveedor_id = p.id_proveedor WHERE r.estado = ?;", estado);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//liscar todos los productoas que estan activos
const listarReabastecimientoProductos = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT * FROM inventario_medicamentos WHERE estado = ?", estado);
        res.json(result);
    } catch (error){
        res.status(500).send(error.message);
    }
}

//liscar todos los proveedores que estan activos
const listarReabastecimientoProveeores = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT * FROM inventario_proveedores WHERE estado = ?", estado);
        res.json(result);
    } catch (error){
        res.status(500).send(error.message);
    }
}

//insertar nuevo registro de ventas 
const addReabastecimiento = async (req, res) => {
    try {
        const { producto_id, proveedor_id, cantidad_reabastecida, fecha_reabastecimiento, costo_total } = req.body;
        const reabastecimientoProps = { producto_id, proveedor_id, cantidad_reabastecida, fecha_reabastecimiento, costo_total, estado: true };

        // Verificar si ya existe un reabastecimiento para el producto en la misma fecha
        const [existingReabastecimiento] = await getConnection.query("SELECT * FROM inventario_reabastecimiento WHERE producto_id = ? AND fecha_reabastecimiento = ?", [producto_id, fecha_reabastecimiento]);
        if (existingReabastecimiento.length > 0) {
            return res.status(400).json({ message: 'Ya se ha registrado un reabastecimiento para este producto en la misma fecha.' });
        }

        // Insertar el registro en la tabla inventario_reabastecimiento
        const [reabastecimientoResult] = await getConnection.query("INSERT INTO inventario_reabastecimiento SET ?", reabastecimientoProps);
        const reabastecimientoId = reabastecimientoResult.insertId;

        // Actualizar la cantidad en la tabla inventario_medicamentos
        const [productoResult] = await getConnection.query("UPDATE inventario_medicamentos SET cantidad = cantidad + ? WHERE id_medicamento = ?", [cantidad_reabastecida, producto_id]);

        res.json({ reabastecimientoId, productoResult });
    } catch (error) {
        res.status(500).send(error.message);
    }
};



//editar las ventas que estan mal registradas
const updateReabastecimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const { producto_id,proveedor_id, cantidad_reabastecida, fecha_reabastecimiento , costo_total} = req.body;
        const reabastecimientoProps = {producto_id, proveedor_id, cantidad_reabastecida, fecha_reabastecimiento , costo_total}
        const [result] = await getConnection.query("UPDATE inventario_reabastecimiento SET ? WHERE id_reabastecimiento = ?", [reabastecimientoProps, id]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//Eliminar(cambiar el estado) de los proveedores que yo no son necesarios
const deleteReabastecimiento = async (req, res) => {
    try {
        const estado = false;
        const { id } = req.params;
        const [result] = await getConnection.query("UPDATE inventario_reabastecimiento SET estado = ? WHERE id_reabastecimiento = ?",[estado , id]);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const deleteReabastecimientos = async (req, res) => {
    try {
        const { ids } = req.body;
        const estado = false;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "IDs inválidos" });
        }
        const sql = "UPDATE inventario_reabastecimiento SET estado = ? WHERE id_reabastecimiento IN (?)";
        const [result] = await getConnection.query(sql, [estado, ids]);

        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export const methods = {
    listarReabastecimientoDisponibles,
    listarReabastecimientoProductos,
    listarReabastecimientoProveeores,
    addReabastecimiento,
    updateReabastecimiento,
    deleteReabastecimiento,
    deleteReabastecimientos
}
