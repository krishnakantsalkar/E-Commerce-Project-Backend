function Admin(req, res, next) {
  if (req.newUserSchema.isAdmin) {
    next();
  } else {
    return res
      .status(403)
      .send({ message: "ACCESS DENIED. You are not Admin" });
  }
}
module.exports = Admin;
