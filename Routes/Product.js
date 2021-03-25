const express = require('express');
const router = express.Router();

const { create, productById, read, remove, update, list, listRelated, listCategories, listBySearch, image } = require('../Controller/ProductController');
const { requireSignin, isAuth, isAdmin }  = require("../Controller/AuthController");
const { userById } = require("../Controller/UserController");

router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.get('/product/:productId', read);
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, update);
router.get('/products', list);
router.get('/products/related/:productId', listRelated);
router.get('/products/categories', listCategories);
router.post('/products/by/search', listBySearch);
router.get('/products/image/:productId', image);

router.param("userId", userById);
router.param("productId", productById);


module.exports = router;