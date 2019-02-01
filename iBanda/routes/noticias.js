var express = require('express');
var router = express.Router();
var axios = require('axios')
var moment = require('moment');

router.get('/', function(req, res) {
    axios.get('http://localhost:3000/api/noticias')
        .then(noticias => res.render('createNoticia', {noticias: noticias.data}))
        .catch(erro => {
            console.log('Erro na listagem de noticias: ' + erro)
            res.render('error', {error: erro, message: "na listagem..."})
        })
});

router.get('/criar-noticia', function(req, res) {
    res.render('criarNoticia')
});

router.post('/', function(req, res) {
    axios.get('http://localhost:3000/api/users/user/username/' + req.session.username, { headers: { "Authorization": 'Bearer ' + req.session.token } })
    .then(user => {
        var params = {
            titulo: req.body.titulo, pretitulo: req.body.pretitulo,
            descricao: req.body.descricao, infos: req.body.infos,
            data: new Date(Date.now()).toLocaleString(), autor: user.data.name, visivel: false
        }        
        axios.post('http://localhost:3000/api/noticias', params, { headers: { "Authorization": 'Bearer ' + req.session.token } })
            .then(()=> res.redirect('http://localhost:3000/'))
            .catch(erro => {
                console.log('Erro na inserção de uma noticia: ' + erro)
                res.render('error', {error: erro, message: "Meu erro ins..."})
            })
        })
    .catch(erro => {
        console.log('Erro na consulta da noticia: ' + erro)
        res.render('error', {error: erro, message: "Meu erro..."})
    })
    
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


module.exports = router;