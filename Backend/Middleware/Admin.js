let express = require("express");
let db = require("../db/newUserSchema");
async function Admin(req, res, next) {
  let adminData = await db.findOne({ isAdmin: req.newUserSchema.isAdmin });
  if (!adminData) {
    return res
      .status(403)
      .send({ message: "Access Denied , You are not an Admin" });
  }
  next();
}
module.exports = Admin;
