var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next){
  res.render('login', {title: 'Register'});
});

router.post('/login', function(req, res, next){
  if(!req.body.id || !req.body.password){
    res.status("400");
    res.send("Invalid details!");
    return;
  } 
});

router.get('/register', function(req, res ,next){
  res.render('register');
});

module.exports = router;
