'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var users = traceur.require(__dirname + '/../routes/users.js');
  var search = traceur.require(__dirname + '/../routes/search.js');


  app.all('*', users.lookup);

  app.get('/', dbg, home.index);
  app.get('/about', dbg, home.about);

  app.get('/users/new', dbg, users.new);
  app.post('/users', dbg, users.create);
  app.get('/users/:userId', dbg, users.show);

  app.get('/search', dbg, search.index);

  app.get('/logout', dbg, users.logout);


  console.log('Routes Loaded');
  fn();
}
