// import nodemailer from "nodemailer";

// const sendEmail = async (options) => {
//   // Looking to send emails in production? Check out our Email API/SMTP product!
//   const transport = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: false,
//     auth: {
//       user: process.env.SMTP_EMAIL,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });
//   const message = {
//     from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
//     to: options.email,
//     subject: options.subject,
//     html: options.message,
//   };

//   await transport.sendMail(message);
// };

// export default sendEmail;

//---------------------------------updated------------------------------------
// import nodemailer from "nodemailer";

// const sendEmail = async (options) => {
//   // ✅ Create transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: Number(process.env.SMTP_PORT),
//     secure: false, // ✅ required for port 2525 (Mailtrap)
//     auth: {
//       user: process.env.SMTP_EMAIL,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });

//   // ✅ Verify SMTP connection
//   await transporter.verify();
//   console.log("SMTP server connected ✅");

//   // ✅ Email message
//   const message = {
//     from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
//     to: options.email,
//     subject: options.subject,
//     html: options.message,
//   };

//   // ✅ Send email
//   const info = await transporter.sendMail(message);

//   console.log("Email sent successfully ✅");
//   console.log("Message ID:", info.messageId);
// };

// export default sendEmail;

//----------------------updated---------------------------------------------------------------------
import axios from "axios";

const sendEmail = async (options) => {
  console.log(
    "MAILTRAP_API_TOKEN:",
    process.env.MAILTRAP_API_TOKEN ? "Loaded ✅" : "Missing ❌",
  );
  await axios.post(
    "https://sandbox.api.mailtrap.io/api/send/4308263",
    {
      from: {
        email: "noreply@shopit.com",
        name: "ShopIT",
      },
      to: [{ email: options.email }],
      subject: options.subject,
      html: options.message,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.MAILTRAP_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );

  console.log("Email sent successfully ✅");
};

export default sendEmail;

//--------------
