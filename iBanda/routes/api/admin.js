var express = require('express');
const passport = require('passport')
var router = express.Router()
var User = require('../../controllers/user')
var auth = require("../../authentication/aut")
var Noticia = require('../../controllers/noticia')
var fs = require("fs")
const {validationResult} = require('express-validator/check')

router.get('/stats', auth.checkAdminAuthentication, (req, res) => {    
    //TODO: fazer isto na callback 
    console.log("inside /api/admin/stats " + req.user)
    fs.readFile('Logs/stats_by_url.json', 'utf8', (err, data) => {
        if (err) {            
            const error = new Error(err)
            error.info = "" + err
            return res.status(500).send(error)
        }
        dataFromFile = JSON.parse(data);   
        get_info = [0,0,0,0,0,0,0,0,0,0,0,0];
        post_info = [0,0,0,0,0,0,0,0,0,0,0,0];    

        url = "/users"
        if (dataFromFile[url]) {
            for(var year in dataFromFile[url]["GET"])      
                for(var month in dataFromFile[url]["GET"][year]["total_req"])                    
                    get_info[month] += dataFromFile[url]["GET"][year]["total_req"][month]
                        
            for(var year in dataFromFile[url]["POST"])                
                for(var month in dataFromFile[url]["POST"][year]["total_req"])
                post_info[month] += dataFromFile[url]["POST"][year]["total_req"][month]
        }
        

        new_users = 0
        if (dataFromFile["/users"])
            for(var year in dataFromFile["/users"]["POST"])      
                for(var month in dataFromFile[url]["POST"][year]["total_req"])                    
                    new_users += dataFromFile[url]["POST"][year]["total_req"][month]
        
        new_produtores = 0
        if (dataFromFile["/produtores"])
            for(var year in dataFromFile["/produtores"]["POST"])      
                for(var month in dataFromFile[url]["POST"][year]["total_req"])                    
                    new_produtores += dataFromFile[url]["POST"][year]["total_req"][month]

        page_views = 0
        if(dataFromFile["/"])
            for(var year in dataFromFile["/"]["GET"])      
                for(var month in dataFromFile[url]["POST"][year]["total_req"])                    
                    page_views += dataFromFile[url]["POST"][year]["total_req"][month]

         console.log("Total gets: " + get_info + " total posts: " + post_info)
        res.jsonp({get_info: get_info, post_info: post_info, new_users: new_users, new_produtores: new_produtores, page_views:page_views})
    })
})


router.get('/ocultar/noticia/:nid', auth.checkAdminAuthentication, (req, res) => {
    Noticia.getNoticiaById(req.params.nid)
    .then(noticia => {
        console.log(noticia)
        Noticia.edit(noticia.id, {'visivel': !noticia.visivel})
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro ao editar noticia: ' + erro))

    })
    .catch(erro => res.status(500).send('Erro ao ocultar noticia: ' + erro))
    
})


router.get('/newusers', auth.checkAdminAuthentication, (req, res) => {    
    //TODO: fazer isto na callback 
    console.log("inside /api/admin/stats " + req.user)
    fs.readFile('Logs/stats_by_url.json', 'utf8', (err, data) => {
        if (err) {            
            const error = new Error(err)
            error.info = "" + err
            return res.status(500).send(error)
        }
        dataFromFile = JSON.parse(data);           
        post_info = 0;

        url = "/users"
        for(var year in dataFromFile[url]["POST"])                
            for(var month in dataFromFile[url]["POST"][year]["total_req"])
            post_info += dataFromFile[url]["POST"][year]["total_req"][month]         
        res.jsonp({new_users: post_info})
    })
})


// Get users by role
router.get('/users/role/:role', auth.checkAdminAuthentication, (req, res) => {
    User.listByRole(req.params.role)
        .then(data => res.jsonp(data))
        .catch(errors => res.status(500).send('Erro na listagem: ' + errors))
});

// Get username by user id
router.get('/user/id/:uid', auth.checkAdminAuthentication, (req, res) => {
    console.log("get username: " + JSON.stringify(req.params))
    User.getUserById(req.params.uid)
        .then(data => res.jsonp(data.username))
        .catch(err => {
            const error = new Error(err)
            error.info = "Não foi possível encontrar o utilizador com o id: " + req.params.uid
            return res.status(500).send(error)            
        })
});


// SignUp
router.post('/', User.validate('createAdmin'), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        const error = new Error("Registo do utilizador: Parametros inválidos")
        error.info = "" + errors.array().map(i => `${i.msg}`).join(' ');
        return res.status(500).send(error)
    }
    passport.authenticate('signup', { session : false}, (err, user, info) => {
        if (err | !user) {
            const error = new Error('Erro no registo do utilizador')
            error.info = "" + err
            return res.status(500).send(error)
        }
        res.jsonp("Utilizador registado com sucesso")
    })(req, res, next)

});


module.exports = router;