var express = require('express');
var router = express.Router();
var axios = require('axios')

router.get('/', function(req, res) {
    axios.get('http://localhost:3000/api/noticias')
        .then(noticias => res.render('createNoticia', {noticias: noticias.data}))
        .catch(erro => {
            console.log('Erro na listagem de noticias: ' + erro)
            res.render('error', {error: erro, message: "na listagem..."})
        })
});

router.get('/criar-noticia', function(req, res) {
    // axios.get('http://localhost:3000/api/noticias/' + req.params.id)
    //     .then(noticia => res.render('noticia', {noticia: noticia.data}))
    //     .catch(erro => {
    //         console.log('Erro na consulta da noticia: ' + erro)
    //         res.render('error', {error: erro, message: "Meu erro..."})
    //     })
    res.render('createNew')
});


router.get('/:id', function(req, res) {
    axios.get('http://localhost:3000/api/noticias/' + req.params.id)
        .then(noticia => res.render('noticia', {noticia: noticia.data}))
        .catch(erro => {
            console.log('Erro na consulta da noticia: ' + erro)
            res.render('error', {error: erro, message: "Meu erro..."})
        })
});

router.get('/:data', function(req, res) {
    axios.get('http://localhost:3000/api/noticias/' + req.params.data)
        .then(noticia => res.render('noticia', {noticia: noticia.data}))
        .catch(erro => {
            console.log('Erro na consulta da noticia: ' + erro)
            res.render('error', {error: erro, message: "Meu erro..."})
        })
});


router.get('/autor/:id', function(req,res){
    axios.get('http://localhost:3000/api/noticias/' + req.params.id)
        .then(noticia =>  res.render('noticia', {noticia: noticia.autor}))
        .catch(erro => {
            console.log('Erro na consulta da noticia: ' + erro)
            res.render('error', {error: erro, message: "Meu erro..."})
        })
});

router.post('/', function(req, res) {
    axios.post('http://localhost:3000/api/noticias', req.body)
        .then(()=> res.redirect('http://localhost:3000/noticias'))
        .catch(erro => {
            console.log('Erro na inserção de uma noticia: ' + erro)
            res.render('error', {error: erro, message: "Meu erro ins..."})
        })
});

module.exports = router;