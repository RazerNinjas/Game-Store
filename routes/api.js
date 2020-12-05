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
})


module.exports = router;