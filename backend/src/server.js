import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

// Cargar variables de entorno del archivo .env
dotenv.config();

// Puerto
const PORT=process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());

// Rutas de autenticación
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor abierto en el puerto ${PORT}`);
    connectDB();
});