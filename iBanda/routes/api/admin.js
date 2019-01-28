var express = require('express');
const passport = require('passport')
var router = express.Router()
var User = require('../../controllers/user')
var auth = require("../../authentication/aut")
const {validationResult} = require('express-validator/check')

// Get users by role
router.get('/users/role/:role', auth.checkAdminAuthentication, (req, res) => {
    User.listByRole(req.params.role)
        .then(data => res.jsonp(data))
        .catch(errors => res.status(500).send('Erro na listagem: ' + errors))
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