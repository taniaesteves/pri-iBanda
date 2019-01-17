var express = require('express');
var router = express.Router();
var User = require('../../controllers/user')

// Get all users
router.get('/', function(req, res) {
    User.list()
        .then(data => res.jsonp(data))
        .catch(errors => res.status(500).send('Erro na listagem: ' + errors))
});

// Get user by id
router.get('/:id', function(req, res) {
    User.getUserById(req.params.id)
        .then(data => res.jsonp(data))
        .catch(errors => res.status(500).send('Erro na listagem: ' + errors))
});

// Get users by role
router.get('/role/:role', function(req, res) {
    User.listByRole(req.params.role)
        .then(data => res.jsonp(data))
        .catch(errors => res.status(500).send('Erro na listagem: ' + errors))
});

router.post('/', function(req, res) {
    User.register(req.body)
        .then(data => res.jsonp(data))
        .catch(errors => res.status(500).send('Erro na listagem: ' + errors))
});

module.exports = router;