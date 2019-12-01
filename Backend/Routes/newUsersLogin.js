let express = require("express");
let U = require("../db/newUserSchema");
let Router = express.Router();
let bcrypt = require("bcryptjs");
let Joi = require("@hapi/joi");
let jwt = require("jsonwebtoken");
let auth = require("../Middleware/userAuthToken");

Router.post("/Logon", async (req, res) => {
  let newlogin = await U.findOne({
    "userLogin.userEmail": req.body.userLogin.userEmail
  });
  if (!newlogin) {
    return res.status(403).send({ message: "invalid email id" });
  }
  let { error } = ValidationError(req.body);
  if (error) {
    return res.status(403).send(error.details[0].message);
  }

  let password = await bcrypt.compare(
    req.body.userLogin.userPassword,
    newlogin.userLogin.userPassword
  );
  if (!password) {
    return res.status(403).send({ message: "invalid password" });
  }
  let token = newlogin.GenerateNewToken();
  res
    .header("x-auth-token", token)
    .send({ message: "login successful", token: token });
});

function ValidationError(error) {
  let Schema = Joi.object({
    userLogin: {
      userEmail: Joi.string()
        .required()
        .email(),
      userPassword: Joi.string().required()
    }
  });
  return Schema.validate(error);
}
module.exports = Router;
