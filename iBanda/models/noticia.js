var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoticiaSchema = new Schema (
    {
    titulo : {type: String, required: true},
    pretitulo : String,
    descricao : String,
    infos : String,
    data: String,
    autor: {type:String, required: true},
    visivel: Boolean
});

module.exports = mongoose.model('Noticia', NoticiaSchema, 'noticia');