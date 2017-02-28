const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for issue

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var IssueSchema = new Schema({
  name: String,

  // String, "new", "inProgress", "canceled" or "completed", the status of the issue:
  //   - Defaults to "new" when the issue is created
  //   - Change from "new" to "inProgress" to indicate that a city employee is working on the issue
  //   - Change from "new" or "inProgress" to "canceled" to indicate that a city employee has determined this is not a real issue
  //   - Change from "inProgress" to "completed" to indicate that the issue has been resolved
  status: {
    type: String,
    enum: ['new', 'inProgress', 'canceled', 'completed']

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
  localisation: {
    type: {
      type: String
    },
    // Order -> [Longitude, Lattidue]
    coordinates: [Number, Number]
  },

  // Array of Strings, user-defined tags to describe the issue (e.g. "accident", "broken")
  tags: String,

  // User, the user who reported the issue
  user: Schema.Types.ObjectId,

  // Date, the date at which the issue was reported
  created_at: Date,

  // Date, the date at which the issue was last modified
  updated_at: Date,


});

// IssueSchema.index({
//   localisation: "2dsphere"
// });

mongoose.model('Issue', IssueSchema);