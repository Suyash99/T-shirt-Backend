const express = require("express")
const router = express.Router()

const {getUserById, getUser, updateUser, userPurchaseList} = require("../Controllers/user")
const {isSignedIn, isAuthenticated, isAdmin} = require("../Controllers/auth")

//Param
router.param("userId", getUserById) 

//Create User
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser)

//Update User
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser)

//Create Order for Users
router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList)

module.exports = router