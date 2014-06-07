'use strict';

var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var Mongo = require('mongodb');
var messages = global.nss.db.collection('messages');
var _ = require('lodash');

class Message{
  static create(obj, fn){
    if(obj && obj.toId && obj.fromId && obj.subject && obj.body){
      obj.toId = Mongo.ObjectID(obj.toId);
      obj.fromId = Mongo.ObjectID(obj.fromId);
      obj.read = false;
      messages.save(obj, ()=>fn(obj));
    }else{
      fn(null);
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
