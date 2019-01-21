var mongoose = require('mongoose');
var Schema = mongoose.Schema;

    var PartituraSchema = new Schema ({
        Path : String, 
        Voz : String,
        Clave : String,
        Afinacao : String
    });

    var IntrumentoSchema = new Schema ({
        Nome : String,
        Partitura : PartituraSchema
    });

    var ObraSchema = new Schema ({
        id : String,
        Titulo : String,
        Tipo : String,
        Compositor : String,
        Instrumentos : [IntrumentoSchema]
    })

    module.exports = mongoose.model('Obra', ObraSchema, 'obra');