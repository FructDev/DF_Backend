import express from "express";
import {
  registerUser,
  loginUser,
  approveUser,
  getPendingUsers,
  deleteUser, 
  updatePaymentStatus
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

// Ruta para registrar usuario
router.post(
  "/register",
  [
    body("usuario").notEmpty().withMessage("Usuario es obligatorio"),
    body("correo")
      .isEmail()
      .withMessage("Correo es obligatorio y debe ser válido"),
    body("contrasena")
      .isLength({ min: 6 })
      .withMessage("Contraseña debe tener al menos 6 caracteres"),
    body("nombre").notEmpty().withMessage("Nombre es obligatorio"),
    body("apellido").notEmpty().withMessage("Apellido es obligatorio"),
    body("direccionTienda")
      .notEmpty()
      .withMessage("Dirección de tienda es obligatoria"),
    body("telefonoTienda")
      .notEmpty()
      .withMessage("Teléfono de tienda es obligatorio"),
  ],
  registerUser
);

// Ruta para login de usuario
router.post(
  "/login",
  [
    body("correo")
      .isEmail()
      .withMessage("Correo es obligatorio y debe ser válido"),
    body("contrasena").notEmpty().withMessage("Contraseña es obligatoria"),
  ],
  loginUser
);

router.get("/pending", authMiddleware, adminMiddleware, getPendingUsers);

// Ruta para aprobar usuario, solo accesible para admins
router.patch("/approve/:userId", authMiddleware, adminMiddleware, approveUser);

// Eliminar usuario
router.delete('/:userId', deleteUser);

// Ruta para actualizar el estado de pago
router.patch('/users/:userId/paid', updatePaymentStatus);

export default router;
