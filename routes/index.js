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
  if(req.query.register){
    res.render('login', {title: 'Login', message: "Thank you for registering! Please login to begin!"});
    return;
  }
  res.render('login', {title: 'Login'});
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
    {
      res.render('login',{message: "Invalid Username or Password"});
      return;
    }
    req.session.user = user.username;
    if(user.isAdmin)
      req.session.isAdmin = true;
    res.redirect('/games')
    
    
  });
  
});

router.get('/logout', function(req, res, next){
  if(req.session){
    req.session.destroy(function(){
      console.log("User logged out removing session");
    });
  }
  res.redirect('/games');
  
})

router.get('/register', function(req, res ,next){
  res.render('register');
});

router.post('/register', function(req,res,next){
  let collection = db.get('users');
  console.log(req.body);
  collection.insert({
    username: req.body.username,
    password: crypto.createHash('sha256').update(req.body.password).digest('hex'),
    cart: {list: [], total: 0.0},
    purchaseHistory : [],
    isAdmin : false
  });
  res.redirect('/login?register=true');
  return;
});

router.get('/cart', function(req,res,next){
  if(!req.session.user){
    res.redirect('/login');
    return;
  }
  let collection = db.get('users');
  collection.findOne({username: req.session.user}, function(err, user){
    
    res.render('cart',{username: req.session.user, cart: user.cart});
  });
  
});

router.get('/history', function(req,res,next){
  if(!req.session.user){
    res.redirect('/login');
    return;
  }
  let collection = db.get('users');
  collection.findOne({username: req.session.user}, function(err, user){
    
    res.render('history',{username: req.session.user, history: user.purchaseHistory});
  });
});

router.get('/thanks', function(req,res,next){
  if(!req.session.user){
    res.redirect('/login');
    return;
  }
  res.render('thanks', {username: req.query.username});
})

module.exports = router;
