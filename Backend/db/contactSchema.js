let mongoose = require("mongoose");

let contactSchemaData = new mongoose.Schema({
  name: { type: String, required: true, min: 2, max: 20 },
  email: { type: String, required: true },
  message: { type: String }
});

let contactSchema = mongoose.model("Contacts", contactSchemaData);

module.exports = contactSchema;
