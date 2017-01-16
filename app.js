var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var index = require('./routes/index');
var users = require('./routes/users');

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId

var app = express();
var db;

var mdbUrl ="mongodb://admin:Alexandra09@ds161018.mlab.com:61018/coen3463-t8"

MongoClient.connect(mdbUrl, function(err, database) {
	if (err) {
		console.log(err)
		return;
	}
		console.log("Connected to DB");

		db = database;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.get('/index', function(req, res){
  res.render('index')
});
app.get('/gallery', function(req, res){
  res.render('gallery')
});
app.get('/list:listId', function(req, res){
  res.render('list')
});

app.get('/tedtalks', function(req, res) {
        var tedtalksCollection = db.collection('tedtalks');
        tedtalksCollection.find().toArray(function(err, tedtalks) {
           console.log('tedtalks loaded', tedtalks);
          res.render('tedtalks', {
            tedtalks: tedtalks
          });
        });
    });


app.get('/tedtalkslist', function(req, res) {
    var tedtalksCollection = db.collection('tedtalks');
    tedtalksCollection.find().toArray(function(err, tedtalks) {
      console.log('Tutorials Loaded!');
      res.render('tedtalkslist', {
        lists: tedtalks
      });
    })
  });

    app.post('/tedtalks', function(req, res) {
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

        db.collection('tedtalks')
          .save(dataToSave, function(err, list) {
            if (err) {
                console.log('Saving Data Failed!');
                return;
            }
            console.log("Saving Data Successfull!");
            res.redirect('/tedtalks');
        });
    });

    app.get('/list/:listId', function(req, res) {
        var listId = req.params.listId;
        var listCollection = db.collection('tedtalks');
        listCollection.findOne({ _id: new ObjectId(listId)}, function(err, list) {
            res.render('list', {
                list: list
            });
        });
    });

    app.get('/tedtalks/:listId/edit', function(req, res) {
        var listId = req.params.listId;
        var tedtalksCollection = db.collection('tedtalks');
        tedtalksCollection.findOne({_id: new ObjectId(listId)}, function(err, tedtalks) {
           console.log('tedtalks loaded', tedtalks);
          res.render('update', {
            list: tedtalks
          });
        });
    });

    app.post('/tedtalks/:listId', function(req, res, next) {

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
        db.collection('tedtalks').updateOne({_id: new ObjectId(listId)}, {$set: dataToSave}, function(err, result) {
          if (err) {
                console.log('Saving Data Failed!');
                return;
            }
            console.log("Saving Data Successfull!");
            res.redirect('/list/' + listId);
        });
      });

    app.get('/tedtalks/:listId/delete', function(req, res) {
        var listId = req.params.listId;
        var tedtalksCollection = db.collection('tedtalks');
        tedtalksCollection.deleteOne({_id: new ObjectId(listId)}, function(err, tedtalks) {
           if (err) {
            console.log('Item not deleted!');
           }
           else {
            console.log('Item Deleted!');
            res.redirect('/tedtalkslist')
           }
          
    });
  });



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

});

module.exports = app;
