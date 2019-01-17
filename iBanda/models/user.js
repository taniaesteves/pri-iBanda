var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema(
  {
  name: {type :String, required:true},
  username: {type :String, required:true},
  email: {type: String, required:true},   // todo: unique email?
  role: {type :String, required:true},
  password: {type :String, required:true}
  }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('UserSchema', UserSchema, 'users');