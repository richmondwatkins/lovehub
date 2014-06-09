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
  var chat = traceur.require(__dirname + '/../routes/chat.js');
  var search = traceur.require(__dirname + '/../routes/search.js');
  var messages = traceur.require(__dirname + '/../routes/messages.js');


  app.all('*', users.lookup);

  app.get('/', dbg, home.index);
  app.get('/about', dbg, home.about);

  app.get('/users/new', dbg, users.new);
  app.post('/users', dbg, users.create);

  app.get('/users/:userId/edit', dbg, users.edit);
  app.post('/users/:userId/edit', dbg, users.update);

  app.get('/login', dbg, users.login);
  app.post('/login', dbg, users.authenticate);
  app.get('/logout', dbg, users.logout);


  app.get('/search', dbg, search.index);
  app.get('/search/all', dbg, search.resetSearch);
  app.post('/search', dbg, search.filter);

  app.get('/messages', dbg, messages.index);
  app.post('/messages', dbg, messages.create);

  app.get('/users/:userId', dbg, users.show);

  app.get('/chat', dbg, chat.index);

  console.log('Routes Loaded');
  fn();
}
