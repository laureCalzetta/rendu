var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Issue = require('../models/issue');


/* GET users listing */
router.get('/', function(req, res, next) {
  User.find().sort('name').exec(function(err, users) {
    if (err) {
      return next(err);
    }
    res.send(users);
  });
});

/* GET find a user */
router.get('/:user_id', function(req, res, next) {

  User.findById(req.params.user_id, function(err, user) {
         if (err) {
        return next(err);
      }
      res.send(user);
    });
});


/* POST new user */
router.post('/', function(req, res, next) {
  // Create a new document from the JSON in the request body
  var newUser = new User(req.body);
  // Save that document
  newUser.save(function(err, savedUser) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    // Send the saved document in the response
    res.send(savedUser);
  });
});

router.put('/:user_id', function(req, res, next) {
   User.findById(req.params.user_id, function(err, user) {
    if (err) {
      return next(err);
    }

  user.firstname = req.body.firstname;
  user.lastname = req.body.lastname;
  user.roles = req.body.roles;

    user.save(function(err) {
        if (err) {
          return next(err);
        }
    });

    res.send(user);
  });

});

router.patch('/:user_id', function(req, res, next) {
   User.findById(req.params.user_id, function(err, user) {

    if (req.body.firstname !== undefined) {
      user.firstname = req.body.firstname;
    }
    if (req.body.lastname !== undefined) {
      user.lastname = req.body.lastname;
    }
    if (req.body.roles !== undefined) {
      user.roles = req.body.roles;
    }

    user.save(function(err) {
        if (err) {
        return next(err);
      }

    });

    res.send(user);
  });

});


module.exports = router;