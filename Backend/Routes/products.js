let express = require("express");
let products = require("../db/productSchema"); //mbile phones
let products1 = require("../db/products1Schema"); // computers
let products2 = require("../db/products2Schema"); //Air conditioners
let products3 = require("../db/products3Schema"); // Refrigerators
let db = require("../db/newUserSchema");
let Router = express.Router();
let Joi = require("@hapi/joi");
let auth = require("../Middleware/userAuthToken");
let admin = require("../Middleware/Admin");

//// Products section

// post add products
Router.post("/addProduct", async (req, res) => {
  let { error } = ValidationError(req.body);
  if (error) {
    return res.status(403).send(error.details[0].message);
  }
  let existingProduct = await products.findOne({
    id: req.body.id
  });
  if (existingProduct) {
    return res.status(403).send({ message: "id already exist" });
  }
  let data = new products({
    name: req.body.name,
    id: req.body.id,
    description: req.body.description,
    price: req.body.price,
    offerPrice: req.body.offerPrice,
    isAvailable: req.body.isAvailable,
    isTodayOffer: req.body.isTodayOffer,
    category: {
      categoryName: req.body.category.categoryName,
      subCategory: {
        name: req.body.category.subCategory.name
      }
    },
    recordDate: Date.now(),
    updatedDate: Date.now()
  });
  let result = await data.save();
  res.send({ message: "Product Added successfully", data: result });
});

// get products
Router.get("/getProducts", async (req, res) => {
  let getProductsData = await products.find();
  res.send(getProductsData);
});

//get products by id
Router.get("/getProductsbyID/:id", async (req, res) => {
  let getProductsDatabyID = await products.findById(req.params.id);
  if (!getProductsDatabyID) {
    return res.status(404).send({ message: " Id not found" });
  }
  res.send(getProductsDatabyID);
});

//delete, get product by id and delete
Router.delete("/deleteProductsbyID/:id", [auth, admin], async (req, res) => {
  let deleteProductsDatabyID = await products.findByIdAndDelete(req.params.id);
  if (!deleteProductsDatabyID) {
    return res.status(404).send({ message: "Id not found" });
  }
  res.send({ message: "removed data" });
});

//put ,udpdate product by id
Router.put("/updateProductsbyID/:id", async (req, res) => {
  let updateProduct = await products.findByIdAndUpdate(req.params.id);
  if (!updateProduct) {
    return res.status(404).send({ message: "ID not found" });
  }
  let { error } = ValidationError(req.body);
  if (error) {
    return res.status(403).send(error.details[0].message);
  }
  updateProduct.price = req.body.price;
  let data = await updateProduct.save();
  res.send({ message: "update complete", data: data });
});

// show only offer true products
Router.get("/offerProduct", async (req, res) => {
  let data = await products.find().and({ isTodayOffer: true });
  res.send({ message: "here are today's offers", data: data });
});

//sort by updated date
Router.get("/getLatestProduct", async (req, res) => {
  let data = await products.find().sort("-updatedDate");
  res.send({ message: "lastest updated products", data: data });
});

//// Products 1 section
// get products1
Router.get("/getProducts1", async (req, res) => {
  let getProducts1Data = await products1.find();
  res.send(getProducts1Data);
});

// get products1 by id
Router.get("/getProductsbyID1/:id", async (req, res) => {
  let getProductsDatabyID1 = await products1.findById(req.params.id);
  if (!getProductsDatabyID1) {
    return res.status(404).send({ message: " Id not found" });
  }
  res.send(getProductsDatabyID1);
});

//// Products 2 section
// get products2
Router.get("/getProducts2", async (req, res) => {
  let getProducts2Data = await products2.find();
  res.send(getProducts2Data);
});

// get products2 by id
Router.get("/getProductsbyID2/:id", async (req, res) => {
  let getProductsDatabyID2 = await products2.findById(req.params.id);
  if (!getProductsDatabyID2) {
    return res.status(404).send({ message: " Id not found" });
  }
  res.send(getProductsDatabyID2);
});

//// Products 3 section
// get products3
Router.get("/getProducts3", async (req, res) => {
  let getProducts3Data = await products3.find();
  res.send(getProducts3Data);
});

// get products3 by id
Router.get("/getProductsbyID3/:id", async (req, res) => {
  let getProductsDatabyID3 = await products3.findById(req.params.id);
  if (!getProductsDatabyID3) {
    return res.status(404).send({ message: " Id not found" });
  }
  res.send(getProductsDatabyID3);
});

//Pagination;

Router.get("/:page", async (req, res) => {
  let perPage = 5;
  let currentPage = req.params.page || 1;
  let data = await products
    .find({})
    .skip(perPage * currentPage - perPage)
    .limit(perPage);
  let dataCount = await products.find({}).count();
  let pageSize = Math.ceil(dataCount / perPage);
  res.send({
    perPage: perPage,
    currentPage: currentPage,
    dataSize: data,
    pageSize: pageSize
  });
});

function ValidationError(error) {
  let Schema = Joi.object({
    id: Joi.number(),
    name: Joi.string().max(20),
    description: Joi.string(),
    price: Joi.number(),
    offerPrice: Joi.number(),
    isAvailable: Joi.boolean(),
    isTodayOffer: Joi.boolean(),
    category: {
      categoryName: Joi.string(),
      subCategory: {
        name: Joi.string()
      }
    },
    isAdmin: Joi.boolean(),
    recordDate: Joi.date(),
    updatedDate: Joi.date()
  });
  return Schema.validate();
}

module.exports = Router;
