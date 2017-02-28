const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the schema for users
const userSchema = new Schema({
  firstname: {
  	type: String, minlength: 2, maxlength: 20, index: true
  },
  lastname: {
  	type: String, minlength: 2, maxlength: 20, index: true
  },
  // set date by default at now, anyway we override it below with .virtual
  date: {
  	type: Date, default: Date.now
  },
  roles: {
  	type: String, enum: ['citizen', 'manager']
  }
});

// force value to be the current date
//userSchema.virtual('date').get(function () 
//{
//    return Date.now;
//});

// Create the model from the schema and export it
module.exports = mongoose.model('User', userSchema);