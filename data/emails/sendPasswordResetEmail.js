import "dotenv/config";
import SMTPConnect from "../../config/smptConnection.js";

import verify from "../../data_validation.js";

async function sendPasswordResetEmail(email, secret) {
  email = verify.email(email);
  secret = verify.UUID(secret);

  const resetdomain = `http://${process.env.SiteDomain}/resetpassword/${secret}`;

  const emailer = await SMTPConnect();
  const message = {
    from: process.env.SMTPEmail,
    to: email,
    subject: `Password reset`,
    text: `Please use the link below to setup new password.

    ${resetdomain}`,

    html: `
    <!doctype html>
    <html>
        <body>
            <p>Please use the link below to setup new password.</p><br>
            <a href="${resetdomain}">Set Password</a><br>
            <br>
            Please use this link if the button is not working: <br><a href="${resetdomain}">${resetdomain}</a>
        </body>
    </html>
    `,
  };
  let messagesent;

  try {
    messagesent = await emailer.sendMail(message);
  } catch (e) {
    // Throw only the response message
    const error = { status: 500, message: e.response };
    throw error;
  }
  if (messagesent.rejected.length) {
    const error = { status: 400, message: "Email rejected" };
    throw error;
  }
  return messagesent;
}

async function notifyOfChangedPassword(email) {
  email = verify.email(email);
  const emailer = await SMTPConnect();

  const message = {
    from: process.env.SMTPEmail,
    to: email,
    subject: `Password Updated`,
    text: `Your password has been changed.`,
    html: `
    <!doctype html>
    <html>
        <body>
            <p>Your password has been changed.</p>
        </body>
    </html>
    `,
  };
  let messagesent;

  try {
    messagesent = await emailer.sendMail(message);
  } catch (e) {
    // Throw only the response message
    const error = { status: 500, message: e.response };
    throw error;
  }
  if (messagesent.rejected.length) {
    const error = { status: 400, message: "Email rejected" };
    throw error;
  }
  return messagesent;
}

export { sendPasswordResetEmail, notifyOfChangedPassword };
