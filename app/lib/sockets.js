/* global io */
/* jshint unused:false */
'use strict';

var Cookies = require('cookies');
var traceur = require('traceur');
var MongoClient = require('mongodb').MongoClient;
var Mongo = require('mongodb');
var _ = require('lodash');
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
  socket.on('getOnlineFlirts', getOnlineFlirts);
  socket.on('logout', logout);
  socket.on('sendMessage', sendMessage);
  socket.broadcast.emit('refreshFlirts');
};

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

function sendMessage(data){
  var socket = this;
  console.log('----------SEND MESSAGE--------');
  console.log(data);
  socket.broadcast.to(data.socketId).emit('receiveMessage', data.email, data.message);
}

function getOnlineFlirts(data){
  var socket = this;
  var onlineUserIds = Object.keys(onlineUsers);
  var onlineFlirts = {};
  if(data.flirts){
    data.flirts.forEach(flirt=>{
      var index = _.findIndex(onlineUserIds, id=> flirt === id);
      if(index > -1 && onlineUsers[flirt]){
        onlineFlirts[flirt] = onlineUsers[flirt];
      }
    });
    var flirtIds = Object.keys(onlineFlirts).map(id=>Mongo.ObjectID(id));
    User.findFlirts(flirtIds, records=>{
      records.forEach(r=>{
        var temp = {};
        temp.socketId = onlineFlirts[r._id];
        temp.email = r.email;
        temp.userId = r._id;
        onlineFlirts[r._id] = temp;
      });
      socket.emit('updateOnlineFlirts', {onlineFlirts:onlineFlirts});
    });
  }
}

function addUserToSocket(socket){
  var cookies = new Cookies(socket.handshake, {}, ['SEC123', '321CES']);
  var encoded = cookies.get('express:sess');
  var decoded;

  if(encoded){
    decoded = decode(encoded);
    console.log(decoded);
    if(decoded.userId !== null){
      var uId = Mongo.ObjectID(decoded.userId);
      User.findUserById(uId, user=>{
        socket.user = user;
        onlineUsers[user._id] = socket.id;
        console.log('----------ONLINE USERS---------');
        console.log(onlineUsers);
        socket.emit('online', {userId: user._id, flirts:user.flirts});
      });
    }
  }
}

function logout(data){
  var socket = this;

  onlineUsers[data.userId] = null;
  console.log('--------online users after logout---------');
  console.log(onlineUsers);
  socket.broadcast.emit('refreshFlirts');
}

function decode(string) {
  var body = new Buffer(string, 'base64').toString('utf8');
  return JSON.parse(body);
}

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
