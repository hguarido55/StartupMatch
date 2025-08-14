import FriendRequest from "../models/FriendRequest.js";
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
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error al cargar usuarios recomendados", error.message);
        res.status(500).json({ message: "Error en la recomendación de usuarios" });
    }
};

export async function getMyFriends (req, res) {
    try {
        const user = await User.findById(req.user.id).select("friends")
        .populate("friends","fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error al cargar los usuarios amigos", error.message);
        res.status(500).json({ message: "Error interno al cargar los amigos" });
    }
};

export async function sendFriendRequest (req, res) {
    try {
        const myId = req.user.id;
        const { id:recipientId } = req.params; // ID del recipiente, obtenido del id de la ruta: /friend-request/:id

        // Comprobar que la solicitud de amistad no sea al propio usuario
        if(myId === recipientId) {
            return res.status(400).json({ message: "Error - No puedes enviar una solicitud de amistad a ti mismo" });
        }

        // Comprobar si el ID del recipiente existe en MongoDB
        const recipient = await User.findById(recipientId);
        if(!recipient) {
            return res.status(404).json({ message: "Error - Usuario recipiente no encontrado" });
        }

        // Comprobar si el recipiente ya es amigo del usuario
        if(recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "Error - Ya eres amigo de este usuario" });
        }

        // Comprobar si ya existe una solicitud de amistad entre los usuarios
        const existingRequest = await FriendRequest.findOne({
            $or: [
                {sender: myId, recipient: recipientId},
                {sender: recipientId, recipient: myId},
            ],
        });

        if(existingRequest) {
            return res.status(400).json({ message: "Ya existe una solicitud de amistad entre estos usuarios" });
        }

        // Creamos la solicitud de amistad y la guardamos en MongoDB
        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(201).json(friendRequest);

    } catch (error) {
        console.error("Error al procesar la solicitud de amistad", error.message);
        return res.status(500).json({ message: "Error en el procesamiento de la solicitud de amistad" });
    }
};

export async function acceptFriendRequest (req, res) {
    try {
        const {id:requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest) {
            return res.status(404).json({ message: "No se encontró la solicitud de amistad" });
        }

        // Comprobar que el ID de la solicitud de amistad coincide con el ID del usuario aceptandola
        if(friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "No estas autorizado para aceptar esta solicitud de amistad" });
        }

        // Cambiamos el estado de la solicitud de amistad a 'accepted' y guardamos en MongoDB
        friendRequest.status = "accepted";
        await friendRequest.save();

        // Añadimos el ID de los usuarios en el array de amigos de cada uno
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient},
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender},
        });

        res.status(200).json({ message: "Solicitud de amistad aceptada" });

    } catch (error) {
        console.error("Error al aceptar la solicitud de amistad", error.message);
        return res.status(500).json({ message: "Error - No se pudo aceptar la solicitud de amistad" });
    }
};

// Página de notificaciones con solicitudes de amistad pendientes y aceptadas
export async function getFriendRequests (req, res) {
    try {
        // Obtenemos todas las solicitudes de amistad en estado pendiente y la información de cada usuario
        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        // Obtenemos todas las solicitudes de amistad en estado aceptado y la información de cada usuario
        const acceptedReqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "accepted"
        }).populate("sender", "fullName profilePic");

        res.status(200).json({ incomingReqs, acceptedReqs});
    } catch (error) {
        console.log("Error al cargar las solicitudes de amistad", error.message);
        res.status(500).json({ message: "Error con las solicitudes de amistad" });
    }
};