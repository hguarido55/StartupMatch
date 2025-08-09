import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Lógica de funciones de autenticación (registro, login, logout)

export async function signup(req, res) {
    // Captamos los datos enviados por el cliente en formato JSON
    const {email, password, fullName} = req.body;

    // Comprobamos posibles errores
    try {
        if(!email || !password || ! fullName) {
            return res.status(400).json({ message: "Rellena todos los campos" });
        }

        if(password.length < 6) {
            return res.status(400).json({ message: "La contraseña debe tener como mínimo 6 caracteres" });
        }

        // Formato de email válido
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Formato de email inválido" });
        }

        // Si el usuario ya existe ('email' es 'unique' en models/User.js)
        const usuarioExiste = await User.findOne({ email });
        if(usuarioExiste) {
            return res.status(400).json({ message: "El email introducido ya tiene cuenta asociada" });
        }

        // Generamos un número de 1 a 100 y generamos una foto de perfil aleatoria usando 'Avatar Placeholder'
        const random = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${random}.png`;

        // Creamos el nuevo usuario en MongoDB con los campos necesarios
        const nuevoUsuario = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
        });

        // JWT
        const token = jwt.sign({userID:nuevoUsuario._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        // Éxito
        res.status(201).json({ success: true, user: nuevoUsuario});

    } catch (error) {
        console.log("Error en el registro de usuario", error);
        res.status(500).json({ message: "Error al registrar usuario" })
    }
}

export async function login(req, res) {
    res.send("Login");
}

export function logout(req, res) {
    res.send("Logout");
}