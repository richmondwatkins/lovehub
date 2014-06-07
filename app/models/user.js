'use strict';

var users = global.nss.db.collection('users');
var traceur = require('traceur');
var Base =  traceur.require(__dirname + '/base.js');
var Mongo = require('mongodb');

class User {

  static create(obj, fn){
    users.findOne({email: obj.email}, (e, u)=>{
      if(!u){
        var user = new User();
        user._id = Mongo.ObjectID(obj._id);
        user.username = obj.username;
        user.email = obj.email;
        user.password = obj.password;
        user.gender = obj.gender;
        user.isDeveloper = obj.isDeveloper;
        user.seekingDeveloper = obj.seekingDeveloper;
        user.seekingGender = obj.seekingGender;

        user.zipcode = obj.zipcode;
        user.githubUsername = obj.githubUsername;
        user.developerType = obj.developerType;
        user.primaryPhoto = obj.primaryPhoto;
        user.photos = obj.photos;

        users.save(user, ()=>fn(user));

      }else{
        fn(null);
      }
    });
  } //end of create

  static login(obj, fn){
    users.findOne({email: obj.email, password: obj.password}, (e, u)=>{
      if(u){
        fn(u);
      }else{
        fn(null);
      }
    });
  } //end of login

  static findUserById(id, fn){
    Base.findById(id, users, User, fn);
  }// end of findUsersById


  static findAllUsers(fn){
    Base.findAll(users, User, fn);
  } //end of findAllUsers



  static editProfile(obj, fn){
    var id = Mongo.ObjectID(obj._id);
    users.findOne({_id: id}, (e, user)=>{
      user._id = Mongo.ObjectID(obj._id);
      user.username = obj.username;
      user.email = obj.email;
      user.password = obj.password;
      user.gender = obj.gender;
      user.isDeveloper = obj.isDeveloper;
      user.seekingDeveloper = obj.seekingDeveloper;
      user.seekingGender = obj.seekingGender;

      user.zipcode = obj.zipcode;
      user.githubUsername = obj.githubUsername;
      user.developerType = obj.developerType;
      user.githubUsername = obj.githubUsername;
      user.zipcode = obj.zipcode;
      user.developerType = obj.developerType;
      user.primaryPhoto = obj.primaryPhoto;
      user.photos = obj.photos;
      users.save(user, ()=>fn(user));
    });
  }//end of editProfile

  static uploadAlbum(photos, fn){
    console.log('photos photos photos');
    console.log(photos);
  }


} //end of Class User







module.exports = User;
