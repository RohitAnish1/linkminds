const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass,
  },
});
exports.sendMatchEmail = functions.https.onCall(async (data, context) => {
  const {recipientEmail, subject, message} = data;
  const mailOptions = {
    from: functions.config().email.user,
    to: recipientEmail,
    subject: subject,
    text: message,
  };
  try {
    await transporter.sendMail(mailOptions);
    return {success: true};
  } catch (error) {
    console.error("Error sending email:", error);
    throw new functions.https.HttpsError("internal", "Unable to send email");
  }
});
