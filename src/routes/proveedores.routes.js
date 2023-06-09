import {Router, request} from "express";
import {methods as proveedoresController} from "../controllers/fproveedores.controller.js";

const router = Router();

//mostrar listado de proveedor registrados
router.get("/", proveedoresController.listarProveedoresDisponibles);

//insercion de proveedores
router.post("/registrar", proveedoresController.addProveedor);

//modificar proveedores
router.put("/modificar/:id", proveedoresController.updateProveedor);

//eliminar producto
router.put("/eliminar/:id",proveedoresController.deleteProvedor);
router.put("/eliminarproveedores",proveedoresController.deleteProvedores);


export default router;