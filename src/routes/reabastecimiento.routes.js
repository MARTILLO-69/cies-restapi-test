import {Router, request} from "express";
import {methods as reabastecerController} from "../controllers/freabastecimiento.controller.js";

const router = Router();
    //Listar
router.get("/", reabastecerController.listarReabastecimientoDisponibles);
router.get("/productos", reabastecerController.listarReabastecimientoProductos);
router.get("/proveedores", reabastecerController.listarReabastecimientoProveeores);

//Insercion
router.post("/registrar", reabastecerController.addReabastecimiento);

//Actualizar
router.put("/actualizar/:id",reabastecerController.updateReabastecimiento);

//Eliminar
router.put("/eliminar/:id", reabastecerController.deleteReabastecimiento);
router.put("/eliminarVarios", reabastecerController.deleteReabastecimientos);

export default router;