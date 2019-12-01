let express = require("express");
let users = require("../db/newUserSchema");
let Router = express.Router();
let Joi = require("@hapi/joi");
let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");
let auth = require("../Middleware/userAuthToken");
let admin = require("../Middleware/Admin");
let crypto = require("crypto");
let mailer = require("nodemailer");

// get all users
Router.get("/users/", async (req, res) => {
  let userID = await users.find();
  res.send(userID);
});

Router.post("/Registration", async (req, res) => {
  let { error } = ValidationError(req.body);
  if (error) {
    return res.status(403).send(error.details[0].message);
  }
  let existingUser = await users.findOne({
    "userLogin.userEmail": req.body.userLogin.userEmail
  });
  if (existingUser) {
    return res.status(403).send({ message: "User Alredy Registered!" });
  }
  let data = new users({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    newsLetterCheck: req.body.newsLetterCheck,
    userLogin: {
      userEmail: req.body.userLogin.userEmail,
      userPassword: req.body.userLogin.userPassword
    },
    termsAcceptCheck: req.body.termsAcceptCheck,
    recordDate: Date.now(),
    updateddate: Date.now()
  });
  let salt = await bcrypt.genSalt(10);
  data.userLogin.userPassword = await bcrypt.hash(
    data.userLogin.userPassword,
    salt
  );
  let result = await data.save();
  let token = result.GenerateNewToken();
  res
    .header("x-auth-token", token)
    .send({ message: "Registration Successful", data: result, token: token });
});

//Register and send mail
Router.post("/RegisterandMail", async (req, res) => {
  let { error } = ValidationError(req.body);
  if (error) {
    return res.status(403).send(error.details[0].message);
  }
  let existingUser = await users.findOne({
    "userLogin.userEmail": req.body.userLogin.userEmail
  });
  if (existingUser) {
    return res.status(403).send({ message: "User Alredy Registered!" });
  }
  let data = new users({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    newsLetterCheck: req.body.newsLetterCheck,
    userLogin: {
      userEmail: req.body.userLogin.userEmail,
      userPassword: req.body.userLogin.userPassword
    },
    termsAcceptCheck: req.body.termsAcceptCheck,
    recordDate: Date.now(),
    updateddate: Date.now()
  });
  let salt = await bcrypt.genSalt(10);
  data.userLogin.userPassword = await bcrypt.hash(
    data.userLogin.userPassword,
    salt
  );
  let result = await data.save();
  let userRegToken = crypto.randomBytes(32).toString("hex");
  result.sendConfirmationMail = userRegToken;
  let token = result.GenerateNewToken();
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
    to: result.userLogin.userEmail, // list of receivers
    subject: "Thankyou For Registering!", // Subject line:smile:
    text: "Hey there New User!, Heres your unique ID:" + userRegToken // plain text body
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
  res.header("x-auth-token", token).send({
    message: "Registration Successful, Mail sent!",
    data: result,
    token: token
  });
});

// delete users
Router.delete("/deleteUsers/:id", [auth, admin], async (req, res) => {
  let data = await users.findByIdAndRemove(req.params.id);
  if (!data) {
    return res.status(404).send({ message: "User ID not found" });
  }
  res.send({ message: "User Deleted successfully" });
});
function ValidationError(error) {
  let Schema = Joi.object({
    firstname: Joi.string()
      .required()
      .min(2)
      .max(20),
    lastname: Joi.string()
      .required()
      .min(2)
      .max(20),
    newsLetterCheck: Joi.boolean(),
    userLogin: {
      userEmail: Joi.string()
        .required()
        .email(),
      userPassword: Joi.string().required()
    },
    isAdmin: Joi.boolean(),
    termsAcceptCheck: Joi.boolean().required(),
    recordDate: Joi.date().default(Date.now()),
    updatedDate: Joi.date().default(Date.now())
  });
  return Schema.validate(error);
}

module.exports = Router;
