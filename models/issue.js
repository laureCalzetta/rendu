const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;

/**
 * A issue created by a user. For create a issue
 * It's necessary to havea a status, a localisation, a creator and the date of creation.
 * And optional a name, a description, a image URL, somes tags.
 * When the issue is modified, the date of the last modification.
 */

const issueSchema = new Schema({


  // String, "new", "inProgress", "canceled" or "completed", the status of the issue:
  //   - Defaults to "new" when the issue is created
  //   - Change from "new" to "inProgress" to indicate that a city employee is working on the issue
  //   - Change from "new" or "inProgress" to "canceled" to indicate that a city employee has determined this is not a real issue
  //   - Change from "inProgress" to "completed" to indicate that the issue has been resolved
  status: {
    type: String,
    required: true,
    enum: ['new', 'inProgress', 'canceled', 'completed'],
    default: "new"
  },

  // (Optional) String, 1000 characters max, a detailed description of the issue
  description: {
    type: String, maxlength: 1000
  },

  // (Optional) String, 500 characters max, a URL to a picture of the issue
  imageUrl: {
    type: String, maxlength: 500
  },

  // Number, the longitude (part of the coordinates indicating where the issue is)
  // Number, the latitude (part of the coordinates indicating where the issue is)
  // Standard agreement of GéoJson (geojson.org)
  latitude: {
    type: Number,
    required: true,
    min: 0,
    max: 90,
    required: true
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180,
    required: true
  },


  // (Optional) Array of Strings, user-defined tags to describe the issue (e.g. "accident", "broken")
  tags:{
  	type: [String],
    required: true
  },

  // User, the user who reported the issue. He's the creator
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
     // Validate that the user is a valid ObjectId (exsit)
     validator: validateUser
   }
  },

  // Date, the date at which the issue was reported
  created_at: {
    type: Date,
    default: Date.now
  },

  // Date, the date at which the issue was last modified
  // quand on l'appelle on met Date.now()
  updated_at: {
    type: Date
  }

});

//validate if user exist
function validateUser(value, callback) {
  mongoose.model('User').findOne({ _id: ObjectId(value) }).exec(function(err, user) {
    if (err || !user) {
      return next(err);
    }
    callback();
  });
}

module.exports = mongoose.model('Issue', issueSchema);