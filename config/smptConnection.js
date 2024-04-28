import nodemailer from "nodemailer";

let transporter = undefined;

function connect() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTPServerURL,
      port: process.env.SMTPPort,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTPUsername,
        pass: process.env.SMTPPassword,
      },
    });
  }
  return transporter;
}

export default connect;
