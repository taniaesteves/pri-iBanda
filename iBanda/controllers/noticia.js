var Noticia = require("../models/noticia");

module.exports.create = noticia =>{
    return Noticia.create(noticia)
}

module.exports.edit = id =>{
    return Noticia
        .update({_id: id},{$set :{token :12345}}) //o campo token é o campo que se pretende alterar
        .exec()    
}

module.exports.getNoticia = (titulo) => {
    return Noticia
      .findOne({Titulo:titulo})
      .exec()
  }

module.exports.getNoticiaById = (id) =>{
    return Noticia
      .findById(id)
      .exec()
}

module.exports.list = () =>{
    return Noticia
      .find()
      .sort({data: -1})
      .exec()
  }

// Lista os eventos na data D
module.exports.listDataExact = data => {
    return Noticia
        .find({data: data})
        .sort({data: -1})
        .exec()
}

module.exports.listByAutor = autor =>{
    return Noticia
      .find({Autor:autor})
      //.sort({})
      .exec()
    }