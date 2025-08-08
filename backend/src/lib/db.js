import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Conexión a MongoDB establecida: ${conn.connection.host}`);
    } catch(error) {
        console.log("Error en la conexión a MongoDB", error);
        process.exit(1);
    }
}