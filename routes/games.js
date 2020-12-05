var express = require('express');
var monk = require('monk');
var router = express.Router();
var db = monk('localhost:27017/boardgames');


router.get('/', function(req, res, next){
    let collection = db.get('games');
    collection.find({"soft-delete": false},function(err,games){
        if(err) throw err;
        let currentPage;
        if(!req.query.currentPage)
            currentPage = 1;
        else
            currentPage = req.query.page;
        let result = games.slice((currentPage-1)*3, currentPage*3);
        let nextPage = true;
        let previousPage = false;
        if(currentPage*3 > games.length)
            nextPage = false;
        if(currentPage > 1)
            previousPage = true;
        if(req.session.user){
            if(req.session.isAdmin){
                res.render("products", {title: "Products", isAdmin: true, games: result, username: req.session.user, nextPage: nextPage, previousPage: previousPage,currentPage: currentPage});
                return;
            }
            res.render("products", {title: "Products", games: games, username: req.session.user, nextPage: nextPage, previousPage: previousPage, currentPage: currentPage});
            return;
        }
        res.render("products", {title: "Products", games: games, nextPage: nextPage, previousPage: previousPage, currentPage: currentPage});
    });
});

router.get('/search', function(req,res,next){
    let collection = db.get('games');
    if(!req.query.category || req.query.category === 'default')
        req.query.category = '';
    collection.find({title: {$regex: `^.*${req.query.title}.*$`, $options: 'i'}, category: {$regex: `^.*${req.query.category}.*$`, $options: 'i'}, "soft-delete": false}, function(err, games){
        if(err) throw err;
        let currentPage;
        if(!req.query.currentPage)
            currentPage = 1;
        else
            currentPage = req.query.page;
        let result = games.slice((currentPage-1)*3, currentPage*3);
        let nextPage = true;
        let previousPage = false;
        if(currentPage*3 > games.length)
            nextPage = false;
        if(currentPage > 1)
            previousPage = true;
        if(req.session.user){
            if(req.session.isAdmin){
                if(req.query.category == "")
                {
                    res.render("search", {title: "Search", isAdmin: true, games: result, username: req.session.user, nextPage: nextPage, previousPage: previousPage, searchTerm: req.query.title, currentPage: currentPage});
                    return;
                }
                else
                {
                    res.render("search", {title: "Search", isAdmin: true, games: result, username: req.session.user, nextPage: nextPage, previousPage: previousPage, searchTerm: req.query.title, category: req.query.category, currentPage: currentPage});
                }
                
            }
            if(req.category =="")
            {
                res.render("search", {title: "Search", games: result, username: req.session.user, nextPage: nextPage, previousPage: previousPage, searchTerm: req.query.title, currentPage: currentPage});
                return;
            }
            else
            {
                res.render("search", {title: "Search", games: result, username: req.session.user, nextPage: nextPage, previousPage: previousPage, searchTerm: req.query.title, category: req.query.category, currentPage: currentPage});
                return;
            }
            
        } 
        if(req.category == "")
        {
            res.render('search', {title: "Search", games: result, nextPage: nextPage, previousPage: previousPage, searchTerm: req.query.title, category: req.query.category, searchTerm: req.query.title,currentPage: currentPage});
            return;
        }
        else
        {
            res.render('search', {title: "Search", games: result, nextPage: nextPage, previousPage: previousPage, searchTerm: req.query.title, category: req.query.category, currentPage: currentPage});
            return;
        }
        
  });
})

router.get('/:id', function(req,res,next){
    let collection = db.get('games');
    collection.findOne({_id: req.params.id}, {partial: true}, function(err,game){
        if(err) throw err;
        res.render('game', {title: `${game.title}`, game: game});
        
    })
});





router.post('/', function(req,res,next){
    let collection = db.get('games');
    
})

module.exports = router;