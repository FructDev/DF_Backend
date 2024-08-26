import express from "express";
import {
  registerDevice,
  getDeviceByIMEI,
} from "../controllers/deviceController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

// Ruta para registrar dispositivo, solo accesible para usuarios aprobados
router.post(
  "/register",
  authMiddleware,
  [
    body("modelo").notEmpty().withMessage("Modelo es obligatorio"),
    body("color").notEmpty().withMessage("Color es obligatorio"),
    body("imei").notEmpty().withMessage("IMEI es obligatorio"),
    body("recompensa").isNumeric().withMessage("Recompensa debe ser un número"),
    body("descripcion").notEmpty().withMessage("Descripción es obligatoria"),
  ],
  registerDevice
);

// Ruta para buscar dispositivo por IMEI
router.get("/search/:imei", getDeviceByIMEI);

export default router;
