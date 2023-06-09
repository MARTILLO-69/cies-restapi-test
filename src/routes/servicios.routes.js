import { Router, request } from "express";
import { methods as serviciosController } from "./../controllers/servicios.controller.js";
import { multerUpload } from "../service/googleCloud.js";

const router = Router();

router.get("/pacientes", serviciosController.getPacientes);

//Listar
router.get("/", serviciosController.getServicios);
router.get("/servicios/:id_categoria", serviciosController.getServiciosID);
router.get("/medicos/:id_servicio", serviciosController.getMedicosID);
router.get("/serviciosMedico/:id_medico", serviciosController.getServiciosIDmedico);
router.get("/categorias", serviciosController.listarCategorias);

//Insercion
router.post("/registrar", multerUpload.single('imagen'), serviciosController.addServicio);
router.post("/registrarCategoria", multerUpload.single('imagenCategoria'), serviciosController.addCategoria);


//Actualizar
router.put("/actualizar/:id", serviciosController.updateServicio);
router.put("/actualizarCategoria/:id", serviciosController.updateCategoria);
router.put("/estado/:id", serviciosController.estadoServicio);

//Eliminar
router.put("/eliminar/:id", serviciosController.deleteServicio);
router.put("/eliminarServicios", serviciosController.deleteServicios);
router.put("/eliminarCategoria/:id", serviciosController.deleteCategoria);
router.put("/eliminarCategorias", serviciosController.deleteCategorias);


export default router;