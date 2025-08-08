import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";

// Cargar variables de entorno del archivo .env
dotenv.config();

// Puerto
const PORT=process.env.PORT

const app = express();

// Rutas de autenticación
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor abierto en el puerto ${PORT}`);
    connectDB();
});