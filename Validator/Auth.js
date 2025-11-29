exports.userSignupValidator = (req, res, next) => {
  req.check("name", "Name is required").notEmpty();
  req
    .check("email", "Email must be between 3 to 32 characters")
    .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,15})+$/)
    .withMessage("Valid Email is required")
    .isLength({
      min: 4,
      max: 32,
    });
  req.check("password", "Password is required").notEmpty();
  req
    .check("password")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/)
    .withMessage(
      "Passowrd length must be 4 and at least need one character and one number"
    )
    .isLength({
      min: 4,
      max: 50,
    });
  const err = req.validationErrors();
  if (err) {
    const firstError = err.map((err) => err.msg)[0];
    return res.status(400).json({ err: firstError });
  }
  next();
};
