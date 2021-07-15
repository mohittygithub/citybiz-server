const express = require("express");
const {
  getAllUsers,
  registerUser,
  userLogin,
  deleteUser,
  changeUserPassword,
  testRoute,
} = require("../controllers/userController");
const { isAuth } = require("../utils");

const router = express.Router();

router.get("/", getAllUsers);
router.post("/register", registerUser);
router.post("/login", userLogin);
router.put("/:id", isAuth, changeUserPassword);
router.delete("/:id", isAuth, deleteUser);

module.exports = router;
