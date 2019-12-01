let transporter = mailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "krishnakantsalkar@gmail.com", // generated ethereal user
    pass: "" // <--ADD password here (removed for github upload)
  }
});

if (!transporter)
  res.status(401).send({
    message: "something went wrong"
  });
// setup email data with unicode symbols
let mailOptions = {
  from: '"Mercer-Virus,New Projects:" <krishnakantsalkar@gmail.com>', // sender address
  to: user.userLogin.emailID, // list of receivers
  subject: "Reset Your Password", // Subject line:smile:
  text:
    "open this link to change your password http://localhost:4200/forgotpassword/" +
    token // plain text body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
});
