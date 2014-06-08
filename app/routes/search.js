/* jshint unused: false */
'use strict';
var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

exports.index = (req, res)=>{
    res.locals.user.findParams(results=>{
    res.locals.user.findMatches(results, matchedUsers=>{
        res.render('search/index', {matchedUsers: matchedUsers});
    });
  });
};

exports.filter = (req, res)=>{
      User.findUsersByAge(req.body, res.locals.user, users=>{
        res.render('search/filter', {users: users});
    });
  };


exports.resetSearch = (req, res)=>{
  res.locals.user.findParams(results=>{
  res.locals.user.findMatches(results, matchedUsers=>{
      res.render('search/all', {matchedUsers: matchedUsers});
    });
  });
};
