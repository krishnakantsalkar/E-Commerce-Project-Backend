let mongoose = require("mongoose");

let cartItemSchema = new mongoose.Schema({
  prodID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productSchema",
    required: true
  },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  recordDate: { type: Date, default: Date.now() },
  updatedDate: { type: Date, default: Date.now() }
});

let CartSchema = mongoose.model("User Cart", cartItemSchema);

module.exports = { CartSchema, cartItemSchema };
