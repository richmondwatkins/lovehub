/* global io, $ */
/* jshint unused:false */

(function(){
  'use strict';

  $(document).ready(initialize);
  $('#logout').click(logout);

  var socket;
  var userEmail = $('#user').attr('data-email');

  function initialize(){
    initializeSocketIo();
    $('#online-flirts').on('click', '.chat', changeChatBox);
    $('#sendChat').click(sendChat);
  }

  function receiveMessage(email, message){
    updateConversations(email, message);
    console.log('-----email-------');
    console.log(email);
    console.log('--------SOCKET CONVERSATIONS----------');
    console.log(socket.conversations);
    updateChat();
  }

  function sendChat(){
    var email = $('#chatter').text();
    var userId = $('#chatter').attr('data-userId');
    console.log('----------TARGET USERID--------');
    console.log(userId);
    var socketId = socket.onlineFlirts[userId].socketId;
    console.log('-------TARGET SOCKETID---------');
    console.log(socketId);
    var message = $('#chatInput').val();
    message = `${userEmail} says: ${message}`;
    $('#chatInput').val('');

    socket.emit('sendMessage', {socketId:socketId, message:message, email:userEmail});
    updateConversations(email, message);
    updateChat();
  }

  function updateConversations(email, message){
    var currentConversations = Object.keys(socket.conversations);
    if(currentConversations.length === 0){
      socket.conversations[email] = [];
      socket.conversations[email].push(message);
      return;
    }

    if(socket.conversations[email] === undefined){
      socket.conversations[email] = [];
      socket.conversations[email].push(message);
      return;
    }

    socket.conversations[email].push(message);
  }

  function updateChat(){
    var current = $('#chatter').text();
    $('#conversation').empty();
    socket.conversations[current].forEach(message=>{
      $('#conversation').append('<li>' +message+ '</li>');
    });
  }

  function changeChatBox(){
    var email = $(this).text();
    var userId = $(this).attr('data-userId');
    $('#chatter').text(email).attr('data-userId', userId);
    updateChat();
  }

  function logout(){
    socket.emit('logout', {userId:socket.userId});
  }

  function initializeSocketIo(){
    socket = io.connect('/app');
    socket.conversations = {};
    socket.on('online', online);
    socket.on('refreshFlirts', refreshFlirts);
    socket.on('updateOnlineFlirts', updateOnlineFlirts);
    socket.on('receiveMessage', receiveMessage);
  }

  function refreshFlirts(){
    socket.emit('getOnlineFlirts', {socketId:socket.id, flirts:socket.flirts});
  }

  function updateOnlineFlirts(data){
    var flirtKeys = Object.keys(data.onlineFlirts);
    socket.onlineFlirts = data.onlineFlirts;
    console.log('-----------onlineFlirts---------');
    console.log(socket.onlineFlirts);
    $('#online-flirts').empty();
    $('#online-flirts').append('<ul id="flirts">');
    flirtKeys.forEach(flirt=>{
      $('#flirts').append(`<a><li data-socketId=${data.onlineFlirts[flirt].socketId} data-userId=${data.onlineFlirts[flirt].userId} class='chat'>${data.onlineFlirts[flirt].email}</li></a>`);
    });
  }

  function online(data){
    socket.userId = data.userId;
    socket.flirts = data.flirts;
    console.log('User Online');
    console.log(socket.userId);
    console.log('User Flirts');
    console.log(socket.flirts);
    console.log('Get Online Flirts');
    socket.emit('getOnlineFlirts', {socketId:socket.id, flirts:socket.flirts});
  }
})();
