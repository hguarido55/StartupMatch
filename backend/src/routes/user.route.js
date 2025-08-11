import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Usamos el middleware para todas las rutas definidas en este archivo
router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

export default router;