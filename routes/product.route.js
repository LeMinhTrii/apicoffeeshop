const express = require("express");
const ProductControler = require("../controllers/ProductControler");
const uploadCloud = require("../middlewares/uploader");
const router = express.Router();

router.get("/product", ProductControler.get);
router.post("/product", uploadCloud.single("file"), ProductControler.store);
router.get("/product/:id", ProductControler.detail);
router.put("/product/:id", uploadCloud.single("file"), ProductControler.update);
router.patch(
  "/product/:id",
  uploadCloud.single("file"),
  ProductControler.update
);
router.delete("/product/:id", ProductControler.delete);

module.exports = router;
