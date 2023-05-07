const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config;

const productRoute = require("./routes/product.route");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// tăng giới hạn kích thước dữ liệu cho form-data
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// call route
app.use("/api/v1", productRoute);
// port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running");
});
