var User = require("../models/user")

module.exports = {
    isUserLogged: (req,res,next) => {
        if(req.session && req.session.userId){
            next();
        } else {
            res.redirect('/users/login')
        }
    },

    userInfo: (req,res,next) => {
        var userId = req.session && req.session.userId;
        if(userId){
            User.findById(userId,"name email")
            .then((user) => {
                req.user = user;
                res.locals.user = user;
                next()
            })
            .catch((error) => {
                return next(error)
            })
        }else {
            req.user = null;
            res.locals.user = null;
            next()
        }
    }
}