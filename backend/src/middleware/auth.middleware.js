import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if(!token) {
            return res.status(401).json({ message: "Error de autenticación"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if(!decoded) {
            return res.status(401).json({ message: "Error - Token de autenticación inválido" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user) {
            return res.status(401).json({ message: "Error - Usuario no encontrado" });
        }

        req.user = user;

        // Si todos los controles de autenticación se cumplen, llamamos a la siguiente función en la ruta /onboarding, la función 'onboard'
        next();

    } catch (error) {
        console.log("Error en middleware", error);
        res.status(500).json({ message: "Error" });
    }
}