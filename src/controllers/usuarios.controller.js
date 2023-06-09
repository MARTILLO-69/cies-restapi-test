import { getConnection } from "./../database/database.js";
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    const token = jwt.sign({ id: userId }, 'secretKey', { expiresIn: '1h' });
    return token;
}

//Busqueda
const getUsuarios = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT * FROM usuarios WHERE  estado = ? ", estado);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


//Buscar un usuario a traves de su id
const getUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await getConnection.query("SELECT * FROM usuarios WHERE id = ?", id);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


//Login
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT * FROM usuarios WHERE correo = ? AND contrasenia = ? AND estado = ?", [username, password, estado]);
        if (result.length > 0) {
            const token = generateToken(result[0].id);
            res.status(200).json({ token, result });
        } else {
            res.status(401).json({ message: "Correo o contraseña incorrectos" });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}



//Insercion
const addUsuarios = async (req, res) => {
    try {
        const { nombres, apellidos, correo, contrasenia, rol } = req.body;

        const usuariosProps = { nombres, apellidos, correo, contrasenia, rol, 'estado': true }
        const [result] = await getConnection.query("INSERT INTO usuarios SET ?", usuariosProps);
        res.json(result);

    } catch (error) {
        res.status(500).send(error.message);
    }
}

//Actualizacion
const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, apellidos, correo, contrasenia, rol } = req.body;

        const usuariosProps = { nombres, apellidos, correo, contrasenia, rol, 'estado': true }

        const [result] = await getConnection.query("UPDATE usuarios SET ? WHERE id = ?", [usuariosProps, id]);
        
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


//Eliminacion
const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const estado = false;
        const [result] = await getConnection.query("UPDATE usuarios SET estado = ? WHERE id = ? ", [estado, id]);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export const validarUsuarioExistente = async (req, res) => {
    const { correo, contrasenia } = req.body;
  
    try {
      const usuarioExistente = await Usuario.findOne({
        correo,
        contrasenia,
      });
  
      if (usuarioExistente) {
        return res.status(200).json({ existente: true });
      } else {
        return res.status(200).json({ existente: false });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error al verificar usuario existente" });
    }
  };



export const methods = {
    getUsuarios,
    getUsuario,
    addUsuarios,
    deleteUsuario,
    updateUsuario,
    loginUser,
    validarUsuarioExistente
}
