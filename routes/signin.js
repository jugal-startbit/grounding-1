'use strict';
var express = require('express');
var router = express.Router();
var token = '';
const btoa = require('btoa');

require('crypto').randomBytes(48, function(err, buffer) {
  token = buffer.toString('hex');
});

router.post('/login',function(req, res, next){
  let UserName = req.body.username;
  let Password = req.body.password;
console.log(UserName , Password)
  if(UserName === '_lisa' && Password == '_naja') {
      res.send(JSON.stringify({
          'message': 'Successfully',
          'username': UserName,
          'role' : 'Admin',
          'token': token,
          'status': true,
      }))
  }
  else{
      res.send(JSON.stringify({
          'message': 'invalid username and password',
          'status': false,
      }))
  }

})

module.exports = router;