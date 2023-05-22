const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
require("dotenv").config();
const productRoute = require("./routes/product.route");
const userRoute = require("./routes/user.route");
const categoryRoute = require("./routes/category.route");
const multer = require("multer");

// Cấu hình multer
const upload = multer();

// Sử dụng multer cho các yêu cầu có Content-Type là form-data
app.use(upload.any());

// cors
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
// bật cors toàn bộ resquest
app.use(cors());
//
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// tăng giới hạn kích thước dữ liệu cho form-data
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// call route
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", categoryRoute);

// port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running");
});