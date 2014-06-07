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
    res.render('users/show' , {user:user});
  });
};

exports.edit = (req, res)=>{
  User.findUserById(req.params.id, user=>{
    user.editProfile(req.body, ()=>res.redirect(`/users/${user._id}`));
  });
};
