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
var _ = require('lodash');

class User{

  static create(obj, fn){
      users.findOne({username: obj.fields.username[0], email: obj.fields.email[0]}, (e, u)=>{
        if(!u){
          var user = new User();
          user.username = obj.fields.username[0];
          user.age = parseInt(obj.fields.age[0]);
          user.email = obj.fields.email[0];
          user.aboutMe = obj.fields.aboutMe[0];
          user.password = bcrypt.hashSync(obj.fields.password[0], 8);
          user.gender = obj.fields.gender[0];
          user.isDeveloper = obj.fields.isDeveloper[0];
          user.seekingDeveloper = obj.fields.seekingDeveloper[0];
          user.seekingGender = obj.fields.seekingGender[0];
          user.zipcode = obj.fields.zipcode[0];
          user.githubUsername = obj.fields.githubUsername[0];
          user.developerType = obj.fields.developerType[0];
          users.save(user, ()=>user.uploadAlbum(obj.files, ()=>fn(user)));
        }else{
          fn(null);
        }
      });
  } //end of create



  static login(obj, fn){
    console.log('LOG IN INFO');
    console.log(obj);
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
         p.originalFilename = p.originalFilename.replace(/\s/g, '');
         photo.path = `/img/${user._id}/albumPhotos/${p.originalFilename}`;
         photo.name = `${p.originalFilename}`;
         photo.isPrimary = i === 0;
         photoArray.push(photo);
       });
       user.photos = photoArray;
       users.save(user, ()=>fn());
     }
   });
  }

  primaryPhotoPath(){
    var path = null;
    this.photos.forEach(p=>{
      if(p.isPrimary){
        path = p.path;
      }
    });
    return path;
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

  findParams(fn){
    var searchParams = {};
    searchParams.seekingDeveloper  = this.seekingDeveloper;
    searchParams.seekingGender = this.seekingGender;
    searchParams.seekerGender = this.gender;
    fn(searchParams);
  }

  setPrimary(path, fn){
    users.update({_id:this._id, 'photos.isPrimary':true}, {$set:{'photos.$.isPrimary':false}}, ()=>{
      users.update({_id:this._id, 'photos.path':path}, {$set:{'photos.$.isPrimary':true}}, ()=>{
        fn();
      });
    });
  }


  findMatches(params, fn){
    var user = this;
    var gender = params.seekingGender;
    var dev = params.seekingDeveloper;
    var seeker = params.seekerGender;  //found user's gender seeking preference
    console.log('GENDER');
    console.log(gender);
    console.log('DEV STATUS');
    console.log(dev);
    users.find({_id: {$ne: user._id}, gender: gender, isDeveloper: dev, seekingGender: seeker}).toArray((e, users)=>{
      users = users.map(u=>_.create(User.prototype, u));
        fn(users);
    });
  }





} //end of Class User







module.exports = User;
