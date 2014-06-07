/* global describe, before, it, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'lovehub-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');
var cp = require('child_process');

var User;



  describe('User', function(){
  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('users').drop(function(){
    cp.execFile(__dirname + '/../../fixtures/before.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
      console.log(stdout);
      factory('user', function(users){
        done();
        });
      });
    });
  });



    describe('.create', function(){
    it('should successfully create a user', function(done){
      User.create({_id: '539210e386bba63fe0b2ddf6', username: 'dilly69', email: 'dilly69@aol.com', password: 'lookin4tits', gender: 'male', isDeveloper:true, seekingDeveloper:false, seekingGender: 'male'}, function(u){
        expect(u).to.be.ok;
        expect(u).to.be.an.instanceof(User);
        expect(u._id).to.be.an.instanceof(Mongo.ObjectID);
        // expect(u.password).to.have.length(60);
        done();
      });
    }); //end of creatinga  user

    it('should NOT create a user', function(done){
      User.create({username: 'billy69', email: 'billy69@aol.com', password: 'lookin4boobs', gender: 'male', isDeveloper:true, seekingDeveloper:false, seekingGender: 'female'}, function(u){
        expect(u).to.be.null;
      done();
      });
    });//end of NOT creating a user

  }); //end of second describe

  describe('.login', function(){
  it('should successfully log a user in', function(done){
    User.login({email: 'billy69@aol.com', password: 'lookin4boobs'}, function(u){
      expect(u).to.be.ok;
      expect(u._id).to.be.an.instanceof(Mongo.ObjectID);
      done();
      });
    });

  it('should NOT successfully log a user in', function(done){
    User.login({email: 'notAUser@aol.com', password: 'badpassword'}, function(u){
      expect(u).to.be.null;
      done();
      });
    });
  }); //end of login

  describe('.findUserById', function(){
    it('should find a user by their Id', function(done){
      User.findUserById({_id:'539210e386bba63fe0b2ddf6'}, function(u){
        done();
      });
    });
  }); //.findUserById

  describe('.findAllUsers', function(){
    it('should find all ', function(done){
      User.findAllUsers(function(u){
        done();
      });
    });
  });

  describe('.editProfile', function(){
    it('should edit a single users profile', function(done){
      User.editProfile({_id: '539210e386bba63fe0b2ddf6', username: 'jerry69', email: 'jerry69@aol.com', password: 'lookin4sex', gender: 'male', isDeveloper:true, seekingDeveloper: true, seekingGender: 'female', githubUsername: 'horndog97', zipcode: '37027', developerType: 'front-end'}, function(u){
        // "photos":[{"filename":"photo1.jpg"}, {"filename":"photo2.png"}]
        done();
      });
    });
  });

  describe('.uploadAlbum', function(){
    it('should upload new album photo(s)', function(done){
      var files = {photo: [{originalFilename: 'picture69.jpg', path:__dirname + '/../../fixtures/copy/picture69.jpg'}, {originalFilename: 'picture70.jpg', path:__dirname + '/../../fixtures/copy/picture70.jpg'}]};
      User.uploadAlbum(files, function(albums){
        console.log(albums);
      });
    });
  });

  // describe('.create', function(){
  //   it('should create a floor - absolute photo path', function(done){
  //     var fields = {name:['tile'], rate:['4.35']};
  //     var files = {photo:[{originalFilename:'tile1-DELETE.png', path:__dirname + '/../../fixtures/copy/tile1-DELETE.png', size:10}]};
  //     fields.photo = files.photo;
  //
  //     Floor.create(fields, function(floor){
  //       expect(floor).to.be.instanceof(Floor);
  //       expect(floor._id).to.be.instanceof(Mongo.ObjectID);
  //       expect(floor.rate).to.be.within(4.34, 4.36);
  //       expect(floor.name).to.equal('tile');
  //       expect(floor.photo).to.equal('/img/flooring/tile1-DELETE.png');
  //
  //       var imgExists = fs.existsSync(__dirname + '/../../../app/static/img/flooring/tile1-DELETE.png');
  //       expect(imgExists).to.be.true;
  //       done();
  //     });
  //   });



}); //end of main  describe
