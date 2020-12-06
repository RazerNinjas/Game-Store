var express = require('express');
var monk = require('monk');
var crypto = require('crypto');
var router = express.Router();
var db = monk('localhost:27017/boardgames');

router.get('/addItem', function(req,res,next){
    if(!req.session.isAdmin){
        res.send(403);
        return;
    }
    console.log(req.session.isAdmin);
    res.render('addItem', {title: "Add Item", isAdmin: true});

});

router.get('/updateItem', async function(req,res,next){
    if(!req.session.isAdmin || !req.query.id){
        res.send(403);
        return;
    }
    let games = db.get('games');
    let game = await games.findOne({_id: req.query.id});
    res.render('updateItem', {title: "Update Item", game: game, isAdmin: true});    
});

module.exports = router;