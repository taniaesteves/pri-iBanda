var express = require('express');
var router = express.Router();
var Evento = require('../../controllers/evento')

router.get('/', function(req, res) {
    Evento.listar()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.get('/test/:id', function(req, res) {
    Evento.consultar(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na consulta: ' + erro))
});

router.get('/tipo/:t', function(req, res) {
    Evento.listarTipo(req.params.t)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.get('/data/:d', function(req, res) {
    Evento.listarData(req.params.d)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.get('/dataEx/:d', function(req, res) {
    Evento.listarDataExact(req.params.d)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.post('/', function(req, res) {
    var params = {
		data: req.body.data, hinicio: req.body.hinicio, hfim: req.body.hfim,
        tipo: req.body.tipo, designacao: req.body.designacao, local: req.body.local,
        informacoes: req.body.informacoes}
    console.log("eventos: " + JSON.stringify(req.body))
    Evento.inserir(params)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

module.exports = router;