var express = require('express');
var monk = require('monk');
var router = express.Router();
var db = monk('localhost:27017/boardgames');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'public/images/');
    },
    filename: function(req,file,cb){
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage});

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

router.post('/game', upload.fields([{name: 'coverImg'}, {name: 'boardImg'}]), async function(req,res,next){
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
        cover: req.files.coverImg[0].originalname,
        board: req.files.boardImg[0].originalname,
        price: parseFloat(req.body.price),
        "soft-delete": false
    });
    res.redirect('/games');

});


// game id
router.put('/game', upload.fields([{name: 'coverImg'}, {name: 'boardImg'}]), async function(req,res,next){
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
        cover: (!req.files || !req.files.coverImg || !req.files.coverImg.length == 0)? game.cover : req.files.coverImg[0].originalname,
        board: (!req.files || !req.files.boardImg || !req.files.boardImg.length == 0)? game.board : req.files.boardImg[0].originalname,
        price: parseFloat(req.body.price),
        "soft-delete": (req.body["soft-delete"] == "true"),

    }});
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