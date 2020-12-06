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
    res.render('login', {title: 'Login', message: "Thank you for registering! Please login to begin!", isAdmin: false});
    return;
  }
  res.render('login', {title: 'Login', isAdmin: false});
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
      res.render('login',{title: "Login", message: "Invalid Username or Password", isAdmin: false});
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
  res.render('register', {title: "Register", isAdmin: false});
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




router.get('/history', function(req,res,next){
  if(!req.session.user){
    res.redirect('/login');
    return;
  }
  let collection = db.get('users');
  let currentPage = 1;
  if(req.query.page)
    currentPage = parseInt(req.query.page);
  collection.findOne({username: req.session.user}, function(err, user){
    if(currentPage > purchaseHistory.length)
      {
        res.send(404);
        return;
      }
    let previousPage = currentPage > 1;
    let nextPage = currentPage < purchaseHistory.length
    res.render('cart',{title: "History", username: req.session.user, cart: user.purchaseHistory[currentPage-1], isAdmin: req.session.isAdmin, isHistory: true, previousPage: previousPage, nextPage: nextPage});
  });
});

router.get('/thanks', function(req,res,next){
  if(!req.session.user){
    res.redirect('/login');
    return;
  }
  res.render('thanks', {title: "Thank You", username: req.query.username, isAdmin: req.session.isAdmin});
})

module.exports = router;
