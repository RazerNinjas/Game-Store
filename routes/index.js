var express = require('express');
var monk = require('monk');
var crypto = require('crypto');
var router = express.Router();
var db = monk('localhost:27017/boardgames');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/games');
});

router.get('/login', function(req, res, next){
  res.render('login', {title: 'Register'});
});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    res.status("400");
    res.send("Invalid details!");
    return;
  }
  let collection = db.get('users');
  let hashPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');
  collection.findOne({username: req.body.username, password: hashPassword}, function(err,user){
    if(err) throw err;
    if(!user)
      res.render('login',{message: "Invalid Username or Password"});
    req.session.user = user.username;
    if(user.isAdmin)
      req.session.isAdmin = true;
    res.redirect('/games');
    
  });

router.get('/logout', function(req, res, next){
  if(req.session){
    req.session.destroy(function(){
      console.log("User logged out removing session");
    });
  }
  res.redirect('/games');
  
})


});

router.get('/register', function(req, res ,next){
  res.render('register');
});

router.post('/register', function(req,res,next){
  return;
})

module.exports = router;
