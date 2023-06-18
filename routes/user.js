const router = require("express").Router();
const userController = require("../controllers/userController");
const {
  verifyTokenAndAuthorization,
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");

// UPDATE USER

router.put("/:id", verifyTokenAndAuthorization, userController.updateUser);

// DELETE USER
router.delete("/:id", verifyTokenAndAuthorization, userController.deleteUser);

// GET USER
router.get("/find/:id", verifyTokenAndAuthorization, userController.getUser);

// GET ALL USERS
router.get("/", verifyTokenAndAdmin, userController.getAllUsers);

module.exports = router;
