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


// GIVEN id: <game-id>, quantity: <number>
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
            if(user.cart.list.findIndex(obj => obj.gameID.equals(req.body.id)) > -1)
            {
                user.cart.list[user.cart.list.findIndex(obj => obj.gameID.equals(req.body.id))].quantity += parseInt(req.body.quantity);

            }
            else{
                user.cart.list.push({
                    gameID: game._id,
                    quantity: req.body.quantity,
                    price: game.price,
                    name: game.title
                });
            }
            user.cart.total += game.price * parseInt(req.body.quantity);
            collection.findOneAndUpdate({username: req.session.user}, {$set: {cart: user.cart}});

        })

    })
})
  
module.exports = router;