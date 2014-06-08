/* jshint unused:false */

'use strict';

var users = global.nss.db.collection('users');
var traceur = require('traceur');
var Base =  traceur.require(__dirname + '/base.js');

class Search {


  static findAllUsers(fn){
    Base.findAll(users, Search, allUsers=>{
      fn(allUsers);
    });
  }




}

module.exports = Search;
