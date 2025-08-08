import express from "express"
import dotenv from "dotenv"

// Cargar variables de entorno del archivo .env
dotenv.config();

// Puerto
const PORT=process.env.PORT

const app = express();

app.get("/api/auth/signup", (req, res) => {
    res.send("Registro");
});

app.get("/api/auth/login", (req, res) => {
    res.send("Login");
});

app.get("/api/auth/logout", (req, res) => {
    res.send("Logout");
});

app.listen(PORT, () => {
    console.log(`Servidor abierto en el puerto ${PORT}`);
});