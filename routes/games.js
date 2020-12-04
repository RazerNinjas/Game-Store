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

router.get('/:id', function(req,res,next){
    let collection = db.get('games');
    collection.findOne({_id: req.params.id}, {partial: true}, function(err,game){
        if(err) throw err;
        res.json(game);
        
    })
})

router.post('/', function(req,res,next){
    let collection = db.get('games');
    
})

