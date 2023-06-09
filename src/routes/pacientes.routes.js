import {Router, request} from "express";
import {methods as pacientesController} from "./../controllers/pacientes.controller.js";

const router = Router();
//Busquedas
router.get("/pacientes", pacientesController.getPacientes);
router.get("/paciente/:id", pacientesController.getPaciente);
router.get("/direccion", pacientesController.listarDirecciones);

//Inserciones
router.post("/registrar", pacientesController.addPaciente);

//Eliminacion
router.put("/delete/:id", pacientesController.deletePaciente);
router.put("/eliminarPacientes", pacientesController.deletePacientes);

//Actualizaciones
router.put("/actualizar/:id", pacientesController.updatePaciente);


export default router;