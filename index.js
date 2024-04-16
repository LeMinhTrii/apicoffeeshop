const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
require("dotenv").config();
const productRoute = require("./routes/product.route");
const userRoute = require("./routes/user.route");
const categoryRoute = require("./routes/category.route");
const commentRoute = require("./routes/comment.route");
const orderRoute = require("./routes/order.route");
// const multer = require("multer");

// Cấu hình multer
// const upload = multer();

// Sử dụng multer cho các yêu cầu có Content-Type là form-data
// app.use(upload.any());

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
const corsOptions={
  origin:"*",
  optionsSuccessStatus:200
}
app.use(cors(corsOptions));
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
app.use("/api/v1", commentRoute);
app.use("/api/v1", orderRoute);

// port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running");
});
