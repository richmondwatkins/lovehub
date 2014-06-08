/* jshint unused: false */
'use strict';
var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

exports.index = (req, res)=>{
  res.render('users/index', {title: 'user'});
};

exports.new = (req, res)=>{
  res.render('users/new', {title: 'New user'});
};

exports.create = (req, res)=>{
  User.create(req, user=>{
    res.redirect(`/users/${user._id}`);
  });
};

exports.show = (req, res)=>{
  User.findUserById(req.params.userId, user=>{
    var path = user.primaryPhotoPath();
    res.render('users/show' , {user:user, primaryPic:path});
  });
};


exports.logout = (req, res)=>{
  req.session = null;
  res.render('home/index', {title: 'LoveHub: Home'});
};


exports.lookup = (req, res, next)=>{
  console.log('--------LOOKUP ROUTE----------');
  console.log(req.session.userId);
  User.findUserById(req.session.userId, u=>{
    if(u){
      res.locals.user = u;
      next();
    }else{
      next();
    }
  });
};
