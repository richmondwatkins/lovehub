'use strict';

exports.index = (req, res)=>{
  res.render('home/index', {title: 'loveHub'});
};

exports.about = (req, res)=>{
  res.render('home/about', {title: 'loveHub'});
};
