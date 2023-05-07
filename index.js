const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
require("dotenv").config;

const productRoute = require("./routes/product.route");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());

// call route
productRoute(app);
// port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running");
});
