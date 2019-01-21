var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HorarioSchema = new Schema({
    hinicio : String,
    hfim : String
})

var EventoSchema = new Schema({
    Data : String,
    Horario : HorarioSchema,
    Tipo : String,
    Designacao : String,
    Local : String,
    Informacoes : String
})

module.exports = mongoose.model('Evento', EventoSchema, 'evento');