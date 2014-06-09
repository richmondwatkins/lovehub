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
    var temp = {};
    temp.fields = fields;
    temp.files = files;

    User.create(temp, user=>{
      req.session.userId = user._id;
      res.redirect(`/users/${user._id}`);
    });
  });
};


exports.show = (req, res)=>{
  User.findUserById(req.params.userId, user=>{
    var path = user.primaryPhotoPath();
    res.render('users/show' , {user:user, primaryPic:path});
  });
};

exports.logout = (req, res)=>{
  req.session = null;
  res.render('home/index', {title: 'LoveHub: Home'});
};


exports.lookup = (req, res, next)=>{
  if(req.session.userId !== null){
    User.findUserById(req.session.userId, u=>{
      if(u){
        res.locals.user = u;
        next();
      }else{
        next();
      }
    });
  }else{
    next();
  }
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
  var form = new multiparty.Form();
  form.parse(req, (err, fields, files)=>{
    var temp = {};
    temp.fields = fields;
    temp.files = files;
    temp.user = res.locals.user._id;

  User.findUserById(req.params.userId, user=>{
    user.editProfile(temp, ()=>res.redirect(`/users/${user._id}`));
    });
  });
};

exports.show = (req, res)=>{
  User.findUserById(req.params.userId, user=>{
    var path = user.primaryPhotoPath();
    res.render('users/show' , {showUser:user, primaryPic:path});
  });
};
