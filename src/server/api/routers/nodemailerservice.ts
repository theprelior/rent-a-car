import { createTransport } from "nodemailer";
import { env } from "~/env.js";

// Bu transporter'ı artık projenin her yerinden import edip kullanabiliriz.
export const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: env.GMAIL_EMAIL,
    pass: env.GMAIL_APP_PASSWORD,
  },
});