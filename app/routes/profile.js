'use strict';

exports.index = (req, res)=>{
  res.render('profile/index', {title: 'profile'});
};

exports.new = (req, res)=>{
  res.render('profile/new', {title: 'profile'});
};
