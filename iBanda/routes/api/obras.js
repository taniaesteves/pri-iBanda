var express = require('express');
var router = express.Router();
var Obra = require('../../controllers/obra')
var auth = require("../../authentication/aut")

router.get('/', auth.checkBasicAuthentication, function(req, res) {
    Obra.list()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.get('/:id', auth.checkBasicAuthentication, function(req, res) {
    Obra.getObraById(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});
module.exports = router;