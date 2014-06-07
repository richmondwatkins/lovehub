'use strict';

exports.index = (req, res)=>{
  res.render('profile/index', {title: 'Profile'});
};

exports.new = (req, res)=>{
  res.render('profile/new', {title: 'New Profile'});
};
