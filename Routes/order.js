const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../Controllers/auth");

const { getUserById, pushOrderInPurchasList } = require("../Controllers/user");

const {
  getOrderById,
  createOrder,
  getAllOrders,
  updateStatus,
  getOrderStatus,
} = require("../Controllers/order");

const { updateStock } = require("../Controllers/product");

//Params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//Actual Routes
//create
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchasList,
  updateStock,
  createOrder
);

//read
router.get(
  "/order/all/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders
);

//status of order
router.get(
  "/order/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);
router.put(
  "/order/:orderId/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateStatus
);

module.exports = router;
