var express = require('express');
var router = express.Router();
var axios = require('axios')

router.get('/', function(req, res) {
    axios.get('http://localhost:3000/api/eventos')
        .then(eventos => res.render('events', {eventos: eventos.data}))
        .catch(erro => {
            console.log('Erro na listagem de eventos: ' + erro)
            res.render('error', {error: erro, message: "na listagem..."})
        })
});

router.get('/criarEvento', function(req, res) {
    res.render('createEvento');
});


router.get('/:id', function(req, res) {
    axios.get('http://localhost:3000/api/eventos/' + req.params.id)
        .then(evento => res.render('evento', {evento: evento.data}))
        .catch(erro => {
            console.log('Erro na consulta do evento: ' + erro)
            res.render('error', {error: erro, message: "Meu erro..."})
        })
});

router.post('/', function(req, res) {
    var params = {
		data: req.body.data, hinicio: req.body.hinicio, hfim: req.body.hfim,
        tipo: req.body.tipo, designacao: req.body.designacao, local: req.body.local,
        informacoes: req.body.infos}
        console.log(params)
    axios.post('http://localhost:3000/api/eventos', params)
        .then(()=> res.redirect('http://localhost:3000/eventos'))
        .catch(erro => {
            console.log('Erro na inserção do evento: ' + erro)
            res.render('error', {error: erro, message: "Meu erro ins..."})
        })
});

module.exports = router;