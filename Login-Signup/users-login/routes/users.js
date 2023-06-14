var express = require("express");
var router = express.Router();
var User = require("../models/user");
var auth = require('../middlewares/auth')

/* GET users listing. */

router.get("/", function (req, res, next) {
   res.render('user');
  
});


router.get("/register", function (req, res, next) {
  res.render("register");
});


router.post("/register", function (req, res, next) {
  User.create(req.body)
    .then((user) => {
      console.log("created user", user);
      res.redirect("/users/login");
    })
    .catch((error) => {
      console.error("error", error);
    });
});

router.get("/login", function (req, res, next) {
  var error = req.flash('error')[0];
  var userError = req.flash('userError')[0];
  var passworderror = req.flash('passworderror')[0];
  res.render("login",{error,userError,passworderror});
});

router.post("/login", function (req, res, next) {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error',"Email/Password required")
   return res.redirect("/users/login");
  }

  User.findOne({ email }).then((user) => {
    if (!user) {
      req.flash('userError',"User isn't registered");
     return res.redirect("/users/login");
    }

    //compare passsword

    user.verifyPassword(password, (err, results) => {
      if (err) return next(err);
      if (!results) {
        req.flash('passworderror',"Incorrect Password");
       return res.redirect("/users/login");
      }
      console.log(results, "result");
      req.session.userId = user.id;
      res.redirect("/users");
    });
  });
});

router.get('/logout', (req,res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login')
})

module.exports = router;
