const express = require("express");
const OrderController = require("../controllers/OrderController");
const router = express.Router();

router.get("/order", OrderController.get);
router.get("/order/:id", OrderController.getOrderById);
router.post("/order", OrderController.postOrder);
router.put("/order/:id", OrderController.updateOrderById);
router.delete("/order/:id", OrderController.deleteOrder);

module.exports = router;
