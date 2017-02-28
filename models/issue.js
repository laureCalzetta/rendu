// const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;
// const Schema = mongoose.Schema;

// /**
//  * A issue created by a user. For create a issue
//  * It's necessary to havea a status, a localisation, a creator and the date of creation.
//  * And optional a name, a description, a image URL, somes tags.
//  * When the issue is modified, the date of the last modification.
//  */

// const issueSchema = new Schema({
//   // Name of Issue
//   name: String,

//   // String, "new", "inProgress", "canceled" or "completed", the status of the issue:
//   //   - Defaults to "new" when the issue is created
//   //   - Change from "new" to "inProgress" to indicate that a city employee is working on the issue
//   //   - Change from "new" or "inProgress" to "canceled" to indicate that a city employee has determined this is not a real issue
//   //   - Change from "inProgress" to "completed" to indicate that the issue has been resolved
//   status: {
//     type: String,
//     require: true,
//     enum: ['new', 'inProgress', 'canceled', 'completed']

//   // (Optional) String, 1000 characters max, a detailed description of the issue
//   description: {
//     type: String, maxlength: 1000
//   },

//   // (Optional) String, 500 characters max, a URL to a picture of the issue
//   imageUrl: {
//     type: String, maxlength: 500
//   },

//   // Number, the longitude (part of the coordinates indicating where the issue is)
//   // Number, the latitude (part of the coordinates indicating where the issue is)
//   // Standard agreement of GéoJson (geojson.org)
//   localisation: {
//     type: {
//       type: String
//     },
//     // Order -> [Longitude, Lattidue]
//     coordinates: [Number, Number],
//     require: true
//   },

//   // (Optional) Array of Strings, user-defined tags to describe the issue (e.g. "accident", "broken")
//   tags: [ { type: String } ]

//   // User, the user who reported the issue. He's the creator
//   creator: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     require: true,
//     validate: {
//       // Validate that the creator is a valid ObjectId
//       // and references an existing user
//       validator: validateCreator
//     }
//   }
//   }

//   // Date, the date at which the issue was reported
//   created_at: {
//     type: Date,
//     require: true,
//     default: Date.now
//   }

//   // Date, the date at which the issue was last modified
//   // quand on l'appelle on met Date.now()
//   updated_at: {
//     type: Date
//   }

// });

// /**
//  * Add a virtual "creatorHref" property:
//  *
//  * * "issue.creatorHref" will return the result of calling getCreatorHref with the issue as this
//  * * "issue.creatorHref = value" will return the result of calling setCreatorHref with the issue as this and value as an argument
//  */
// issueSchema.virtual('creatorHref').get(getCreatorHref).set(setCreatorHref);

// // Customize the behavior of issue.toJSON() (called when using res.send)
// issueSchema.set('toJSON', {
//   transform: transformJsonIssue, // Modify the serialized JSON with a custom function
//   virtuals: true // Include virtual properties when serializing documents to JSON
// });


// /**
//  * Given a user ID, ensures that it references an existing user.
//  *
//  * If it's not the case or the ID is missing or not a valid object ID,
//  * the "directorHref" property is invalidated instead of "director".
//  * (That way, the client gets an error on "creatorHref", which is the
//  * property they sent, rather than "creator", which they don't know.)
//  */
// function validateCreator(value, callback) {
//   if (!value && !this._creatorHref) {
//     this.invalidate('creatorHref', 'Path `creatorHref` is required', value, 'required');
//     return callback();
//   } else if (!ObjectId.isValid(value)) {
//     this.invalidate('creatorHref', 'Path `creatorHref` is not a valid User reference', this._creatorHref, 'resourceNotFound');
//     return callback();
//   }

//   mongoose.model('User').findOne({ _id: ObjectId(value) }).exec(function(err, user) {
//     if (err || !user) {
//       this.invalidate('creatorHref', 'Path `creatorHref` does not reference a User that exists', this._creatorHref, 'resourceNotFound');
//     }
//     callback();
//   });
// }


// /**
//  * Returns the hyperlink to the issue's creator.
//  * (If the creator has been populated, the _id will be extracted from it.)
//  */
// function getCreatorHref() {
//   return `/api/users/${this.creator._id || this.creator}`;
// }

// /**
//  * Sets the issue's creator from a person hyperlink.
//  */
// function setCreatorHref(value) {
//   // Store the original hyperlink
//   this._creatorHref = value;

//   // Remove "/api/users/" from the beginning of the value
//   const userId = value.replace(/^\/api\/users\//, '');

//   if (ObjectId.isValid(userId)) {
//     // Set the creator if the value is a valid MongoDB ObjectId
//     this.creator = userId;
//   } else {
//     // Unset the creator otherwise
//     this.creator = null;
//   }
// }