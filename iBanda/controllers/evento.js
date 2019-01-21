var Evento = require("../models/evento");

module.exports.create = evento =>{
  return Evento.create(evento)
}

module.exports.getEvento = (titulo) => {
  return Evento
    .findOne({Designacao:titulo})
    .exec()
}

module.exports.getEventoById = (id) =>{
  return Evento
    .findById(id)
    .exec()
}

module.exports.list = () =>{
  return Evento
    .find()
    //.sort{}
    .exec()
}

module.exports.listByLocal = local =>{
  return Evento
    .find({Local:local})
    //.sort({})
    .exec()
  }



module.exports.listByData = data =>{
    return Evento
      .find({Data:data})
      //.sort({})
      .exec()
    }