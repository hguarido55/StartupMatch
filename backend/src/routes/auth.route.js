import express from "express";

const router = express.Router();

// Definimos rutas de autenticación
router.get("/api/auth/signup", (req, res) => {
    res.send("Registro");
});

router.get("/api/auth/login", (req, res) => {
    res.send("Login");
});

router.get("/api/auth/logout", (req, res) => {
    res.send("Logout");
});

export default router