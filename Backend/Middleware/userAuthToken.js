let jwt = require("jsonwebtoken");
let config = require("config");
function userAuth(req, res, next) {
  let token = req.header("x-auth-token");
  if (!token) {
    res.status(403).send({ message: "token not found" });
  }
  let dcode = jwt.verify(token, config.get("Secret"));
  req.newUserSchema = dcode;
  next();
}
module.exports = userAuth;
