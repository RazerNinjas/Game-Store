var express = require('express');
var monk = require('monk');
var router = express.Router();
var db = monk('localhost:27017/boardgames');

router.post('/checkout', function(req,res,next){
    if(!req.session.user){
      res.redirect('/login');
    }
    let collection = db.get('users');
    let games = db.get('games');
    collection.findOne({username: req.session.user}, function(err, user){
      //send message if quantity not enough
      let approvedItems =[]
      user.cart.forEach(function(item){
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
      approvedItems.forEach(function(item){
        games.findOne({_id: item.gameID}, function(err, game){
          games.findOneAndUpdate({_id: item.gameID},{$set: {quantity: game.quantity-item.quantity}});
        }
        );
      });
      res.render('thanks',{username: req.session.user});
    });
  });