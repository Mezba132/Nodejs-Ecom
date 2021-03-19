const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin }  = require("../Controller/AuthController");

const { userById } = require("../Controller/UserController");

router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user : req.profile
    });
});

router.param("userId", userById);

module.exports = router;