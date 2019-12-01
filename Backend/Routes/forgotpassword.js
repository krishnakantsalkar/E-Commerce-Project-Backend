let express = require("express");
let Router = express.Router();
let users = require("../db/newUserSchema");
let bcrypt = require("bcryptjs");
let crypto = require("crypto");
let Joi = require("@hapi/joi");

Router.post("/forgotPassword/:id", async (req, res) => {
  try {
    let data = await users.findOne({
      resetPasswordToken: req.params.id
      // resetPasswordExpires: { $gt: Date.now() }
    });
    if (!data) {
      return res.status(404).send({ message: "Token not found" });
    }
    let { error } = ValidationError(req.body);
    if (error) {
      return res.status(403).send(error.details[0].message);
    }
    console.log(user.UserLogin.userPassword);
    console.log(req.body.UserLogin.userPassword);
    let comparepassword = bcrypt.compare(
      user.userLogin.userPassword,
      req.body.userLogin.userPassword
    );
    console.log(comparepassword);
    if (comparepassword) {
      return res
        .status(403)
        .send({ message: "New password can't be Old Password" });
    }
    let salt = bcrypt.genSalt(10);
    users.userLogin.userPassword = await bcrypt.hash(
      req.body.userLogin.userPassword,
      salt
    );
    users.userResetPasswordToken = undefined;
    users.userResetPasswordExpires = undefined;
    let newPassword = await data.save();
    res.send({ message: "Password Changed Successfully!", data: newPassword });
  } catch (ex) {
    res.send(ex.message);
  }
});

function ValidationError(error) {
  let Schema = Joi.object({
    userLogin: {
      userPassword: Joi.string().required()
    }
  });
  return Schema.validate(error);
}

module.exports = Router;
