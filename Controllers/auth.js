const User = require("../Models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  //Check input Data
  const errors = validationResult(req);
  //Check error
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      errorinField: errors.array()[0].param,
    });
  }
  //Save User Data
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save user in DB",
      });
    }
    //Return Response
    res.json({
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      id: user.id,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      errorinField: errors.array()[0].param,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(422).json({
        error: "User email does not exists!",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email or password do not match!",
      });
    }

    //Creating JWToken
    const token = jwt.sign({ id: user._id }, process.env.SECRET);

    //Put token in the cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //Send response to FRONT end
    const { _id, name, email, lastname, role } = user;
    return res.json({ token, user: { _id, name, lastname, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfully!",
  });
};

//Protected Routes(Additional option JWT)
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//Custom Middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth.id;
  if (!checker) {
    return res.status(403).json({
      error: "Access Denied!",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not an admin!",
    });
  }
  next();
};
