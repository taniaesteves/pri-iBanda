var express = require('express');
var router = express.Router();
var Noticia = require('../../controllers/noticia')

router.get('/', function(req, res) {
    Noticia.list()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.get('/:id', function(req, res) {
    Noticia.getNoticiaById(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na consulta: ' + erro))
});

router.get('/autor/:id', function(req, res) {
    Noticia.listByAutor(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.post('/', function(req, res) {
    Noticia.create(req.body)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na criação: ' + erro))
});

router.post('/edit/:id', function(req, res) {
    Noticia.edit(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na criação: ' + erro))
});

