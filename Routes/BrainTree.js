const express = require('express');
const router = express.Router();

const { requireSignin, isAuth }  = require("../Controller/AuthController");

const { userById } = require("../Controller/UserController");

const { generateToken, processPayment } = require("../Controller/BrainTreeController");

router.get("/braintree/getToken/:userId", requireSignin, isAuth, generateToken);
router.post("/braintree/payment/:userId", requireSignin, isAuth, processPayment);

router.param("userId", userById);

module.exports = router;
