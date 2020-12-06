var express = require('express');
var monk = require('monk');
var router = express.Router();
var db = monk('localhost:27017/boardgames');

router.post('/', async function(req,res,next){
    if(!req.session.user){
      res.redirect('/login');
    }
    let collection = db.get('users');
    let games = db.get('games');
    let user = await collection.findOne({username: req.session.user});
    let approvedItems = [];
    for(item of user.cart.list){
        let game = await games.findOne({_id: item.gameID});
        if(game.quantity-item.quantity >= 0 && !game["soft-delete"])
            approvedItems.push(item);
        else{
            if(game["soft-delete"])
            {
                let removeIndex = user.cart.list.findIndex(obj => obj.gameID.equals(game._id));
                user.cart.total = user.cart.total - (user.cart.list[removeIndex].price * user.cart.list[removeIndex].quantity);
                user.cart.list.splice(removeIndex,1);
                await collection.findOneAndUpdate({username: req.session.user},{$set: {cart: user.cart}});
                res.redirect("/cart?error=item-deleted");
                return;
            }
            res.redirect("/cart?error=out-of-stock");
            return;
        }
    }
    for(approvedItem of approvedItems){
        let game = await games.findOne({_id: item.gameID});
        await games.findOneAndUpdate({_id: item.gameID},{$set: {quantity: game.quantity-item.quantity}});
    }
    user.purchaseHistory.unshift(user.cart);
    collection.findOneAndUpdate({username: req.session.user}, {$set: {purchaseHistory: user.purchaseHistory, cart: {list: [], total: 0.0}}});
    res.redirect(`/thanks?username=${req.session.user}`);

      });


  module.exports = router;