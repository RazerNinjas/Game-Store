var express = require('express');
var monk = require('monk');
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
  //let hashPassword = 


});

router.get('/register', function(req, res ,next){
  res.render('register');
});

router.post('/register', function(req,res,next){
  return;
})

module.exports = router;
