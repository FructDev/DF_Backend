import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    usuario: {
      type: String,
      required: true,
      unique: true,
    },
    correo: {
      type: String,
      required: true,
      unique: true,
    },
    contrasena: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    apellido: {
      type: String,
      required: true,
    },
    direccionTienda: {
      type: String,
      required: true,
    },
    telefonoTienda: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false, // Por defecto, el usuario no está aprobado
    },
    hasPaid: {
      type: Boolean,
      default: false, // Por defecto, el usuario no a pagado
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
