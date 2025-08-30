# 🚀 StartupMatch

**StartupMatch** es una aplicación web full-stack creada con **MERN** que conecta a emprendedores, CEOs y equipos de startups con desarrolladores y profesionales interesados en colaborar.  
La plataforma facilita el desarrollo de proyectos conjuntos y la comunicación directa mediante chat y videollamadas.

> ⚠️ **Estado del proyecto:** En desarrollo.

---

## 📌 Características principales

- **Conexión entre usuarios:** Encuentra y contacta con perfiles relevantes para tus proyectos.
- **Autenticación segura:**  
  - JWT (JSON Web Token) para la gestión de sesiones.  
  - `bcrypt` para el hash seguro de contraseñas.  
  - Middleware para validar autenticación
- **Comunicación en tiempo real:** Integración con [getstream.io](https://getstream.io) para chats y videollamadas.
- **Base de datos NoSQL:** MongoDB para almacenamiento de datos de usuarios, proyectos y conversaciones.
- **Despliegue en la nube:** Utiliza [Render](https://render.com) para la puesta en producción.
- **Frontend interactivo:** Construido con React.js para una experiencia de usuario fluida.
- **Backend robusto:** API REST desarrollada con Node.js y Express.
- **Verificación por correo:** Integración con Nodemailer para recuperación de contraseñas mediante correo electrónico

---

## 🛠️ Tecnologías utilizadas

### Frontend
- **React.js** – Framework de JavaScript para construir interfaces de usuario.
- **Tailwind CSS** – Framework CSS utility-first para diseñar interfaces rápidas y personalizables.
- **DaisyUI** – Biblioteca de componentes basada en Tailwind CSS para crear interfaces modernas de forma sencilla.

### Backend
- **Node.js** – Entorno de ejecución de JavaScript en el servidor.
- **Express** – Framework para crear APIs REST rápidas y escalables.
- **MongoDB** – Base de datos NoSQL.
- **Mongoose** – ODM para modelar datos en MongoDB.
- **JWT** – Autenticación basada en tokens.
- **bcrypt** – Encriptación de contraseñas.

### Integraciones y servicios
- **getstream.io (Stream)** – API para chat y videollamadas.
- **Nodemailer** – Testing de correos electrónicos.
- **Render** – Despliegue de la aplicación.

## Pruebas 
- **Postman** - Durante el desarrollo local se utilizó Postman para probar y depurar los endpoints de la API, ejecutando y verificando peticiones HTTP (GET, POST, PUT, DELETE, etc.) de forma rápida antes de su integración con el frontend.

---

🌍 Despliegue
La aplicación está desplegada en Render.
URL de producción: (pendiente de añadir)

---
