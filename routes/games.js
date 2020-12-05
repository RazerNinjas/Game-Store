var express = require('express');
var monk = require('monk');
var router = express.Router();
var db = monk('localhost:27017/boardgames');

router.get('/', function(req,res,next){
    let collection = db.get('games');
    collection.find({},function(err,games){
        if(err) throw err;
        res.json(games);
    });
    
});

router.get('/products', function(req, res, next){
    let collection = db.get('games');
    collection.find({},function(err,games){
        if(err) throw err;
        res.render("products", {games: games});
    });
});

router.get('/:id', function(req,res,next){
    let collection = db.get('games');
    collection.findOne({_id: req.params.id}, {partial: true}, function(err,game){
        if(err) throw err;
        res.render('game', {game: game});
        
    })
});

router.get('/search', function(req,res,next){
    let collection = db.get('games');
    if(!req.query.category || req.query.category === 'default')
        req.query.category = '';
    collection.find({title: {$regex: `^.*${req.query.title}.*$`, $options: 'i'}, category: {$regex: `^.*${req.query.category}.*$`, $options: 'i'}}, function(err, games){
        if(err) throw err; 
        res.render('search', {games: games})
  });
})



router.post('/', function(req,res,next){
    let collection = db.get('games');
    
})

module.exports = router;