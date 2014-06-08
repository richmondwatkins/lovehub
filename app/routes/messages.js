'use strict';

var traceur = require('traceur');
var Message = traceur.require(__dirname + '/../models/message.js');
var User = traceur.require(__dirname + '/../models/user.js');


exports.index = (req, res)=>{
  Message.findInbox(res.locals.user._id, messages=>{
    res.render('messages/index', {messages:messages, title: 'messages'});
  });
};

exports.create = (req, res)=>{
  var messageObj = {};
  User.findIdByUserName(req.body.username, user=>{
    messageObj.toId = user._id;
    messageObj.toUsername = user.username;
    messageObj.fromId = res.locals.user._id;
    messageObj.fromUsername = res.locals.user.username;
    messageObj.content = req.body.message;
    messageObj.subject = req.body.subject;

    Message.create(messageObj);

      res.redirect('/messages');
  });
};
