'use strict';

var traceur = require('traceur');
// var Message = traceur.require(__dirname + '/../models/message.js');
var User = traceur.require(__dirname + '/../models/user.js');


exports.index = (req, res)=>{
  res.render('messages/index', {title: 'messages'});
};

exports.create = (req, res)=>{
  var messageObj = {};
  User.findIdByUserName(req.body.username, user=>{
    console.log('FOUND USER WOOPIII');
    console.log(user);
    messageObj.toId = user._id;
    messageObj.fromId = res.locals.user._id;
    messageObj.content = req.body.message;
    messageObj.subject = req.body.subject;

    res.render('messages/index', {title: 'messages'});
  });
};
