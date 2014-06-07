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
    var form = new multiparty.Form();
    form.parse(obj, (err, fields, files)=>{
      users.findOne({username: fields.username[0], email: fields.email[0]}, (e, u)=>{
        if(!u){
          var user = new User();
          user.username = fields.username[0];
          user.age = parseInt(fields.age[0]);
          user.email = fields.email[0];
          user.aboutMe = fields.aboutMe[0];
          user.password = bcrypt.hashSync(fields.password[0], 8);
          user.gender = fields.gender[0];
          user.isDeveloper = fields.isDeveloper[0];
          user.seekingDeveloper = fields.seekingDeveloper[0];
          user.seekingGender = fields.seekingGender[0];
          user.zipcode = fields.zipcode[0];
          user.githubUsername = fields.githubUsername[0];
          user.developerType = fields.developerType[0];
          user.uploadAlbum(files, ()=>users.save(user, ()=>fn(user)));

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
       files.photos.forEach((p, i)=>{
        fs.renameSync(files.photos[i].path,`${__dirname}/../static/img/${user._id}/albumPhotos/${p.originalFilename}`);
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
