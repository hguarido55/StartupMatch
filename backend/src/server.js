import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

// Cargar variables de entorno del archivo .env
dotenv.config();

// Puerto
const PORT=process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());

// Rutas
app.use("/api/auth", authRoutes); // Autenticación
app.use("/api/user", userRoutes); // Páginas de usuario
app.use("/api/chat", chatRoutes); // Páginas de chats

app.listen(PORT, () => {
    console.log(`Servidor abierto en el puerto ${PORT}`);
    connectDB();
});