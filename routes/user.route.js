const express = require("express");
const UserController = require("../controllers/UserControler");
const uploadCloud = require("../middlewares/uploadUser");
const upload = require("../middlewares/uploadCoverImage");
const router = express.Router();

router.get("/user", UserController.get);
router.get("/user/:id", UserController.getUserById);
router.delete("/user/:id", UserController.deleteuser);
router.put("/user/:id", UserController.updateUser);
router.patch("/user/:id", UserController.updateUser);
router.put(
  "/avatar/:id",
  uploadCloud.single("file"),
  UserController.updateAvatar
);
router.patch(
  "/avatar/:id",
  uploadCloud.single("file"),
  UserController.updateAvatar
);
router.put(
  "/coverimage/:id",
  upload.single("file"),
  UserController.updateCoverImage
);
router.patch(
  "/coverimage/:id",
  upload.single("file"),
  UserController.updateCoverImage
);
router.get("/coverimage/:id", UserController.getCoverImage);

router.put("/changepass/:id", UserController.updatePassword);
router.patch("/changepass/:id", UserController.updatePassword);
router.post("/register", UserController.register);
router.post("/login", UserController.login);

module.exports = router;
