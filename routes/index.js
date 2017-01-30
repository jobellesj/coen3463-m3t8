var express = require('express');
var router = express.Router();
var passport = require('passport');
var tedtalksCollection = require('../models/tedtalks');
var usersCollection = require('../models/users');

router.get('/', function(req, res, next) {
  if (req.user){
    res.render('index');
  }
  else{
    res.redirect('/login');
  }
});

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

router.post('/signup', function(req, res) {
  var userData = {
    username: req.body.username,
    firstname: req.body.firstName,
    lastname: req.body.lastName
  };
  usersCollection.register(new usersCollection(userData), req.body.confirmPassword, function (err, account) {
    if (!err) {
      req.login(account, function (err) {
        res.redirect('/');
      });
    }
    else {
      res.render('login', {});

    }
  });

});  

router.post('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});
router.get('/index', function(req, res){
  if (req.user){
    res.render('index')
  }
  else{
    res.redirect('/login');
  }
});
router.get('/gallery', function(req, res){
  if (req.user){
    res.render('gallery')
  }
  else{
    res.redirect('/login');
  }
});
router.get('/list:listId', function(req, res){
  if (req.user){
    res.render('list')
  }
  else{
    res.redirect('/login');
  }
});

router.get('/login', function(req, res, next) {
  if (!req.user){
    res.render('login');
  }
  else{
    res.redirect('/login');
  }
});

router.get('/tedtalks', function(req, res) {
  if (req.user){
    tedtalksCollection.find()
        .then(function(tedtalks) {
          res.render('tedtalks', {
            tedtalks: tedtalks
          });
        });
  }
  else{
    res.redirect('/login');
  }
});

router.get('/tedtalkslist', function(req, res) {
  if (req.user){
    tedtalksCollection.find()
        .then(function(tedtalks) {
          res.render('tedtalkslist', {
            lists: tedtalks
          });
        });
  }
  else{
    res.redirect('/login');
  }
});

router.post('/tedtalks', function(req, res) {
  console.log(req.body);
  var dataToSave = {
    title: req.body.title,
    uploader_name: req.body.uploader_name,
    youtube_page: req.body.youtube_page,
    youtube_link: req.body.youtube_link,
    description: req.body.description,
    pub_date: req.body.pub_date,
    category: req.body.category,
    views: req.body.views,
    likes: req.body.likes,
    embedded: req.body.embedded,
    creation_date: Date.now(),
    last_update: Date.now()
  };
  var tedtalks = new tedtalksCollection(dataToSave);
  tedtalks.save(function(err){
    if(!err){
      console.log("Saving Data Successfull!");
      res.redirect('/tedtalks');
    }
    else
    {
      console.log('Saving Data Failed!');
      return;
    }
  });
});

router.get('/list/:listId', function(req, res) {
  if (req.user){
    var listId = req.params.listId;
    tedtalksCollection.findOne({_id: listId}, function (err, tedtalks){
      if (!err) {
        res.render('list', {
          list: list
        });
      }
    });
  }
  else{
    res.redirect('/login');
  }
});

router.get('/tedtalks/:listId/edit', function(req, res) {
  if (req.user){
    var listId = req.params.listId;
    tedtalksCollection.findOne({_id: listId}, function (err, tedtalks){
      if (!err) {
        console.log('tedtalks loaded', tedtalks);
        res.render('update', {
          list: tedtalks
        });
      }
      else {
        res.end(err);
      }
    });
  }
  else{
    res.redirect('/login');
  }
});

router.post('/tedtalks/:listId', function(req, res, next) {

  var listId = req.params.listId;

  var dataToSave = {
    title: req.body.title,
    uploader_name: req.body.uploader_name,
    youtube_page: req.body.youtube_page,
    youtube_link: req.body.youtube_link,
    description: req.body.description,
    pub_date: req.body.pub_date,
    category: req.body.category,
    views: req.body.views,
    likes: req.body.likes,
    embedded: req.body.embedded,
    creation_date: Date.now(),
    last_update: Date.now()
  };
  var tedtalks = new tedtalksCollection(dataToSave);
  tedtalks.save(function(err){
    if(!err){
      console.log("Saving Data Successfull!");
      res.redirect('/list/' + listId);
    }
    else
    {
      console.log('Saving Data Failed!');
      return;
    }
  });
});

router.get('/tedtalks/:listId/delete', function(req, res) {
  if (req.user){
    var listId = req.params.listId;
    tedtalksCollection.remove({_id: listId}, function(err){
      if(!err){
        console.log('Item Deleted!');
        res.redirect('/tedtalkslist')
      }
      else {
        console.log('Item not deleted!');
      }
    });
  }
  else{
    res.redirect('/login');
  }
});

module.exports = router;