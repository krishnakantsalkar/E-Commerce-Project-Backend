let express = require("express");
let Router = express.Router();
let contactDB = require("../db/contactSchema");
let Joi = require("@hapi/joi");
let mailer = require("nodemailer");

Router.post("/contactUS", async (req, res) => {
  let { error } = ValidationError(req.body);
  if (error) {
    return res.status(403).send({ message: "data is incomplete" });
  }
  let data = new contactDB({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });
  let result = await data.save();

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
    from: '"Mercer-Virus,New Project:" <supremegod.of.war.6@gmail.com>', // sender address
    to: result.email, // list of receivers
    subject: "Thank you for Contacting us!", // Subject line:smile:
    text:
      "Thank you for Reaching out to us!, Our personell will contact you soon!" // plain text body
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
  res.send({ message: "message Sent successfully", details: result });
});

function ValidationError(error) {
  let Schema = Joi.object({
    name: Joi.string()
      .required()
      .min(2)
      .max(20),
    email: Joi.string()
      .required()
      .email(),
    message: Joi.string()
  });
  return Schema.validate(error);
}

module.exports = Router;
