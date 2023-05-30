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
router.get("/productdesc", ProductControler.getProductDesc);
router.get("/productcategory/:id", ProductControler.getProductByCategoryById);
router.post("/search", ProductControler.getSearch);
//
router.get("/wishlist/:id", ProductControler.getWishListByUserId);
router.post("/wishlist", ProductControler.postWishList);
router.delete("/wishlist/:id", ProductControler.deleteWishList);
module.exports = router;
