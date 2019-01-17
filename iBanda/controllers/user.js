var User = require("../models/user");

module.exports.register = user =>{
  return User.create(user)
}

module.exports.getUser = (email) => {
  return User
    .findOne({email:email})
    .exec()
}

module.exports.getUserById = (id) =>{
  return User
    .findById(id)
    .exec()
}

module.exports.list = () =>{
  return User
    .find()
    //.sort{}
    .exec()
}

module.exports.listByRole = role =>{
  return User
    .find({role:role})
    //.sort({})
    .exec()
  }

// module.exports.edit = users =>{
//  return User.create(user)
// }

// module.exports.remove = (id) =>{

// }
