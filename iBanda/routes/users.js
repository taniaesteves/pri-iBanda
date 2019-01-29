var express = require('express');
var router = express.Router();
var axios = require('axios')  

  
/* GET users listing. */
router.get('/', (req, res) => {
	req.session.redirectTo = "/users";
	axios.get('http://localhost:3000/api/users', { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(users => {
			res.render('users', { users: users.data })
			delete req.session.redirectTo
		})
		.catch(erro => {
			if (erro.response.status) return res.redirect('/login')			
			console.log('Erro na listagem dos utilizadores: ' + erro)
			res.render('error', { error: erro, message: "Erro na listagem dos utilizadores!" })
		})

});

router.get('/:username', (req, res) => {	
	req.session.redirectTo = "/users/"+req.params.username;	
	axios.get('http://localhost:3000/api/users/user/' + req.params.username, { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(user => {
			// res.send(user.data)
			delete req.session.redirectTo
			res.render('user', {user: user.data})
		})
		.catch(erro => {
			if (erro.response.status) return res.redirect('/login')
			console.log('Erro na listagem dos utilizadores: ' + erro)
			res.render('error', { error: erro, message: "Erro na listagem dos utilizadores!" })
		})
});



module.exports = router;
