import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendResetEmail } from "../lib/mailer.js";

// Lógica de funciones de autenticación (registro, login, logout)

export async function signup(req, res) {
    // Captamos los datos enviados por el cliente en formato JSON
    const {email, password, fullName} = req.body;

    // Comprobamos posibles errores
    try {
        if(!email || !password || ! fullName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if(password.length < 6) {
            return res.status(400).json({ message: "The password must contain at least 6 characters" });
        }

        // Formato de email válido
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Si el usuario ya existe ('email' es 'unique' en models/User.js)
        const usuarioExiste = await User.findOne({ email });
        if(usuarioExiste) {
            return res.status(400).json({ message: "This email is already being used" });
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

        try {
            await upsertStreamUser({
            id:nuevoUsuario._id.toString(),
            name: nuevoUsuario.fullName,
            image: nuevoUsuario.profilePic || "",
        });
            console.log(`Usuario creado en Stream: ${nuevoUsuario.fullName}`);
        } catch (error) {
            console.log("Error al crear usuario en Stream:", error);
        }

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
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "Rellena todos los campos" });
        }

        // Comprobamos que el email introducido por el usuario existe
        const usuario = await User.findOne({ email });
        if(!usuario) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Comprobamos que la contraseña introducida por el usuario existe
        const existeContrasena = await usuario.matchPassword(password);

        if(!existeContrasena) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // A partir de aqui el usuario ha introducido correctamente sus credenciales
        const token = jwt.sign({userID:usuario._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        // Éxito
        res.status(200).json({ success: true, user: usuario});

    } catch (error) {
        console.log("Error al iniciar sesión", error.message);
        res.status(500).json({ success: false, message: "Error al iniciar sesión" });
    }
}

export function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "Cierre de sesión exitoso" })
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }

    // Actualizar información de onboarding de usuario en Stream
    try {
        await upsertStreamUser({
            id: updatedUser._id.toString(),
            name: updatedUser.fullName,
            image: updatedUser.profilePic,
        });
    } catch (streamError) {
        console.log("Error al actualizar el usuario en Stream:", streamError.message);
    }

    // Éxito
    res.status(200).json({ success: true, user: updatedUser });
    
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    // Crear token y expiración
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 3600000; // 1 hora

    await user.save();

    const resetLink = `http://localhost:5005/reset-password/${token}`;

    // Enviar email usando nodemailer
    await sendResetEmail(user.email, resetLink, user.fullName);

    res.status(200).json({ message: "Verification email sent successfully" });
  } catch (error) {
    console.error("Error in forgotPassword controller:", error);
    res.status(500).json({ message: "Unable to send verification email" });
  }
}

export async function resetPassword(req, res) {
    const {token} = req.params;
    const {newPassword} = req.body;

    if(!newPassword) {
        return res.status(400).json({ message: "New password is required" });
    }

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpire: { $gt: Date.now() }
        });

        if(!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        user.resetToken = undefined;
        user.resetTokenExpire = undefined;

        await user.save();
        res.status(200).json({ message: "Password has been changed successfully" });
    } catch (error) {
        console.error("Error in resetPassword controller:", error);
        res.status(500).json({message: "Unable to reset password" });
    }
}