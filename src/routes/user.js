import User from "../models/User.js";
import verifyToken from "./verifyToken.js"
import { Router } from 'express';
import bcrypt from 'bcryptjs';
const router = Router();

// getAll
  router.get("/getAll", verifyToken, async (req, res) => {
    try {
      const users = await User.find();
      res.json({status: 'success', users});
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: "Error al obtener los usuarios" });
    }
  }),

  // getById
   router.get("/:id", verifyToken, async (req, res) => {
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

  // update
  router.put('/update/:id', verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
  
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
  router.delete('delete/:id', verifyToken, async (req, res) => {
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


  