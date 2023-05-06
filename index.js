const express = require("express");
const app = express();
require("dotenv").config;

const productRoute = require("./routes/product.route");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
productRoute(app);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running");
});