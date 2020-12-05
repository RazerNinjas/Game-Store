var express = require('express');
var monk = require('monk');
var router = express.Router();
var db = monk('localhost:27017/boardgames');

router.get('/', function(req,res,next){
    if(!req.session.user){
      res.redirect('/login');
      return;
    }
    let collection = db.get('users');
    collection.findOne({username: req.session.user}, function(err, user){
      if(req.query.error)
      {
        res.render('cart',{title: "Cart",username: req.session.user, cart: user.cart, error: req.query.error});
        return;
      }
      res.render('cart',{title: "Cart",username: req.session.user, cart: user.cart});
    });
    
  });


// GIVEN id: <game-id>
router.post('/', function(req,res,next){
    if(req.session.user)
    {
        res.send(403);
        return;
    }
    let collection = db.get('users');
    let games = db.get('games');
    collection.findOne({username: req.session.user}, function(err,user){
        games.findOne({_id: req.body.id}, function(err,game){
            if(user.cart.list.findIndex(obj => obj.gameID == req.body.id) > -1)
            {
                user.cart.list[user.cart.list.findIndex(obj => obj.gameID == req.body.id)].quantity++;

            }
            else{
                user.cart.list.push({
                    gameID: game._id,
                    quantity: 1,
                    price: game.price,
                    name: game.title
                });
            }
            user.cart.total += game.price
            collection.findOneAndUpdate({username: req.session.user}, {$set: {cart: user.cart}});

        })

    })
})

router.get('/edit', function(req,res,next){
    if(!req.session.user){
        res.redirect('/login');
        return;
      }
    let collection = db.get('users')
    res.render('editCart', {title: "Edit Cart", });
})
  
module.exports = router;