import express from "express";
import { forgotPassword, login, logout, onboard, resetPassword, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Definimos rutas de autenticación
router.post("/signup", signup); 
router.post("/login", login);
router.post("/logout", logout);

// Ruta de onboarding page protegida por middleware
router.post("/onboarding", protectRoute, onboard);

// Recuperación de contraseñas
router.post("/forgot-password", forgotPassword);
router.post("/reset-password:token", resetPassword);

// Ruta para devolver datos del usuario autenticado
router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

export default router;