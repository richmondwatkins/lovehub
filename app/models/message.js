'use strict';

var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var Mongo = require('mongodb');
var messages = global.nss.db.collection('messages');
var _ = require('lodash');

class Message{
  static create(obj){
    console.log('THIS IS THE Content');
    console.log(obj.content);
    if(obj){   //&& obj.toId && obj.fromId && obj.subject && obj.body
      var message = new Message();
      message.toId = Mongo.ObjectID(obj.toId);
      message.toUsername = obj.toUsername;
      message.fromId = Mongo.ObjectID(obj.fromId);
      message.fromUsername = obj.fromUsername;
      message.read = false;
      message.content = obj.content;
      message.subject = obj.subject;

      messages.save(message, ()=>{});
    }else{
      return null;
    }
  }

  static findById(id, fn){
    Base.findById(id, messages, Message, fn);
  }

  static findInbox(toId, fn){
    toId = Mongo.ObjectID(toId);
    messages.find({toId:toId}).toArray((err, records)=>{
      if(records.length === 0){fn(null); return;}
      records = records.map(r=>_.create(Message.prototype, r));
      console.log('recorddssss');
      console.log(records);
      fn(records);
    });
  }

  static findSent(fromId, fn){
    fromId = Mongo.ObjectID(fromId);
    messages.find({fromId:fromId}).toArray((err, records)=>{
      if(records.length === 0){fn(null); return;}
      records = records.map(r=>_.create(Message.prototype, r));
      fn(records);
    });
  }

  markAsRead(){
    this.read = true;
  }

  get isRead(){
    return this.read;
  }

  destroy(){
    messages.remove({_id:this._id}, ()=>{});
  }
}

module.exports = Message;
