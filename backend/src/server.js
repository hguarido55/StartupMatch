import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.routes.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// Cargar variables de entorno del archivo .env
dotenv.config();

const app = express();

// Puerto
const PORT=process.env.PORT;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
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