let express = require("express");
let Router = express.Router();
let Joi = require("@hapi/joi");
let cartDB = require("../db/cartItemSchema");
let path = require("path");
let auth = require("../Middleware/userAuthToken");

Router.post("/addtoCart", auth, async (req, res) => {
  try {
    let { error } = ValidationError(req.body);
    if (error) {
      return res.status(403).send({ message: "Data incomplete ,please check" });
    }

    let data = new cartDB({
      cartItem: {
        prodID: req.body.prodID,
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
});

Router.get("/AllCart", async (req, res) => {
  try {
    let data = await cartDB.find().populate("prodID");
    res.send(data);
  } catch (ex) {
    res.send(ex.message);
  }
});

function ValidationError(error) {
  let Schema = Joi.object({
    cartItem: {
      prodID: Joi.string().required(),
      quantity: Joi.number().required(),
      totalPrice: Joi.number().required(),
      recordDate: Joi.date(),
      updatedDate: Joi.date()
    }
  });
  return Schema.validate(error);
}

module.exports = Router;
