let mongoose = require("mongoose");

let cartItemSchema = {
  prodID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productSchema",
    required: true
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  recordDate: { type: Date, default: Date.now() },
  updatedDate: { type: Date, default: Date.now() }
};

let userCartSchema = mongoose.model("User Cart", cartItemSchema);

module.exports = userCartSchema;
