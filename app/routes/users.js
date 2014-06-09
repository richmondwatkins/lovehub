/* jshint unused: false */

'use strict';
var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var multiparty = require('multiparty');


exports.index = (req, res)=>{
  res.render('users/index', {title: 'user'});
};

exports.new = (req, res)=>{
  res.render('users/new', {title: 'New user'});
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();
  form.parse(req, (err, fields, files)=>{
    var temp = {}; //Old Richmond wanted to run tests..what an idiot..anyway, hey man, we did this to pass one object into the factory from user.json..whatever...good luck fixing this shit up
    temp.fields = fields;
    temp.files = files;

  User.create(temp, user=>{
    req.session.userId = user._id;
    res.redirect(`/users/${user._id}`);
    });
  });
};



exports.login = (req, res)=>{
  res.render('users/login', {title: 'Portfolio: Login'});
};

exports.authenticate = (req, res)=>{
  User.login(req.body, user=>{
    if(user){
      req.session.userId = user._id;
      res.redirect(`/users/${user._id}`);
    }else{
      req.session.userId = null;
      res.redirect('/login');
    }
  });
};

exports.logout = (req, res)=>{
  req.session.userId = null;
  res.redirect('/');
};

exports.lookup = (req, res, next)=>{
  User.findUserById(req.session.userId, u=>{
    res.locals.user = u;
    next();
  });
};


exports.edit = (req, res)=>{
  User.findUserById(req.params.userId, user=>{
    res.render('users/edit', {user:user, title: 'Profile: Edit'});
  });
};

exports.update = (req, res)=>{
  console.log(req.body);
  User.findUserById(req.params.userId, user=>{
    user.editProfile(req.body, ()=>res.redirect(`/users/${user._id}`)); //Hey Guys, sup..its Old Richmond, I just got this working for y'all so if you break it its your own DAMN FAULT!!!
  });
};

exports.show = (req, res)=>{
  User.findUserById(req.params.userId, user=>{
    var path = user.primaryPhotoPath();
    res.render('users/show' , {showUser:user, primaryPic:path});
  });
};
