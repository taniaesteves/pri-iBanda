var mongoose = require('mongoose');
var Schema = mongoose.Schema;

    var PartituraSchema = new Schema ({
        path : String, 
        voz : String,
        clave : String,
        afinacao : String
    });

    var IntrumentoSchema = new Schema ({
        nome : String,
        partitura : PartituraSchema
    });

    var ObraSchema = new Schema ({
        id : String,
        titulo : String,
        tipo : String,
        compositor : String,
        instrumentos : [IntrumentoSchema]
    })

    module.exports = mongoose.model('Obra', ObraSchema, 'obra');