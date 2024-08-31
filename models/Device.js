import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    modelo: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    imei: {
      type: String,
      required: true,
      unique: true,
    },
    recompensa: {
      type: Number,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: { type: String, default: "pendiente" },
  },
  { timestamps: true }
);

const Device = mongoose.model("Device", deviceSchema);

export default Device;
