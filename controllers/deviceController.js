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
    const device = await Device.findOne({ imei }).populate(
      "usuario",
      "usuario nombre apellido telefonoTienda"
    );
    if (!device) {
      return res.status(404).json({ message: "Dispositivo no encontrado" });
    }

    res.status(200).json({ device });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Obtener dispositivos del usuario autenticado
export const getUserDevices = async (req, res) => {
  const userId = req.user._id;

  try {
    const devices = await Device.find({ usuario: userId });
    res.status(200).json({ devices });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los dispositivos" });
  }
};

// Actualizar el estado del dispositivo
export const updateDeviceStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user._id;

  try {
    const device = await Device.findById(id);

    if (!device) {
      return res.status(404).json({ message: "Dispositivo no encontrado" });
    }

    // Verifica si el usuario autenticado es el mismo que registró el dispositivo
    if (device.usuario.toString() !== userId.toString()) {
      return res.status(403).json({
        message:
          "No tienes autorización para cambiar el estado de este dispositivo",
      });
    }

    // Actualiza el estado del dispositivo
    device.status = status;
    await device.save();

    res.status(200).json({
      message: "Estado del dispositivo actualizado correctamente",
      device,
    });
  } catch (error) {
    console.error("Error al actualizar el estado del dispositivo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Delete device
export const deleteDevice = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const device = await Device.findById(id);

        if (!device) {
            return res.status(404).json({ message: "Dispositivo no encontrado" });
        }

        // Verifica si el usuario autenticado es el mismo que registró el dispositivo
        if (device.usuario.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "No tienes autorización para eliminar este dispositivo",
            });
        }

        // Elimina el dispositivo
        await Device.findByIdAndDelete(id);
        
        res.status(200).json({ message: "Dispositivo eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el dispositivo:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

