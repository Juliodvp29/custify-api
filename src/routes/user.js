import User from "../models/User.js";
import { Router } from 'express';
const router = Router();

// getAll
  router.get("/getAll", async (req, res) => {
    try {
      const users = await find();
      res.json({status: 'success', users});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener los usuarios" });
    }
  }),

  // getById
   router.get("/:id", async (req, res) => {
    try {
      const user = await findById(req.params.id);
      if (!user) {
        return res.status(404).json({ status: 'error', message: "Usuario no encontrado" });
      }
      res.json({status: 'success', user});
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: "Error al obtener el usuario" });
    }
  }),

  // create
  router.post("/create", async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10); // Generar un salt aleatorio
      const hashedPassword = await bcrypt.hash(req.body.password, salt); // Generar un hash de la contraseña
      const user = new User({
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,
          level: req.body.level
      });
      await user.save();
      res.json({status: 'success', user});
  } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: "Error al crear el usuario" });
  }
  }),

  // update
  router.put('/update/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const user = await findById(id);
  
      if (!user) {
        return res.status(404).json({ status: 'error', message: "Usuario no encontrado" });
      }
  
      const { username, email, password, level } = req.body;
      user.username = username || user.username;
      user.email = email || user.email;
  
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
  
      user.level = level || user.level;
      await user.save();
      res.json({status: 'success', user});
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: "Error al actualizar el usuario" });
    }
  }),

  // delete 
  router.delete('delete/:id', async (req, res) => {
    try {
      const user = await findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({status: 'error', message: "Usuario no encontrado" });
      }
      res.json({status: 'success', user});
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: "Error al eliminar el usuario" });
    }
  })


  export default router


  