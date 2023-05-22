const express = require("express");
const CategoryController = require("../controllers/CategoryController");
const upload = require("../middlewares/uploadCategory");
const router = express.Router();

router.get("/category", CategoryController.get);
router.post("/category", upload.single("file"), CategoryController.store);
router.delete("/category/:id", CategoryController.delete);
router.put("/category/:id", upload.single("file"), CategoryController.update);
router.patch("/category/:id", upload.single("file"), CategoryController.update);

module.exports = router;
