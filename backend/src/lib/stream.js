import {StreamChat} from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret) {
    console.error("API Key o API Secret no existen");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error al crear usuario Stream");
    }
};

export const generateStreamToken = (userId) => {
    try {
        const userIdString = toString(userId);
        return streamClient.createToken(userIdString);
    } catch (error) {
        console.error("Error al generar Stream token:", error);
    }
};