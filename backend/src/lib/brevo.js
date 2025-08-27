import Brevo from "@getbrevo/brevo";

// Creamos la instancia del cliente Brevo con la API key
const brevoClient = new Brevo.TransactionalEmailsApi({
  apiKey: process.env.BREVO_API_KEY
});

export default brevoClient;