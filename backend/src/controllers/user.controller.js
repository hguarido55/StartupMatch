import User from "../models/User.js";

export async function getRecommendedUsers (req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user; // También sirve: await User.findById(currentUserId)

        const recommendedUsers = await User.find({ // Query en MongoDB para devolver usuarios recomendados
            $and: [ // Todas las condiciones tienen que cumplirse
                {_id: {$ne: currentUserId}}, // Descartamos el propio usuario
                {$id: {$nin: currentUser.friends}}, // Descartamos los amigos del usuario
                {isOnboarded: true} // Únicamente usuarios que estan oboarded (han completado la página de información adicional)
            ]
        });
        res.status(200).json({ success: true, recommendedUsers});
    } catch (error) {
        console.error("Error al cargar usuarios recomendados", error.message);
        res.status(500).json({ success: false, message: "Error en la recomendación de usuarios" });
    }
};

export async function getMyFriends (req, res) {

};