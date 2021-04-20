const express = require("express")
const router = express.Router()

const{getProductById, 
    createProduct, 
    getProduct, 
    photo, 
    deleteProduct, 
    updateProduct, 
    getAllProducts, 
    getAllUniqueCategories} = require("../Controllers/product")

const{isSignedIn, isAuthenticated, isAdmin} = require("../Controllers/auth")

const{getUserById} = require("../Controllers/user")

//All of params
router.param("userId", getUserById)
router.param("productId", getProductById)

//All of actual routes(CRUD)
//Create 
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct)

//Read 
router.get("/product/:productId", getProduct)
router.get("/product/photo/:productId", photo)

//Delete 
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct)

//Update 
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct)

//Listing Route
router.get("/products", getAllProducts)

router.get("/products/categories", getAllUniqueCategories)

module.exports = router