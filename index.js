const express = require("express");
const fileUpload = require("express-fileupload");

const app = express();
require("dotenv").config;

const productRoute = require("./routes/product.route");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(fileUpload());

// Cấu hình express-fileupload
app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
    debug: true,
  })
);

// Cấu hình thư mục public cho Vercel
app.use(express.static(path.join(__dirname, "public")));

// call route
productRoute(app);
// port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running");
});
