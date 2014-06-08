'use strict';

var traceur = require('traceur');
var Message = traceur.require(__dirname + '/../models/message.js');


exports.index = (req, res)=>{
  res.render('messages/index', {title: 'messages'});
};

exports.create = (req, res)=>{
  Message.create(req.body, fn=>{
    console.log(fn);
    res.render('messages/index', {title: 'messages'});
  });
};
