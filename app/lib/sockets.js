/* global io */
/* jshint unused:false */
'use strict';

var Cookies = require('cookies');
var traceur = require('traceur');
var MongoClient = require('mongodb').MongoClient;
var Mongo = require('mongodb');
var mongoUrl = `mongodb://localhost/${process.env.DBNAME}`;
var User;
var onlineUsers = {};

MongoClient.connect(mongoUrl, (err, db)=>{
  if(err){throw err;}
  global.nss = {};
  global.nss.db = db;
  console.log('Sockets connected to DB');
  User = traceur.require(__dirname + '/../models/user.js');
});


exports.connection = function(socket){
  addUserToSocket(socket);
};

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

function addUserToSocket(socket){
  var cookies = new Cookies(socket.handshake, {}, ['SEC123', '321CES']);
  var encoded = cookies.get('express:sess');
  var decoded;

  if(encoded){
    decoded = decode(encoded);
    console.log(decoded);
    decoded = Mongo.ObjectID(decoded.userId);
    console.log(decoded);
    User.findUserById(decoded, user=>{
      socket.user = user;
      console.log(socket.user);
      onlineUsers[user._id] = socket.id;
      console.log('----------ONLINE USERS---------');
      console.log(onlineUsers);
      socket.emit('online');
    });
  }
}

function decode(string) {
  var body = new Buffer(string, 'base64').toString('utf8');
  return JSON.parse(body);
}

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
