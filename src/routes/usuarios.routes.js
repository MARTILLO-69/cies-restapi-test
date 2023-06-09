import {Router, request} from "express";
import {methods as usuarioController} from "./../controllers/usuarios.controller.js";

const router = Router();
//Busquedas
router.get("/", usuarioController.getUsuarios);
router.get("/:id", usuarioController.getUsuario);

//Inserciones
router.post("/registrar", usuarioController.addUsuarios);

//Eliminacion
router.put("/delete/:id", usuarioController.deleteUsuario);

//Actualizaciones
router.put("/actualizar/:id", usuarioController.updateUsuario);

//Login
router.post("/login", usuarioController.loginUser);




export default router;