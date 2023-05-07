const express = require("express");
const ProductControler = require("../controllers/ProductControler");
const uploadCloud = require("../middlewares/uploader");
const router = express.Router();
router.get("/product", ProductControler.get);
router.post("/product", uploadCloud.single("file"), ProductControler.store);

// app
//     .route("/product/:id")
//     .get(ProductControler.detail)
//     .put(ProductControler.update)
//     .patch(ProductControler.update)
//     .delete(ProductControler.delete);
module.exports = router;
