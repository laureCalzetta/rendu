var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Issue = require('../models/issue');

/**
 * @api {post} users Create a user
 * @apiName CreateUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Registers a new user.
 *
 * @apiUse UserInRequestBody
 * @apiUse UserInResponseBody
 * @apiUse UserValidationError
 * @apiSuccess (Response body) {String} id A unique identifier for the user generated by the server
 *
 * @apiExample Example
 *     POST /users HTTP/1.1
 *     Content-Type: application/json
 *
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe",
 *       "role": "citizen"
 *     }
 *
 * @apiSuccessExample 201 Created
 *     HTTP/1.1 201 Created
 *     Content-Type: application/json
 *     Location: https://heigvd-webserv-2017-team-2.herokuapp.com/users
 *
 *     {
 *       "id": "58c03bc9cfb9e30011edf398",
 *       "firstname": "John",
 *       "lastname": "Doe",
 *       "createdAte": "2017-03-08T17:13:45.882Z",
 *       "role": "citizen"
 *     }
 */
router.post('/', function(req, res, next) {
  // Create a new document from the JSON in the request body
  var newUser = new User(req.body);
  // Save that document
  newUser.save(function(err, savedUser) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send("There's a error : " + err);
        return;
      } else {
        res.status(500).send("There's a error : " + err);
        return;
      }
    }
      // Send the saved document in the response
    res.send(savedUser);
  });

});


/**
 * @api {get} users Get the list of issues
 * @apiName GetUsers
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the list of users.
 * @apiUse UserInResponseBody
 *
 * @apiExample Example
 *     GET /users HTTP/1.1
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     Link: https://heigvd-webserv-2017-team-2.herokuapp.com/users"
 *     [
 *       {
 *         "firstname": "Sophie",
 *         "lastname": "Donnet",
 *         "role": "manager",
 *         "createdAte": "2017-03-08T17:15:03.006Z",
 *         "id": "58b577e4ab8f2b00111b835f"
 *       },
 *       {
 *         "firstname": "John",
 *         "lastname": "Doe",
 *         "role": "citizen",
 *         "createdAte": "2017-03-08T17:13:45.882Z",
 *         "id": "58c03bc9cfb9e30011edf398"
 *       }
 *     ]
 */
router.get('/', function(req, res, next) {
  User.find().sort('name').exec(function(err, users) {
    if (err) {
      return next(err);
    }
    res.send(users);
  });
});

/**
 * @api {get} users/:id Get a specific user
 * @apiName GetUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Retrieves one user.
 *
 * @apiUse UserIdInUrlPath
 * @apiUse UserInResponseBody
 * @apiUse UserNotFoundError
 *
 * @apiExample Example
 *     GET /users/58c03bc9cfb9e30011edf398 HTTP/1.1
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     Link: https://heigvd-webserv-2017-team-2.herokuapp.com/users/58c03bc9cfb9e30011edf398
 *
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe",
 *       "role": "citizen",
 *       "createdAte": "2017-03-08T17:13:45.882Z",
 *       "id": "58c03bc9cfb9e30011edf398"
 *     }
 */
router.get('/:user_id', function(req, res, next) {
  User.findById(req.params.user_id, function(err, user) {
      const user_Id = req.params.user_id;
      if (err) {
        return userNotFound(res, user_Id);
      }
      res.send(user);
    });
});
/**
 * @api {put} users/:id Update a user
 * @apiName UpdateUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Replaces all the user's data (the request body must represent a full, valid user).
 *
 * @apiUse UserIdInUrlPath
 * @apiUse UserInRequestBody
 * @apiUse UserInResponseBody
 * @apiUse UserNotFoundError
 * @apiUse UserValidationError
 *
 * @apiExample Example
 *     PUT /users/58b577e4ab8f2b00111b835f HTTP/1.1
 *     Content-Type: application/json
 *
 *    {
 *       "firstname": "Sophie",
 *       "lastname": "Donnet-Monnet",
 *       "role": "manager",
 *       "createdAte": "2017-03-08T17:15:03.006Z",
 *       "id": "58b577e4ab8f2b00111b835f"
 *    }
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *
 *    {
 *       "firstname": "Sophie",
 *       "lastname": "Donnet-Monnet",
 *       "role": "manager",
 *       "createdAte": "2017-03-08T17:15:03.006Z",
 *       "id": "58b577e4ab8f2b00111b835f"
 *    }
 */
router.put('/:user_id', function(req, res, next) {
   User.findById(req.params.user_id, function(err, user) {
    const user_id = req.params.user_id;
    if (err) {
        return userNotFound(res, user_id);
    }
  user.firstname = req.body.firstname;
  user.lastname = req.body.lastname;
  user.role = req.body.role;

  user.save(function(err) {
      if (err) {
          if (err.name == 'ValidationError') {
            res.status(422).send("There's a error : " + err);
            return;
        } else {
            res.status(500).send("There's a error : " + err);
            return;
          }
      }
        res.send(user);
    });
  });
});


/**
 * @api {patch} users/:id Partially update a user
 * @apiName PartiallyUpdateUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Partially updates a user's data (only the properties found in the request body will be updated).
 * All properties are optional.
 *
 * @apiUse UserIdInUrlPath
 * @apiUse UserInRequestBody
 * @apiUse UserInResponseBody
 * @apiUse UserNotFoundError
 * @apiUse UserValidationError
 *
 * @apiExample Example
 *     PATCH /users/58b577e4ab8f2b00111b835f HTTP/1.1
 *     Content-Type: application/json
 *
 *    {
 *       "lastname": "Donnet",
 *    }
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *
 *    {
 *       "firstname": "Sophie",
 *       "lastname": "Donnet",
 *       "role": "manager",
 *       "createdAte": "2017-03-08T17:15:03.006Z",
 *       "id": "58b577e4ab8f2b00111b835f"
 *    }
 */
router.patch('/:user_id', function(req, res, next) {
   User.findById(req.params.user_id, function(err, user) {
    const user_id = req.params.user_id;
    if (err) {
        return userNotFound(res, user_id);
    }

    if (req.body.firstname !== undefined) {
      user.firstname = req.body.firstname;
    }
    if (req.body.lastname !== undefined) {
      user.lastname = req.body.lastname;
    }
    if (req.body.role !== undefined) {
      user.role = req.body.role;
    }
    user.save(function(err) {
      if (err) {
          if (err.name == 'ValidationError') {
            res.status(422).send("There's a error : " + err);
            return;
        } else {
            res.status(500).send("There's a error : " + err);
            return;
          }
      }
        res.send(user);
    });
  });
});


/**
 * Responds with 404 Not Found and a message indicating that the user with the specified ID was not found.
 */
function userNotFound(res, userId) {
  return res.status(404).type('text').send(`No user found with ID ${userId}`);
}

/**
 * @apiDefine UserIdInUrlPath
 * @apiParam (URL path parameters) {String} id The unique identifier of the user to retrieve
 */

/**
 * @apiDefine UserInRequestBody
 * @apiParam (Request body) {String{2..20}} firstname the user's firstname (2-20 characters)
 * @apiParam (Request body) {String{2..20}} lastname the user's lastname (2-20 characters)
 * @apiParam (Request body) {String="citizen","manager"} role The user's role (citizen or manager)
 */

/**
 * @apiDefine UserInResponseBody
 * @apiSuccess (Response body) {String} id The unique identifier of the user
 * @apiSuccess (Response body) {String} firstname The user's firstname
 * @apiSuccess (Response body) {String} lastname The user's lastname
 * @apiSuccess (Response body) {String} role The user's role
 * @apiSuccess (Response body) {String} createdAt the date at which the user was reported
 */

/**
 * @apiDefine UserNotFoundError
 *
 * @apiError {Object} 404/NotFound No user was found corresponding to the ID in the URL path
 *
 * @apiErrorExample {json} 404 Not Found
 *     HTTP/1.1 404 Not Found
 *     Content-Type: text/plain
 *
 *     No user found with ID 58b2926f5e1def0123e97bc0
 */

 /**
 * @apiDefine UserValidationError
 *
 * @apiError {Object} 422/UnprocessableEntity Some of the user's properties are invalid
 *
 * @apiErrorExample {json} 422 Unprocessable Entity
 *     HTTP/1.1 422 Unprocessable Entity
 *     Content-Type: application/json
 *
 *     There's a error : ValidationError: Path `role` is required.
 */


module.exports = router;