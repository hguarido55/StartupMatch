import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Definimos la estructura de cada documento de los usuarios
const userSchema = new mongoose.Schema({
    fullName:{type: String, required: true},
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true, minlength: 6},
    bio: {type: String, default: ""},
    profilePic: {type: String, default: ""},
    nativeLanguage: {type: String, default: ""},
    learningLanguage: {type: String, default: ""},
    location: {type: String, default: ""},
    isOnboarded: {type: Boolean, default: false},
    friends: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema); // Creamos la colección User con la estructura de userSchema

// Hashear contraseña de usuarios antes de guardar en MongoDB
userSchema.pre("save", async function(next) {
    // Si la contraseña no fue modificada, continuar sin hacer nada
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);

        // Hashear la contraseña usando la sal generada
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

export default User; // Habilitamos el uso de User en otros archivos