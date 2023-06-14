var express = require("express");
var router = express.Router();
var User = require("../models/user");
var auth = require('../middlewares/auth');

/* GET users listing. */

router.get("/", auth.isUserLogged, function (req, res, next) {
    res.render('article.ejs');
 });



 module.exports = router