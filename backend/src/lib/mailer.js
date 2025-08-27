import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // SOLO PARA DESARROLLO
  },
});

export const sendResetEmail = async (to, resetLink, name) => {
  const mailOptions = {
    from: `"StartupMatch" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Reset your password",
    html: `<p>Hi ${name},</p>
           <p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
  };

  await transporter.sendMail(mailOptions);
};