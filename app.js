import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import cors  from "cors";

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // Para parsear JSON
app.use(cors())

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
