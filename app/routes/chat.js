'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

exports.index = (req, res)=>{
  res.render('chat/index');
};

exports.addFlirt = (req, res)=>{
  User.findUserById(req.params.userId, target=>{
    res.locals.user.addFlirt(req.params.userId);
    target.addFlirt(res.locals.user._id.toString());
    res.locals.user.save(()=>{
      target.save(()=>{
        res.redirect('/chat');
      });
    });
  });
};
