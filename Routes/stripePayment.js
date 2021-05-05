const express = require("express");
const router = express.Router();
const { makePayment } = require("../Controllers/stripePayment");

router.post("/stripePayment", makePayment);

module.exports = router;
