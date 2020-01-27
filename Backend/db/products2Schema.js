let mongoose = require("mongoose");
let subCategorySchemaData = new mongoose.Schema({
  name: { type: String }
});
let categorySchema = new mongoose.Schema({
  categoryName: { type: String },
  subCategory: [subCategorySchemaData]
});

let product2SchemaData = new mongoose.Schema({
  id: { type: Number },
  name: { type: String, max: 20 },
  description: { type: String },
  quantity: { type: Number },
  price: { type: Number },
  offerPrice: { type: Number },
  isAvailable: { type: Boolean },
  isTodayOffer: { type: Boolean },
  category: [categorySchema],
  isAdmin: { type: Boolean },
  recordDate: { type: Date, default: Date.now() },
  updatedDate: { type: Date, default: Date.now() }
});

let productSchema = mongoose.model("Products2", product2SchemaData);

module.exports = productSchema;
