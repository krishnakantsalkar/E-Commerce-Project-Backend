//Basic Setup
let express = require("express");
let app = express();
let mongoose = require("mongoose");
let morgan = require("morgan");
let port = process.env.PORT || 4500;
process.env.NODE_CONFIG_DIR = "./config";
let config = require("config");
let path = require("path");
app.use(express.json());
app.use(morgan("tiny"));

console.log(`production: ${process.env.NODE_ENV}`);
console.log(`development: ${app.get("env")}`);
console.log(`development: ${config.get("info")}`);
console.log(`production: ${config.get("info")}`);
console.log(`production: ${config.get("Secret")}`);
if (process.env.NODE_ENV === "production") {
  console.log(`production: ${config.get("user")}`);
  console.log(`password: ${config.get("password")}`);
}

//set enviornment password
if (!config.get("Secret")) {
  console.log("FATAL ERROR :Set enviornment key first");
  process.exit(1);
}

//E-commerce Project
let users = require("./Routes/newUsersRegistration");
let login = require("./Routes/newUsersLogin");
let products = require("./Routes/products");
let mailer = require("./Routes/mailer");
let forgot = require("./Routes/forgotpassword");
let imageUpload = require("./Routes/fileUploads");
let cart = require("./Routes/cart");
let contact = require("./Routes/contact-us");

//E-commerce Project Allowed Routes
app.use("/api/users/", users);
app.use("/api/login/", login);
app.use("/api/products", products);
app.use("/api/", mailer);
app.use("/api/forgot/", forgot);
app.use("/uploads", express.static(__dirname + "./uploads"));
app.use("/api/file", imageUpload);
app.use("/cartUploads", express.static(__dirname + "./uploads/cartUploads"));
app.use("/api/cart", cart);
app.use("/api/contact", contact);

//Mongo DB connection
mongoose
  .connect("mongodb://localhost/MongooseDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log(`connection successfull to the Database`))
  .catch(ex => console.log(`something went wrong ${ex.message}`));

app.listen(port, () => console.log(`connection successful to ${port}`));
