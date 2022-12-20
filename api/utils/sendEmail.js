const nodemailer = require("nodemailer");

async function send_mail(to, subject, text) {
  // to ="hayelomkiros20@gmail.com";

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true, // port for secure SMTP
    auth: {
      user: "randompurposeid02@gmail.com",
      pass: "GYWnshmCvI92JPUz",
    },
  });

  const msg = {
    // from: config.email.from,
    from: "no-reply@audioturn.com",
    to,

    subject,
    html: `</br><p>${text} <p>`,
  };
  // console.log("====================================");
  console.log(msg);
  // console.log("====================================");

  transporter.sendMail(msg, function (error, result) {
    if (error) {
      console.log("error:", error);
    } else {
      // console.log("result:", result);
      console.log("email connected");
    }
    transporter.close();
  });
}
const sendResetPasswordEmail = async (to, token) => {
  const subject = "Reset password code ";
  // replace this url with the link to the reset password page of your front-end app
  // const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;

  // const resetPasswordUrl = `${process.env.CLIENT_URL}/createpassword?token=${token}`;
  //   const text = `Dear user,
  // To reset your password, click on this link: ${resetPasswordUrl} and fill the above code
  // If you did not request any password resets, then ignore this email.`;
  const text = `Dear user,
  To reset your password,use this code: ${token}`;
  await send_mail(to, subject, text);
};
module.exports = {
  // transport,

  sendResetPasswordEmail,
};
