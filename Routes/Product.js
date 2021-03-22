const express = require('express');
const router = express.Router();

const { create, productById, read, remove, update } = require('../Controller/ProductController');
const { requireSignin, isAuth, isAdmin }  = require("../Controller/AuthController");
const { userById } = require("../Controller/UserController");

router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.get('/product/:productId', read);
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, update);

router.param("userId", userById);
router.param("productId", productById);


module.exports = router;