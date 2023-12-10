const express = require("express");
const CategoryController = require("../controllers/CategoryController");
const upload = require("../middlewares/uploadCategory");
const router = express.Router();

router.get("/category", CategoryController.get);
router.post("/category", upload.single("file"), CategoryController.store);
router.delete("/category/:id", CategoryController.delete);
router.put("/category/:id", upload.single("file"), CategoryController.update);
router.patch("/category/:id", upload.single("file"), CategoryController.update);
// get product by category_id orderby price desc paginate
router.post("/pricedesc/:id", CategoryController.getProductPriceDesc);
// get product by category_id orderby price asc
router.post("/priceasc/:id", CategoryController.getProductPriceAsc);
// get product by category_id orderby id desc
router.post("/iddesc/:id", CategoryController.getProductIdDesc);
// get product by category_id orderby id asc
router.post("/idasc/:id", CategoryController.getProductIdAsc);

module.exports = router;
