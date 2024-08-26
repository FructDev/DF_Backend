import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);

    if (!user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    if (!user.isApproved) {
      return res
        .status(403)
        .json({ message: "Usuario no aprobado por un administrador" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export default authMiddleware;
