const express = require("express");
const CommentController = require("../controllers/CommentController");
const router = express.Router();

router.get("/comment/:id", CommentController.get);
router.get("/count/:id", CommentController.countcomment);
router.post("/comment", CommentController.post);

module.exports = router;
