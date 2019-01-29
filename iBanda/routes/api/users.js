var express = require('express');
const passport = require('passport')
const jwt = require('jsonwebtoken')
var router = express.Router()
var User = require('../../controllers/user')
var BlackList = require('../../controllers/blacklist')
var auth = require("../../authentication/aut")
const {validationResult} = require('express-validator/check')


// Get all users
router.get('/', auth.checkBasicAuthentication, (req, res) => {
    console.log("/users")
    User.listByRole("user")
        .then(data => res.jsonp(data))
        .catch(errors => res.status(500).send('Erro na listagem: ' + errors))
});

//TODO: deixar apenas procurar por utilizadores ou produtores
// GET /api/users/:username
router.get('/user/:username', auth.checkBasicAuthentication, (req, res) => {
    console.log("/users/:username")
    User.getUserByUsername(req.params.username)
        .then(data => res.jsonp(data))
        .catch(err => res.status(500).send('Erro na consulta de utilizador: ' + err))
})

// SignUp
router.post('/', User.validate('createUser'), (req, res, next) => {
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

// LogIn
router.post('/login', (req, res, next) => {
    console.log("email:" + req.body.email + "pass: " + req.body.password)
    passport.authenticate('login', (err, user) => {     
        try {
            if(err || !user){
                console.log("login error: " + err)
                const error = new Error('An Error occured')
                error.info = "cannot find user" + err
                return next(error);
            }
            req.login(user, { session : false }, (error) => {
                if( error ) return next(error)
                var myuser = { id : user._id, email : user.email };
                // Geração do token                
                var token = jwt.sign({ user : myuser },'iBandaSecret2', { expiresIn: '30m' });        
                return res.jsonp(token)                
            });     
        } 
        catch (err) {
            console.log("Erro: ", err)
            const error = new Error('An Error occured')
                error.info = "" + err
                return next(error);
        }
    })(req, res, next);
});

// LogOut
router.get('/logout', async (req, res, next) => {    
    auth.isLoggedIn(req, res, (loggedin)=> {
        if (loggedin) {
            BlackList.addToken({token: req.headers.authorization});
            req.logout();  
        }
    }) 
    res.jsonp("Logout efetuado com sucesso!")
});

module.exports = router;