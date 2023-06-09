import { getConnection } from "../database/database.js";

//mostrar los medicamentos disponibles
const listarProductosDisponibles = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT m.*, DATE_FORMAT(m.fecha_caducidad, '%Y-%m-%d') AS fecha_caducidad, c.nombre_categoria, p.nombre_proveedor FROM inventario_medicamentos m JOIN inventario_categorias c ON m.categoria_id = c.id_categoria JOIN inventario_proveedores p ON m.proveedor_id = p.id_proveedor WHERE m.estado = ? ORDER BY m.fecha_creacion DESC;", estado);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//insertar nuevo medicamento
const addProductos = async (req, res) => {
    try {
        const estado = true;
        const { nombre_medicamento,proveedor_id,categoria_id,precio_unitario,cantidad,fecha_caducidad} = req.body;

        const productosProps = {nombre_medicamento,proveedor_id,categoria_id,precio_unitario,cantidad,fecha_caducidad,estado}
        const [result] = await getConnection.query("INSERT INTO inventario_medicamentos SET ?", productosProps);
        res.json(result);

    } catch (error) {
        res.status(500).send(error.message);
    }
}

//modificar medicamentos
const updateProductos = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_medicamento, proveedor_id ,categoria_id, precio_unitario, cantidad, fecha_caducidad} = req.body;

        const productosProps = { nombre_medicamento, proveedor_id ,categoria_id, precio_unitario, cantidad, fecha_caducidad}

        const [result] = await getConnection.query("UPDATE inventario_medicamentos SET ?  WHERE id_medicamento = ?", [productosProps, id]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//Eliminar medicamentos(cambiar el estado)
const deleteProducto = async (req, res) => {
    try {
        const estado = false;
        const { id } = req.params;
        const [result] = await getConnection.query("UPDATE inventario_medicamentos SET estado = ? WHERE id_medicamento = ?",[estado , id]);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
//Eliminar medicamento(cambiar el estado)
const deleteProductos = async (req, res) => {
    try {
        const { ids } = req.body;
        const estado = false;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "IDs inválidos" });
        }
        const sql = "UPDATE inventario_medicamentos SET estado = ? WHERE id_medicamento IN (?)";
        const [result] = await getConnection.query(sql, [estado, ids]);

        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//inserta categoria de los productos
const addProductosCategorias = async (req, res) => {
    try {
        const { nombre_categoria, descripcion} = req.body;

        if (nombre_categoria === undefined || descripcion === undefined) {
            res.status(400).json({ message: "Porfavor llena todos los campos" });
        }

        const categoriaProps = { nombre_categoria,descripcion}
        const [result] = await getConnection.query("INSERT INTO inventario_categorias SET ?", categoriaProps);
        res.json(result);

    } catch (error) {
        res.status(500).send(error.message);
    }
}

//muestra las categoria de los productos
const listarProductosCategorias = async (req, res) => {
    try {
        const [result] = await getConnection.query("SELECT * FROM inventario_categorias");
        res.json(result);
    } catch (error){
        res.status(500).send(error.message);
    }
}

//inserta categoria de los productos
const listarProveedoresproductos = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT * FROM inventario_proveedores WHERE estado = ?",estado);
        res.json(result);
    } catch (error){
        res.status(500).send(error.message);
    }
}

export const methods = {
    listarProductosDisponibles,
    addProductos,
    updateProductos,
    deleteProducto,
    deleteProductos,
    addProductosCategorias,
    listarProductosCategorias,
    listarProveedoresproductos
}