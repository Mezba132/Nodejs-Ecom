const express = require('express');
const router = express.Router();
const { create, categoryById, read, remove, update, list } = require('../Controller/CategoryController');
const { requireSignin, isAuth, isAdmin }  = require("../Controller/AuthController");
const { userById } = require("../Controller/UserController");

router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);
router.get('/category/:categoryId', read);
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, update);
router.get('/categories', list);


router.param("userId", userById);
router.param("categoryId", categoryById);

module.exports = router;