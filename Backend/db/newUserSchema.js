let mongoose = require("mongoose");
let jwt = require("jsonwebtoken");
let config = require("config");

let newUserSchemaData = new mongoose.Schema({
  firstname: { type: String, required: true, minlength: 2, maxlength: 20 },
  lastname: { type: String, required: true, minlength: 2, maxlength: 20 },
  newsLetterCheck: { type: Boolean },
  isAdmin: { type: Boolean },
  userLogin: {
    userEmail: { type: String },
    userPassword: { type: String }
  },
  termsAcceptCheck: { type: Boolean },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  sendConfirmationMail: { type: String },
  recordDate: { type: Date, default: Date.now() },
  updatedDate: { type: Date, default: Date.now() }
});

newUserSchemaData.methods.GenerateNewToken = function() {
  let token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("Secret")
  );
  return token;
};
let newUserSchema = mongoose.model("New Users", newUserSchemaData);

module.exports = newUserSchema;
