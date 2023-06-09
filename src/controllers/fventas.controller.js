import { getConnection } from "./../database/database.js";

//mostrar un listado de ventas
const listarVentasDisponibles = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT iv.id_venta, im.nombre_medicamento, iv.cantidad_vendida, DATE_FORMAT(iv.fecha_venta, '%d-%m-%Y') AS fecha_venta, iv.total_venta, p.nombres, p.apellidos FROM inventario_ventas iv JOIN inventario_medicamentos im ON iv.id_medicamento = im.id_medicamento JOIN pacientes p ON iv.pacientes_id = p.id WHERE iv.estado = ? ", estado);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//liscar todos los medicamentos que estan activos
const listarVentasMedicamento = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT * FROM inventario_medicamentos WHERE estado = ?", estado);
        res.json(result);
    } catch (error){
        res.status(500).send(error.message);
    }
}

//listar pacientes para el registro de venta
const listarVentasPaciente = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT * FROM pacientes WHERE estado = ?", estado);
        res.json(result);
    } catch (error){
        res.status(500).send(error.message);
    }
}

//insertar nuevo registro de ventas 
const addVenta = async (req, res) => {
    try {
        const estado = true;
        const { id_medicamento, cantidad_vendida, paciente_id,fecha_venta, total_venta } = req.body;

        const ventasProps = { id_medicamento, cantidad_vendida, paciente_id,fecha_venta, total_venta, estado }
        const [result] = await getConnection.query("INSERT INTO inventario_ventas SET ?", ventasProps);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

//editar las ventas que estan mal registradas
const updateVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_medicamento, cantidad_vendida, fecha_venta, total_venta} = req.body;
        const ventasProps = { id_medicamento, cantidad_vendida, fecha_venta, total_venta}
        const [result] = await getConnection.query("UPDATE inventario_ventas SET ? WHERE id_venta = ?", [ventasProps, id]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//Eliminar(cambiar el estado) de los proveedores que yo no son necesarios
const deleteVenta = async (req, res) => {
    try {
        const estado = false;
        const { id } = req.params;
        const [result] = await getConnection.query("UPDATE inventario_ventas SET estado = ? WHERE id_venta = ?",[estado , id]);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
const deleteVentas = async (req, res) => {
    try {
        const { ids } = req.body;
        const estado = false;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "IDs inválidos" });
        }
        const sql = "UPDATE inventario_ventas SET estado = ? WHERE id_venta IN (?)";
        const [result] = await getConnection.query(sql, [estado, ids]);

        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export const methods = {
    listarVentasDisponibles,
    listarVentasMedicamento,
    listarVentasPaciente,
    addVenta,
    updateVenta,
    deleteVenta,
    deleteVentas
}