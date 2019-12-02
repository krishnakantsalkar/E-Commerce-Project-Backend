let express = require("express");
let Router = express.Router();
let userCartDB = require("../db/usercartSchema");
let cartitemDB = require("../db/cartItemSchema");
let auth = require("../Middleware/userAuthToken");
let Joi = require("@hapi/joi");

Router.post("/cartbyUser", auth, async (req, res) => {
  try {
    let { error } = ValidationErrorUserCart(req.body);
    if (error) {
      return res.status(403).send(error.details[0].message);
    }
    let cartID = await cartitemDB.findById(req.body.cartItemID);
    if (!cartID) {
      return res.status(403).send({ message: "cart ID not found" });
    }

    let userCartItem = new userCartDB({
      userEmail: req.body.userEmail,
      cartItemID: {
        _id: CartItemId._id,
        prodId: CartItemId.productId,
        quantity: CartItemId.quantity,
        totalPrice: CartItemId.totalPrice,
        recordDate: CartItemId.recordDate,
        updateDate: CartItemId.updateDate
      }
    });
    let result = await userCartItem.save();
    res.send(result);
  } catch (ex) {
    res.send(ex.message);
  }
});

Router.get("/allUserCart", async (req, res) => {
  try {
    let data = await userCartDB.find();
    res.send(data);
  } catch (ex) {
    res.send(ex.message);
  }
});

Router.put("/updateCart/:id", auth, async (req, res) => {
  try {
    let data = await userCartDB.findById(req.params.id);
    if (!data) {
      return res.status(403).send({ message: "invalid ID" });
    }
    data.cartItemID.quantity = req.body.quantity;
    let result = await data.save();
    res.send(result);
  } catch (ex) {
    res.send(ex.message);
  }
});

Router.delete("/removefromCart/:userEmail", auth, async (req, res) => {
  try {
    let data = await userCartDB.findOneAndRemove(req.params.userEmail);
    if (!data) {
      return res.status(404).send({ messge: "Invalid Email id" });
    }
    res.send({ message: "Removed the data" });
  } catch (ex) {
    res.send(ex.message);
  }
});

function ValidationErrorUserCart(error) {
  let Schema = Joi.object({
    userEmail: Joi.string().required(),
    cartItemID: Joi.required()
  });
  return Schema.validate(error);
}

module.exports = Router;
