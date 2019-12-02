let mongoose = require("mongoose");
let cartItemDB = require("./cartItemSchema");

let userCartSchemaData = new mongoose.Schema({
  userEmail: { type: String, required: true },
  cartItemID: { type: cartItemDB.cartItemSchema, required: true }
});

let userCart = mongoose.model("userCart", userCartSchemaData);

module.exports = userCart;
