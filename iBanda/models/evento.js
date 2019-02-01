var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventoSchema = new Schema({
    data : String,
    hinicio : String,
    hfim : String,
    tipo : String,
    designacao : String,
    local : String,
    informacoes : String
})

module.exports = mongoose.model('Evento', EventoSchema, 'evento');