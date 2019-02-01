var express = require('express');
var router = express.Router();
var Noticia = require('../../controllers/noticia')
var auth = require("../../authentication/aut")

router.get('/', auth.checkBasicAuthentication,function(req, res) {
    Noticia.list()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.get('/:id', auth.checkBasicAuthentication, function(req, res) {
    Noticia.getNoticiaById(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na consulta: ' + erro))
});

router.get('/autor/:id', auth.checkBasicAuthentication, function(req, res) {
    Noticia.listByAutor(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem: ' + erro))
});

router.post('/', auth.checkBasicAuthentication, function(req, res) {
    var noticia = {
        titulo: req.body.titulo, pretitulo: req.body.pretitulo,
        descricao: req.body.descricao, infos: req.body.infos,
        data: req.body.data, autor: req.body.autor, visivel: req.body.visivel
    }    
    Noticia.create(noticia)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na criação: ' + erro))
});

router.post('/edit/:id', auth.checkBasicAuthentication, function(req, res) {
    fields = {}
    if (req.body.titulo) fields.titulo = req.body.titulo;
    if (req.body.texto)  fields.texto = req.body.texto;
    if (req.body.data)   fields.data = req.body.data;
    if (req.body.autor)  fields.autor = req.body.autor;

    Noticia.edit(req.params.id, fields)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na criação: ' + erro))
});


module.exports = router;