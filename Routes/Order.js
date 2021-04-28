const express = require('express');
const router = express.Router();

const { requireSignin, isAuth, isAdmin }  = require("../Controller/AuthController");
const { userById, addOrderToUserHistory } = require("../Controller/UserController");
const { create, orderList, getStatusVales, orderById, updateOrderStatus } = require("../Controller/OrderController");
const { decreaseQuantity } = require('../Controller/ProductController');

router.post('/order/create/:userId', requireSignin, isAuth, addOrderToUserHistory, decreaseQuantity, create);
router.get('/order/list/:userId', requireSignin, isAuth, isAdmin, orderList);
router.get('/order/status-values/:userId', requireSignin, isAuth, isAdmin, getStatusVales);
router.put('/order/:orderId/status/:userId', requireSignin, isAuth, isAdmin, updateOrderStatus);

router.param("userId", userById);
router.param("orderId", orderById);

module.exports = router;
