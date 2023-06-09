import {Router, request} from "express";
import {methods as ventasController} from "../controllers/fventas.controller.js";

const router =Router();

//mostrar listado de proveedor registrados
router.get("/", ventasController.listarVentasDisponibles); 
router.get("/medicamentos", ventasController.listarVentasMedicamento); 
router.get("/pacientes", ventasController.listarVentasPaciente);

//insercion y modificacion del campo cantidad
router.post("/registrar", ventasController.addVenta);

//modificar proveedores
router.put("/modificar/:id", ventasController.updateVenta);

//eliminar producto
router.put("/eliminar/:id",ventasController.deleteVenta);
router.put("/eliminarventas",ventasController.deleteVentas);

export default router;