const debug = require('debug')('demo:issues');
const express = require('express');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const User = require('../models/user');
const Issue = require('../models/issue');

const router = express.Router();

/**
 * @api {post} /api/issues Create a issue
 * @apiName CreateIssue
 * @apiGroup Issues
 * @apiVersion 1.0.0
 * @apiDescription Registers a new Issue.
 *
 * @apiUse IssueInRequestBody
 * @apiUse IssueInResponseBody
 * @apiUse IssueValidationError
 * @apiSuccess (Response body) {String} id A unique identifier for the issue generated by the server
 *
 * @apiExample Example
 *     POST /issues HTTP/1.1
 *     Content-Type: application/json
 *
 *		{
 *			"user": "58b6891d5eb8a407e3813cf9",
 *			"latitude": 55,
 *			"longitude": 10,
 *			"status": "new",
 *			"tags": ["test1","hello"]
 *		}
 *
 * @apiSuccessExample 201 Created
 *     HTTP/1.1 201 Created
 *     Content-Type: application/json
 *     Location: https://heigvd-webserv-2017-team-2.herokuapp.com/issues/58b6a5dddade2b0d08fc16d2
 *
 *	   {
 *       "__v":0,
 *       "user":"58b6891d5eb8a407e3813cf9",
 *       "latitude":55,
 *       "longitude":10,
 *       "_id":"58b6a5dddade2b0d08fc16d2",
 *       "created_at":"2017-03-01T10:43:41.757Z",
 *       "tags":["test1","hello"],
 *       "status":"new"
 *     }
 */
router.post('/', function(req, res, next) {
  // Create a new document from the JSON in the request body
  var newIssue = new Issue(req.body);
  // Save that document
  newIssue.save(function(err, savedIssue) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send("l'erreur suivante est survenue : " + err);
        return;
      } else {
        res.status(500).send("l'erreur suivante est survenue : " + err);
        return;
      }
    }
      // Send the saved document in the response
    res.send(savedUser);
  });
});

/**
 * @api {get} /api/issues List issues
 * @apiName RetrieveIssues
 * @apiGroup Issue
 * @apiVersion 1.0.0
 * @apiDescription Retrieves a paginated list of issues.
 *
 * @apiUse IssueInResponseBody
 *
 * @apiExample Example
 *     GET /issues HTTP/1.1
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     Link: &lthttps://heigvd-webserv-2017-team-2.herokuapp.com/issues/58b6a5dddade2b0d08fc16d2; rel="first prev"
 *     [
 * 		{
 * 			"_id": "58b69f71bf8a230c1bd6727c",
 *   		"latitude": 10,
 *   		"longitude": 10,
 *   		"user": "58b6891d5eb8a407e3813cf9",
 *  		"__v": 0,
 *   		"created_at": "2017-03-01T10:16:17.525Z",
 *   		"tags": [
 *     			"tag1",
 *     			"tag2"
 *			],
 *   		"status": "new"
 * 		},
 * 		{
 * 			"_id": "58b69f973967d90c236645dd",
 *   		"latitude": 55,
 *   		"longitude": 10,
 *   		"user": "58b6891d5eb8a407e3813cf9",
 *  		"__v": 0,
 *   		"created_at": "2017-03-01T10:40:17.525Z",
 *   		"tags": [
 *     			"tag3",
 *     			"tag4"
 *			],
 *   		"status": "new"
 * 		}
 *     ]
 */
router.get('/', function(req, res, next) {
  Issue.find().sort('name').exec(function(err, issues) {
    if (err) {
      return next(err);
    }
    res.send(issues);
  });


});

/**
 * @api {get} /api/issues List issues
 * @apiName RetrieveFilterIssues
 * @apiGroup Issue
 * @apiVersion 1.0.0
 * @apiDescription Retrieves a paginated filter list of issues.
 *
 * @apiUse IssueInResponseBody
 *
 * @apiParam (URL query parameters) {String} [creator] Select only issues created by the user with the specified ID (this parameter can be given multiple times)
 *
 * @apiExample Example
 *     GET /api/issues/issues/user/58b6891d5eb8a407e3813cf9 HTTP/1.1
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     Link: ?????? &lt;https://evening-meadow-25867.herokuapp.com/api/issues?page=1&pageSize=50&gt;; rel="first prev"
 *     [
 * 		{
 * 			"_id": "58b69f71bf8a230c1bd6727c",
 *   		"latitude": 10,
 *   		"longitude": 10,
 *   		"user": "58b6891d5eb8a407e3813cf9",
 *  		"__v": 0,
 *   		"created_at": "2017-03-01T10:16:17.525Z",
 *   		"tags": [
 *     			"tag1",
 *     			"tag2"
 *			],
 *   		"status": "new"
 * 		},
 * 		{
 * 			"_id": "58b69f973967d90c236645dd",
 *   		"latitude": 55,
 *   		"longitude": 10,
 *   		"user": "58b6891d5eb8a407e3813cf9",
 *  		"__v": 0,
 *   		"created_at": "2017-03-01T10:40:17.525Z",
 *   		"tags": [
 *     			"tag3",
 *     			"tag4"
 *			],
 *   		"status": "new"
 * 		}
 *     ]
 */
router.get('/user/:id', function(req, res, next) {
  let query = Issue.find();

//  Filter issues by user
    if (ObjectId.isValid(req.params.id)) {
    		query = query.where('user').equals(req.params.id);
 	  }
  else
    return res.type('text').send("Aucun résultat trouvé");

  // Execute the query
  query.exec(function(err, issues) {
    if (err) {
      return next(err);
    }
    res.send(issues);
  });
});

/**
 * @api {get} /api/issues/:id Retrieve a issue
 * @apiName RetrieveIssue
 * @apiGroup Issue
 * @apiVersion 1.0.0
 * @apiDescription Retrieves one issue.
 *
 * @apiUse IssueIdInUrlPath
 * @apiUse IssueInResponseBody
 * @apiUse IssueNotFoundError
 *
 * @apiExample Example
 *     GET /api/issues/58b2926f5e1def0123e97281 HTTP/1.1
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *
 * 		{
 * 			"_id": "58b2926f5e1def0123e97281",
 *   		"latitude": 55,
 *   		"longitude": 10,
 *   		"user": "58b6891d5eb8a407e3813cf9",
 *  		"__v": 0,
 *   		"created_at": "2017-03-01T10:40:17.525Z",
 *   		"tags": [
 *     			"tag3",
 *     			"tag4"
 *			],
 *   		"status": "new"
 * 		}
 */
router.get('/:id', function(req, res, next) {
  Issue.findById(req.params.id, function(err, issue) {
      const id = req.params.id;
      if (err) {
        return issueNotFound(res, id);
      }
	    res.send(issue);
    });
});


/**
 * @api {delete} /api/issues/:id Delete a issue
 * @apiName DeleteIssue
 * @apiGroup Issue
 * @apiVersion 1.0.0
 * @apiDescription Permanently deletes a issue.
 *
 * @apiUse IssueIdInUrlPath
 * @apiUse IssueNotFoundError
 *
 * @apiExample Example
 *     DELETE /api/issues/58b2926f5e1def0123e97bc0 HTTP/1.1
 *
 * @apiSuccessExample 204 No Content
 *     HTTP/1.1 204 No Content
 */
router.delete('/:id', function(req, res, next) {
	Issue.findById(req.params.id, function(err, issue) {
	        if (err) {
		      return next(err);
		    }
		    issue.remove(function(err) {
		    if (err) {
		      return next(err);
		    }

		    res.sendStatus(204);
	 		});
    });

});

/**
 * @api {patch} /api/issues/:id Partially update a issue
 * @apiName PartiallyUpdateIssue
 * @apiGroup Issue
 * @apiVersion 1.0.0
 * @apiDescription Partially updates a issue's data (only the properties found in the request body will be updated).
 * All properties are optional.
 *
 * @apiUse IssueIdInUrlPath
 * @apiUse IssueInRequestBody
 * @apiUse IssueInResponseBody
 * @apiUse IssueNotFoundError
 * @apiUse IssueValidationError
 *
 * @apiExample Example
 *     PATCH /api/issues/58b69f71bf8a230c1bd6727c HTTP/1.1
 *     Content-Type: application/json
 *
 *     {
 *       "latitude": "34"
 *     }
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *
 * 		{
 * 			"_id": "58b69f71bf8a230c1bd6727c",
 *   		"latitude": 34,
 *   		"longitude": 10,
 *   		"user": "58b6891d5eb8a407e3813cf9",
 *  		"__v": 0,
 *  		"updated_at": "2017-03-01T12:06:29.342Z",
 *   		"created_at": "2017-03-01T10:16:17.525Z",
 *   		"tags": [
 *     			"tag1",
 *     			"tag2"
 *			],
 *   		"status": "new"
 * 		}
 *
 */
router.patch('/:id', function(req, res, next) {

  Issue.findById(req.params.id, function(err, issue) {
  	const id = req.params.id;
    if (err) {
        return issueNotFound(res, id);
    }

    if (req.body.status !== undefined) {
    	issue.status = req.body.status;
    }
    if (req.body.description !== undefined) {
    	issue.description = req.body.description;
    }
    if (req.body.imageUrl !== undefined) {
    	issue.imageUrl = req.body.imageUrl;
    }
    if (req.body.latitude !== undefined) {
    	issue.latitude = req.body.latitude;
    }
    if (req.body.longitude !== undefined) {
    	issue.longitude = req.body.longitude;
    }
    if (req.body.tags !== undefined) {
    	issue.tags = req.body.tags;
    }
    if (req.body.user !== undefined) {
    	issue.user = req.body.user;
    }

    issue.updated_at = Date.now();

    issue.save(function(err) {
     	if (err) {
	      	if (err.name == 'ValidationError') {
		        res.status(422).send("l'erreur suivante est survenue : " + err);
		        return;
		    } else {
		        res.status(500).send("l'erreur suivante est survenue : " + err);
		        return;
		      }
    	}
	    res.send(issue);

    });


  });
});

/**
 * @api {put} /api/issues/:id Update a issue
 * @apiName UpdateIssue
 * @apiGroup Issue
 * @apiVersion 1.0.0
 * @apiDescription Replaces all the issue's data (the request body must represent a full, valid issue).
 *
 * @apiUse IssueIdInUrlPath
 * @apiUse IssueInRequestBody
 * @apiUse IssueInResponseBody
 * @apiUse IssueNotFoundError
 * @apiUse IssueValidationError
 *
 * @apiExample Example
 *     PUT /api/issues/58b69f71bf8a230c1bd6727c HTTP/1.1
 *     Content-Type: application/json
 *
 * 		{
 * 			"_id": "58b69f71bf8a230c1bd6727c",
 *   		"latitude": 34,
 *   		"longitude": 10,
 *   		"user": "58b6891d5eb8a407e3813cf9",
 *  		"__v": 0,
 *   		"created_at": "2017-03-01T10:16:17.525Z",
 *   		"tags": [
 *     			"tag1",
 *     			"tag2"
 *			],
 *   		"status": "inProgress"
 * 		}
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *
 * 		{
 * 			"_id": "58b69f71bf8a230c1bd6727c",
 *   		"latitude": 34,
 *   		"longitude": 10,
 *   		"user": "58b6891d5eb8a407e3813cf9",
 *  		"__v": 0,
 *			"updated_at": "2017-03-01T12:05:30.640Z",
 *   		"created_at": "2017-03-01T10:16:17.525Z",
 *   		"tags": [
 *     			"tag1",
 *     			"tag2"
 *			],
 *   		"status": "inProgress"
 * 		}
 */
router.put('/:id', function(req, res, next) {

  // Update all properties (regardless of whether the are present in the request body or not)
  Issue.findById(req.params.id, function(err, issue) {

  	const id = req.params.id;
    if (err) {
        return issueNotFound(res, id);
    }

	issue.status = req.body.status;
	issue.description = req.body.description;
	issue.imageUrl = req.body.imageUrl;
	issue.latitude = req.body.latitude;
	issue.longitude = req.body.longitude;
	issue.tags = req.body.tags;
	issue.user = req.body.user;
	issue.updated_at = Date.now();

    issue.save(function(err) {
      if (err) {
          if (err.name == 'ValidationError') {
            res.status(422).send("l'erreur suivante est survenue : " + err);
            return;
        } else {
            res.status(500).send("l'erreur suivante est survenue : " + err);
            return;
          }
      }
   		res.send(issue);

    });

  });
});


/**
 * Responds with 404 Not Found and a message indicating that the issue with the specified ID was not found.
 */
function issueNotFound(res, issueId) {
  return res.status(404).type('text').send(`No issue found with ID ${issueId}`);
}

/**
 * @apiDefine IssueIdInUrlPath
 * @apiParam (URL path parameters) {String} id The unique identifier of the issue to retrieve
 */

/**
 * @apiDefine IssueInRequestBody
 * @apiParam (Request body) {String="new","inProgress", "canceled", "completed"} status The status of the issue (default: new)
 * @apiParam (Request body) {String{0..1000}} [description] (Optional) The description of the issue
 * @apiParam (Request body) {String{0..500}} [url] (Optional) The url of the picture
 * @apiParam (Request body) {Number{0..30}} [latitude] (Optional) the latitude (part of the coordinates indicating where the issue is)
 * @apiParam (Request body) {Number{-180..180}} [longitude] (Optional) the longitude (part of the coordinates indicating where the issue is)
 * @apiParam (Request body) {[String]} [tag] (Optional) Array of Strings, user-defined tags to describe the issue
 * @apiParam (Request body) {String} user A hyperlink reference to the user who created the issue
 */

/**
 * @apiDefine IssueInResponseBody
 * @apiSuccess (Response body) {String} id The unique identifier of the issue
 * @apiSuccess (Response body) {String} status The status of the issue
 * @apiSuccess (Response body) {Number} latitude the latitude (part of the coordinates indicating where the issue is)
 * @apiSuccess (Response body) {Number} longitude the longitude the longitude (part of the coordinates indicating where the issue is)
 * @apiSuccess (Response body) {String} user A hyperlink reference to the user who created the issue
 * @apiSuccess (Response body) {String} createdAt the date at which the issue was reported
 */

/**
 * @apiDefine IssueNotFoundError
 *
 * @apiError {Object} 404/NotFound No issue was found corresponding to the ID in the URL path
 *
 * @apiErrorExample {json} 404 Not Found
 *     HTTP/1.1 404 Not Found
 *     Content-Type: text/plain
 *
 *     No issue found with ID 58b2926f5e1def0123e97bc0
 */

 /**
 * @apiDefine IssueValidationError
 *
 * @apiError {Object} 422/UnprocessableEntity Some of the issue's properties are invalid
 *
 * @apiErrorExample {json} 422 Unprocessable Entity
 *     HTTP/1.1 422 Unprocessable Entity
 *     Content-Type: application/json
 *
 *     l'erreur suivante est survenue : ValidationError: `fdg` is not a valid enum value for path `status`.
 */

module.exports = router;