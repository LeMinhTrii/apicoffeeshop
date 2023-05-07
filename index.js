const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const app = express();
require("dotenv").config;

const productRoute = require("./routes/product.route");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());

// Cấu hình express-fileupload

// Cấu hình thư mục public cho Vercel
app.use(express.static(path.join(__dirname, "public")));

// call route
productRoute(app);
// port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running");
});
