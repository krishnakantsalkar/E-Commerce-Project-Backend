let express = require("express");
let Router = express.Router();
let Joi = require("@hapi/joi");
let cartDB = require("../db/cartItemSchema");
let path = require("path");
let pathDir = path.join(__dirname, "../uploads/cartUploads");
let multer = require("multer");
let auth = require("../Middleware/userAuthToken");
let port = "http://localhost:4500/";

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, pathDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});
fileFilter = function(req, file, cb) {
  if (
    file.mimetype === " image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
let cartImageStorage = multer({
  storage: storage,
  limits: { fileSize: 1500 * 1500 * 5 },
  fileFilter: fileFilter
});

Router.post(
  "/addtoCart",
  [auth, cartImageStorage.single("image")],
  async (req, res) => {
    try {
      let { error } = ValidationError(req.body);
      if (error) {
        return res
          .status(403)
          .send({ message: "Data incomplete ,please check" });
      }

      let data = new cartDB({
        cartItem: {
          prodID: req.body.prodID,
          name: req.body.name,
          image: port + "uploads/cartUploads" + req.body.image,
          price: req.body.price,
          quantity: req.body.quantity,
          totalPrice: req.body.totalPrice,
          recordDate: Date.now(),
          updatedDate: Date.now()
        }
      });
      let result = await data.save();
      res.send({ message: "Added to cart successfully", "Your Cart": result });
    } catch (ex) {
      res.send(ex.message);
    }
  }
);

function ValidationError(error) {
  let Schema = Joi.object({
    cartItem: {
      prodID: Joi.string().required(),
      name: Joi.string().required(),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
      totalPrice: Joi.number().required(),
      recordDate: Joi.date(),
      updatedDate: Joi.date()
    }
  });
  return Schema.validate(error);
}

module.exports = Router;
