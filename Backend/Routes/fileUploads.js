let express = require("express");
let Router = express.Router();
let path = require("path");
let fileModel = require("../db/fileUploadSchema");
let multer = require("multer");
let pathDir = path.join(__dirname, "../uploads");
let port = "http://localhost:4500/";

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, pathDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

let fileFilter = function(req, file, cb) {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
let fileStorage = multer({
  storage: storage,
  limits: { fileSize: 1400 * 1024 * 5 },
  fileFilter: fileFilter
});

Router.post("/fileUpload", fileStorage.single("image"), async (req, res) => {
  try {
    let data = new fileModel({
      image: port + "uploads/" + req.file.filename
    });
    console.log(data);
    if (!data) {
      return res.status(403).send({ message: "File not found" });
    }
    let savedImages = await data.save();
    res.send({ message: "Image Stored Successfully", data: savedImages });
  } catch (ex) {
    res.send(ex.message);
  }
});

Router.get("/getFiles", async (req, res) => {
  try {
    let getFilesData = await fileModel.find();
    res.send(getFilesData);
  } catch (ex) {
    res.send(ex.message);
  }
});
module.exports = Router;
