var Obra = require("../models/obra");

module.exports.create = obra =>{
  return Obra.create(obra)
}

module.exports.getObra = (titulo) => {
  return Obra
    .findOne({Titulo:titulo})
    .exec()
}

module.exports.getObraById = (id) =>{
  return Obra
    .findById(id)
    .exec()
}

module.exports.list = () =>{
  return Obra
    .find()
    //.sort{}
    .exec()
}

module.exports.listByCompositor = compositor =>{
  return Obra
    .find({Compositor:compositor})
    //.sort({})
    .exec()
  }