// routes/paymentRoutes.js
import express from "express";
import { body, param, validationResult } from "express-validator";
import User from "../models/User.js"; // Asegúrate de usar la extensión .js

const router = express.Router();

// Ruta para actualizar el estado de pago del usuario
router.patch(
  "/:userId/paid",
  [
    param("userId")
      .isMongoId()
      .withMessage("El ID del usuario no es válido.")
      .custom(async (value) => {
        const user = await User.findById(value);
        if (!user) {
          throw new Error("Usuario no encontrado.");
        }
        return true;
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;

    try {
      // Actualizar el campo hasPaid del usuario a true
      const user = await User.findByIdAndUpdate(
        userId,
        { hasPaid: true },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json({ message: "Estado de pago actualizado", user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
