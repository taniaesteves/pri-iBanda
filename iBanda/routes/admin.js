var express = require('express');
var router = express.Router();
var axios = require('axios')  

// signup as admin
router.get('/signup', function (req, res) {	
	res.render('signupAdmin', { expressFlash: req.flash('error'), sessionFlash: res.locals.sessionFlash });
});

router.post('/signup', function (req, res) {
	var params = {
		username: req.body.username, password: req.body.password,
		name: req.body.name, email: req.body.email, role: 'admin'
	}

	axios.post('http://localhost:3000/api/admin/', params)
		.then(response => {
			res.redirect('/login')
		})
		.catch(erro => {
			console.log("POST /singup Erro no registo do utilizador! " + JSON.stringify(erro.response.data.info));
			req.flash('error', erro.response.data.info)
			res.redirect(301, '/admin/signup');
		})
});

// Get users by role
router.get('/role/:role', (req, res) => {
	req.session.redirectTo = '/admin/users/role/'+req.params.role;
	console.log("/role/:role redirectTo" + JSON.stringify(req.session.redirectTo))		
	axios.get('http://localhost:3000/api/admin/role/' + req.params.role, { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(users => {			
			res.render('users', {users: users.data})
			delete req.session.redirectTo
		})
		.catch(erro => {
			// if (erro.response.status) return res.redirect('/login')
			console.log('Erro na listagem dos utilizadores por role: ' + erro.response.data.info)
			res.render('error', { error: erro, message: "Erro na listagem dos utilizadores por role!" })
		})
});

module.exports = router;