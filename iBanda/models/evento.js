var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HorarioSchema = new Schema({
    hinicio : String,
    hfim : String
})

var EventoSchema = new Schema({
    data : String,
    horario : HorarioSchema,
    tipo : String,
    designacao : String,
    local : String,
    informacoes : String
})

module.exports = mongoose.model('Evento', EventoSchema, 'evento');