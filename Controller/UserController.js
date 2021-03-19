const User = require('../Models/user');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJWT = require('express-jwt') // for authorization check
const { errorHandler } = require('../Helper/ErrorHandler');

exports.signup = (req, res) => {
    console.log('req.body', req.body);
    const user = new User(req.body);
    user.save((err,save) => {
        if(err) {
            return res.status(400).json({
                err : errorHandler(err)
            })
        }
        user.salt = undefined
        user.hash_password = undefined
        res.json({
            user
        })
    })
}

exports.signin = (req, res) => {
    // find the user based on email
    const { email, password } = req.body;
    User.findOne({email}, (err, user) => {
        if(err | !user) {
            return res.status(400).json({
                error : "please sign up"
            })
        }
        // if user is found make sure the email and password match
        // create authenticate method in user model
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error : 'Email and Password dont match'
            })
        }
        // generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        // persist the token as 'CookieToken' in cookie with expiry date
        res.cookie("CookieToken", token, { expire : new Date() + 9999 })
        // return response with user and token to frontend client
        const { _id, name, email, role} = user;
        return res.json({ token, user : { _id, email, name, role }})
    })
}

exports.signout = (req, res) => {
    res.clearCookie('CookieToken');
    res.json({ message : "Signout Successfully"})
}