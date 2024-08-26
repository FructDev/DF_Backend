import Device from "../models/Device.js";
import { validationResult } from "express-validator";

// Registrar dispositivo
export const registerDevice = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { modelo, color, imei, recompensa, descripcion } = req.body;

  try {
    const device = new Device({
      modelo,
      color,
      imei,
      recompensa,
      descripcion,
      usuario: req.user._id,
    });

    await device.save();
    res
      .status(201)
      .json({ message: "Dispositivo registrado exitosamente", device });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Buscar dispositivo por IMEI
export const getDeviceByIMEI = async (req, res) => {
  const { imei } = req.params;

  try {
    const device = await Device.findOne({ imei });
    if (!device) {
      return res.status(404).json({ message: "Dispositivo no encontrado" });
    }

    res.status(200).json({ device });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};
