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
  var profile = traceur.require(__dirname + '/../routes/profile.js');

  app.get('/', dbg, home.index);
  app.get('/about', dbg, home.about);

  app.get('/profile', dbg, profile.index);
  app.get('/profile/new', dbg, profile.new);



  console.log('Routes Loaded');
  fn();
}
