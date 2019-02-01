var express = require('express');
var router = express.Router();
var Evento = require('../../controllers/evento')
var auth = require("../../authentication/aut")

router.get('/', auth.checkBasicAuthentication, function(req, res) {
    Evento.listar()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.get('/:id', auth.checkBasicAuthentication, function(req, res) {
    Evento.consultar(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na consulta: ' + erro))
});

router.get('/tipo/:t', auth.checkBasicAuthentication, function(req, res) {
    Evento.listarTipo(req.params.t)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.get('/data/:d', auth.checkBasicAuthentication, function(req, res) {
    Evento.listarData(req.params.d)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.get('/dataEx/:d', auth.checkBasicAuthentication, function(req, res) {
    Evento.listarDataExact(req.params.d)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.post('/', auth.checkBasicAuthentication, function(req, res) {
    // console.log("eventos: " + JSON.stringify(req.body))
    Evento.inserir(req.body)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

module.exports = router;