/* jshint unused: false */
'use strict';
var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

exports.index = (req, res)=>{
    res.locals.user.findParams(results=>{
      User.findMatches(results, matchedUsers=>{
        res.render('search/index', {matchedUsers: matchedUsers});
    });
  });
};
