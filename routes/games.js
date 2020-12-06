var express = require('express');
var monk = require('monk');
var router = express.Router();
var db = monk('localhost:27017/boardgames');

router.get('/all', function(req,res,next){
    if(!req.session.isAdmin)
    {
        res.redirect('/');
    }
    let collection = db.get('games');
    collection.find({"soft-delete": false},function(err,games){
        if(err) throw err;
        let currentPage;
        if(!req.query.page)
            currentPage = 1;
        else
            currentPage = parseInt(req.query.page);
        let result = games.slice((currentPage-1)*3, currentPage*3);
        let nextPage = true;
        let previousPage = false;
        if(currentPage*3 > games.length)
            nextPage = false;
        if(currentPage > 1)
            previousPage = true;
        res.render("products", {title: "All Products", isAdmin: true, isAll: true, games: result, username: req.session.user, nextPage: nextPage, previousPage: previousPage,currentPage: currentPage});
    });

})

router.get('/', function(req, res, next){
    let collection = db.get('games');
    collection.find({"soft-delete": false},function(err,games){
        if(err) throw err;
        let currentPage;
        if(!req.query.page)
            currentPage = 1;
        else
            currentPage = parseInt(req.query.page);
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
            res.render("products", {title: "Products", games: result, username: req.session.user, nextPage: nextPage, previousPage: previousPage, currentPage: currentPage});
            return;
        }
        res.render("products", {title: "Products", games: result, nextPage: nextPage, previousPage: previousPage, currentPage: currentPage});
    });
});

router.get('/search', function(req,res,next){
    let collection = db.get('games');
    if(!req.query.category || req.query.category === 'default')
        req.query.category = '';
    collection.find({title: {$regex: `^.*${req.query.title}.*$`, $options: 'i'}, category: {$regex: `^.*${req.query.category}.*$`, $options: 'i'}, "soft-delete": false}, function(err, games){
        if(err) throw err;
        let currentPage;
        if(!req.query.page)
            currentPage = 1;
        else
            currentPage = parseInt(req.query.page);
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
        if(req.session.user)
        {
            if(req.session.isAdmin)
            {
                res.render('game', {title: `${game.title}`, game: game, username: req.session.user, isAdmin: true});
                return;
            }
            res.render('game', {title: `${game.title}`, game: game, username: req.session.user, isAdmin: false});
            
        }
        res.render('game', {title: `${game.title}`, game: game});
        
        
    });
});




module.exports = router;