const express = require("express");
const router = express.Router();

const {
  getCategoryById,
  createCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  removeCategory,
} = require("../Controllers/category");
const { getUserById } = require("../Controllers/user");
const { isAuthenticated, isAdmin, isSignedIn } = require("../Controllers/auth");

//Params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//Actual Routes(CRUD)

//create
router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);

//read
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);

//update
router.put(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

//Delete
router.delete(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeCategory
);

module.exports = router;
