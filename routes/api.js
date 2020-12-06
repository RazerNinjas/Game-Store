var express = require('express');
var monk = require('monk');
var router = express.Router();
var db = monk('localhost:27017/boardgames');

router.post('/exists', function(req,res,next){
    let collection = db.get('users');
    collection.findOne({username: req.body.username}, function(err,user){
        if(err) throw err;
        if(!user){
            res.send(200, {result: false});
            return;
        }
        res.send(200, {result: true});
    })
});

router.post('/game', async function(req,res,next){
    if(!req.session.isAdmin)
    {
        res.send(403);
        return;
    }
    let games = db.get('games');
    await games.insert({
        title: req.body.title,
        players: req.body.players,
        category: req.body.category,
        brand: req.body.brand,
        cover: req.files.coverImg.name,
        board: req.files.boardImg.name,
        price: parseFloat(req.body.price),
        "set-delete": false
    });
    await req.files.coverImg.mv(`/public/images/${req.files.coverImg.name}`);
    await req.files.boardImg.mv(`/public/images/${req.files.boardImg.name}`);
    res.redirect('/games');

});


// game id
router.put('/game', async function(req,res,next){
    if(!req.session.isAdmin)
    {
        res.send(403);
        return;
    }
    let games = db.get('games');
    let game = await games.findOne({_id: req.body.id});
    await games.findOneAndUpdate({_id: req.body.id}, {$set: {
        title: req.body.title,
        players: req.body.players,
        category: req.body.category,
        brand: req.body.brand,
        cover: (!req.files || !req.files.coverImg)? game.cover : req.files.coverImg.name,
        board: (!req.files || !req.files.boardImg)? game.board : req.files.boardImg.name,
        price: parseFloat(req.body.price),
        "set-delete": (req.body["set-delete"] == "true"),

    }});
    if(req.files && req.files.coverImg){
        await req.files.coverImg.mv(`/public/images/${req.files.coverImg.name}`);
    }
    if(req.files && req.files.boardImg){
        await req.files.boardImg.mv(`/public/images/${req.files.boardImg.name}`);
    }
    res.redirect('/games'); 
    
});


// given id of game
router.delete('/game', function(req,res,next){
    if(!req.session.isAdmin)
    {
        res.send(403);
        return;
    }
    let games = db.get('games');
    games.findOneAndUpdate({_id: req.body.id}, {$set: {"soft-delete": true}});
    res.redirect('/games');
});


module.exports = router;