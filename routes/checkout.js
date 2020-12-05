var express = require('express');
var monk = require('monk');
var router = express.Router();
var db = monk('localhost:27017/boardgames');

router.post('/', function(req,res,next){
    if(!req.session.user){
      res.redirect('/login');
    }
    let collection = db.get('users');
    let games = db.get('games');
    collection.findOne({username: req.session.user}, function(err, user){
      //send message if quantity not enough
      let approvedItems =[]
      //check if each item has enough in stock

      user.cart.list.forEach(function(item){
        games.findOne({_id: item.gameID}, function(err, game){
          if(err) throw err;
          if(game.quantity - item.quantity >= 0){
            approvedItems.push(item);
          }
          else{
            res.render('cart', {error: `${item.name} could not be bought due to not having enough quantity in stock`});
            return;
          }
        });
      });


      // create purchase history entry + reduce item stock quantity by purchase quantity
      approvedItems.forEach(function(item){
        games.findOne({_id: item.gameID}, function(err, game){
          games.findOneAndUpdate({_id: item.gameID},{$set: {quantity: game.quantity-item.quantity}});
        }
        );
      });
      user.purchaseHistory.unshift(user.cart);
      collection.findOneAndUpdate({username: req.session.user}, {$set: {purchaseHistory: user.purchaseHistory, cart: {list: [], total: 0.0}}});
      res.render('thanks',{username: req.session.user});
    });
  });

  module.exports = router;