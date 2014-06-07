/* jshint unused:false */

'use strict';

var users = global.nss.db.collection('users');
var traceur = require('traceur');
var Base =  traceur.require(__dirname + '/base.js');
var Mongo = require('mongodb');
var mkdirp = require('mkdirp');
var fs = require('fs');
var bcrypt = require('bcrypt');
var multiparty = require('multiparty');

class User{

  static create(obj, fn){
    console.log(obj);
    var form = new multiparty.Form();
    form.parse(obj.body.photos, (err, fields, files)=>{
      console.log('FILES FILES');
      console.log(files);
      console.log('FIELDS FIELDS');
      console.log(fields);
    users.findOne({username: obj.username, email: obj.email}, (e, u)=>{
      if(!u){
        var user = new User();
        user._id = Mongo.ObjectID(obj._id);
        user.username = obj.username;
        user.age = parseInt(obj.age);
        user.email = obj.email;
        user.aboutMe = obj.aboutMe;
        user.password = bcrypt.hashSync(obj.password, 8);
        user.gender = obj.gender;
        user.isDeveloper = obj.isDeveloper;
        user.seekingDeveloper = obj.seekingDeveloper;
        user.seekingGender = obj.seekingGender;

        user.zipcode = obj.zipcode;
        user.githubUsername = obj.githubUsername;
        user.developerType = obj.developerType;
        user.uploadAlbum(obj.photos, ()=>users.save(user, ()=>fn(user)));

      }else{
        fn(null);
      }
      });
    });
  } //end of create

  static login(obj, fn){
    users.findOne({email: obj.email}, (e, u)=>{
      if(u){
        var isMatch = bcrypt.compareSync(obj.password, u.password);
        if(isMatch){
          fn(u);
        }else{
          fn(null);
        }
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



  editProfile(obj, fn){
    var user = this;
    var id = Mongo.ObjectID(obj._id);
      user._id = Mongo.ObjectID(obj._id);
      user.age = parseInt(obj.age);
      user.username = obj.username;
      user.email = obj.email;
      user.aboutMe = obj.aboutMe;
      user.password = bcrypt.hashSync(obj.password, 8);
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
      user.photos = obj.photos;
      users.save(user, ()=>fn());
  }//end of editProfile

    uploadAlbum(files, fn){
      var user = this;
    mkdirp(`${__dirname}/../static/img/${user._id}/albumPhotos`, function(err) {
     if(err){
       console.error(err);
     }else{
        var photoArray = [];
        files.photo.forEach((p, i)=>{
           fs.renameSync(files.photo[i].path,`${__dirname}/../static/img/${user._id}/albumPhotos/${p.originalFilename}`);
           var photo = {};
          //  photo.isPrimary = false;
           photo.path = `/img/${user._id}/albumPhotos/${p.originalFilename}`;
           photo.name = `${p.originalFilename}`;
           photoArray.push(photo);
         });
       user.photos = photoArray;
       users.save(user, ()=>fn());
     }
   });
  }


  coverPhoto(files, fn){
    // if(files.length!==1){fn(null); return;}
    var user = this;
    var coverphoto = {};
    mkdirp(`${__dirname}/../static/img/${user._id}/coverPhoto`, function(err){
      if(err){
        console.error(err);
      }else{
        files.coverPhoto.forEach(p=>{fs.renameSync(files.coverPhoto[0].path, `${__dirname}/../static/img/${user._id}/coverPhoto/${p.originalFilename}`);
        coverphoto.path = `/img/${user._id}/coverPhoto/${p.originalFilename}`;
        coverphoto.name = `${p.originalFilename}`;
        });
      }
      user.coverPhoto = coverphoto;
      users.save(user, ()=>fn());
    });
  }


  setPrimary(path, fn){
    users.update({_id:this._id, 'photos.isPrimary':true}, {$set:{'photos.$.isPrimary':false}}, ()=>{
      users.update({_id:this._id, 'photos.path':path}, {$set:{'photos.$.isPrimary':true}}, ()=>{
        fn();
      });
    });
  }







} //end of Class User







module.exports = User;
