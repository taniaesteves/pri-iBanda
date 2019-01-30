var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoticiaSchema = new Schema (
    {
    titulo : {type: String, required: true},
    texto : String,
    data: String,
    autor: {type:String, required: true},
});

module.exports = mongoose.model('Noticia', NoticiaSchema, 'noticia');