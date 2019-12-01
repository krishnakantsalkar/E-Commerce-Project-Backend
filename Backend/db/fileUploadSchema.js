let mongoose = require("mongoose");

let fileUploadSchema = new mongoose.Schema({
  image: { type: String, required: true }
});

let fileUpload = mongoose.model("File Uploads", fileUploadSchema);

module.exports = fileUpload;
