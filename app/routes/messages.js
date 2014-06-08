'use strict';

exports.index = (req, res)=>{
  res.render('messages/index', {title: 'messages'});
};
