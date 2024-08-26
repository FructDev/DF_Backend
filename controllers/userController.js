import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

// Registrar usuario
export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    usuario,
    correo,
    contrasena,
    nombre,
    apellido,
    direccionTienda,
    telefonoTienda,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const user = new User({
      usuario,
      correo,
      contrasena: hashedPassword,
      nombre,
      apellido,
      direccionTienda,
      telefonoTienda,
    });

    await user.save();
    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Login de usuario
export const loginUser = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    if (!user.isApproved) {
      return res.status(403).json({
        message:
          "Usuario no aprobado. Contacte al administrador en admin@example.com",
      });
    }

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    // Verificar si el usuario ha pagado
    if (!user.hasPaid) {
      return res.status(200).json({
        user,
        requiresPayment: true, // Indicador de que el pago es requerido
      });
    }

    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const updatePaymentStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.hasPaid = true;
    await user.save();

    res.status(200).json({ message: "Pago realizado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Aprobar usuario
export const approveUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.isApproved = true;
    await user.save();

    res.status(200).json({ message: "Usuario aprobado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Obtener usuarios pendientes de aprobación
export const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ isApproved: false });
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios pendientes' });
  }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};