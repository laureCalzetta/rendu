const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/**
 * A user with a firstname, a lastname, a roles et the date. 
 * Two users must not have the same first and last name
 */

const userSchema = new Schema({

  // firstName - String, 2-20 characters
  firstname: {
    type: String,
    minlength: 2,
    maxlength: 20,
    required: true
  },

  // lastName - String, 2-20 characters
  lastname: {
    type: String,
    minlength: 2,
    maxlength: 20,
    required: true
  },
  // createdAt - Date, the date at which the user was registered
  //set date by default at now, anyway we override it below with .virtual
  createdAte: {
    type: Date,
    default: Date.now
  },

  // role - String, "citizen" or "manager"
  roles: {
    type: String,
    enum: ['citizen', 'manager'],
    required: true
  }
});

// Customize the behavior of user.toJSON() (called when using res.send)
userSchema.set('toJSON', {
  transform: transformJsonUser, // Modify the serialized JSON with a custom function
  virtuals: true // Include virtual properties when serializing documents to JSON
});


/**
 * Given a firstname and lastname, calls the callback function with true if no user exists with that firstname and lastname
 */
userSchema.index({ firstname: 1, lastname: 1  }, { unique: true });

/**
 * Removes extra MongoDB properties from serialized people.
 */
function transformJsonUser(doc, json, options) {

  // Remove MongoDB _id & __v (there's a default virtual "id" property)
  delete json._id;
  delete json.__v;

  return json;
}


// Create the model from the schema and export it
module.exports = mongoose.model('User', userSchema);