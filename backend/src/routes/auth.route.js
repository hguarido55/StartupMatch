import express from "express";
import { login, logout, onboard, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Definimos rutas de autenticación
router.post("/signup", signup); 
router.post("/login", login);
router.post("/logout", logout);

// Ruta de onboarding page protegida por middleware
router.post("/onboarding", protectRoute, onboard);

// Ruta para devolver datos del usuario autenticado
router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

/* 
 FUTURO: Forget password
 FUTURO: Enviar email para restaurar password (Mailtrap)
*/

export default router;