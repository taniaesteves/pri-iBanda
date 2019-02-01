var express = require('express');
var router = express.Router();
var axios = require('axios')
var fs = require('fs')
const jwt = require('jsonwebtoken')

// router.get('/', function (req, res) {	
// 	res.render('layout_admin');
// });

router.get('/remove/user/:uid', function (req, res) {
	req.session.redirectTo = '/admin/utilizadores/' + req.params.role;
	axios.get('http://localhost:3000/api/admin/remove/user/' + req.params.uid, { headers: { "Authorization": 'Bearer ' + req.session.token } })
	.then(response => {
		console.log(JSON.stringify(response.data))
		res.redirect('/admin/utilizadores')
	})
	.catch(erro => {
		console.log("POST /singup Erro no registo do utilizador! " + JSON.stringify(erro.response.data.info));
		req.flash('error', erro.response.data.info)
		res.render('error', { error: erro, message: "Erro ao remover user!" })
	})
})

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
	req.session.redirectTo = '/admin/users/role/' + req.params.role;
	console.log("/role/:role redirectTo" + JSON.stringify(req.session.redirectTo))
	axios.get('http://localhost:3000/api/admin/users/role/' + req.params.role, { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(users => {
			res.render('users', { users: users.data })
			delete req.session.redirectTo
		})
		.catch(erro => {
			// if (erro.response.status) return res.redirect('/login')
			console.log('Erro na listagem dos utilizadores por role: ' + erro.response.data.info)
			res.render('error', { error: erro, message: "Erro na listagem dos utilizadores por role!" })
		})
});

router.get('/noticias', (req, res) => {
	req.session.redirectTo = "/admin/noticias";
	axios.get('http://localhost:3000/api/noticias/', { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(response => {
			if (req.session.email) {
				loggedin = true;
			} else loggedin = false;
			testObj = {
				originalUrl: req.originalUrl,
				loggedin,
				username: req.session.username,
				noticias: response.data
			}
			res.render('adminNoticias', testObj)
		}).catch(erro => {
			if (erro.response) {
				if (erro.response.status == 401) return res.redirect('/login')
				console.log('Erro get /admin/noticias por: ' + erro.response.data.info)
			}
			res.render('error', { error: erro, message: "Erro na listagem dos utilizadores por role!" })
		})
})

router.get('/estatisticas', (req, res) => {
	req.session.redirectTo = "/admin/estatisticas";
	console.log(req.session)
	axios.get('http://localhost:3000/api/admin/stats', { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(response => {
			if (req.session.email) {
				loggedin = true;
			} else loggedin = false;
			console.log(response.data)
			testObj = {				
				originalUrl: req.originalUrl,
				loggedin,
				page_views_num: page_views,
				new_productors_num: response.data.new_produtores,								
				new_users_num: response.data.new_users,
				username: req.session.username,
				chart_data: JSON.stringify({ get_obras: response.data.get_obras, post_obras: response.data.post_obras }),
				pie_chart: JSON.stringify({ data: response.data.pie_chart })
			}
			res.render('adminGraphs', testObj)
		}).catch(erro => {
			if (erro.response) {
				if (erro.response.status == 401) return res.redirect('/login')
				console.log('Erro get /admin por: ' + erro.response.data.info)
			}
			res.render('error', { error: erro, message: "Erro na listagem dos utilizadores por role!" })
		})
})

router.get('/edit/user/:id', (req, res) => {
	req.session.redirectTo = "/admin/utilizadores";
	axios.get('http://localhost:3000/api/users/user/id/' + req.params.id, { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(response => {
			if (req.session.email) {
				loggedin = true;
			} else loggedin = false;
			testObj = {
				originalUrl: req.originalUrl,
				loggedin,
				username: req.session.username,
				user: response.data
			}
	res.render('editUser', testObj )
	})
})

router.post('/edit/user/:id', (req, res) => {
	req.session.redirectTo = "/admin";
	axios.get('http://localhost:3000/api/admin/edit/user/' + req.params.id, { headers: { "Authorization": 'Bearer ' + req.session.token } })
		//.then(response => {
			res.redirect('/admin/noticias')
			// res.render('adminNoticias', testObj)
		//}).catch(erro => {
			//if (erro.response) {
				//if (erro.response.status == 401) return res.redirect('/login')
				//console.log('Erro get /admin/ocultar/noticia por: ' + erro.response.data.info)
			//}
			//res.render('error', { error: erro, message: "Erro na listagem dos utilizadores por role!" })
		//})
})

router.get('/ocultar/noticia/:nid', (req, res) => {
	req.session.redirectTo = "/admin/noticias";
	axios.get('http://localhost:3000/api/admin/ocultar/noticia/' + req.params.nid, { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(response => {
			res.redirect('/admin/noticias')
			// res.render('adminNoticias', testObj)
		}).catch(erro => {
			if (erro.response) {
				if (erro.response.status == 401) return res.redirect('/login')
				console.log('Erro get /admin/ocultar/noticia por: ' + erro.response.data.info)
			}
			res.render('error', { error: erro, message: "Erro na listagem dos utilizadores por role!" })
		})
})

router.get('/utilizadores', (req, res) => {
	req.session.redirectTo = "/admin/utilizadores";
	axios.get('http://localhost:3000/api/users/', { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(response => {
			if (req.session.email) {
				loggedin = true;
			} else loggedin = false;
			testObj = {
				originalUrl: req.originalUrl,
				loggedin,
				username: req.session.username,
				users: response.data
			}
			res.render('adminUsers', testObj)
		}).catch(erro => {
			if (erro.response) {
				if (erro.response.status == 401) return res.redirect('/login')
				console.log('Erro get /admin por: ' + erro.response.data.info)
			}
			res.render('error', { error: erro, message: "Erro na listagem dos utilizadores por role!" })
		})
})


router.get('/obras', (req, res) => {
	req.session.redirectTo = "/admin/utilizadores";
	axios.get('http://localhost:3000/api/obras/', { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(response => {
			if (req.session.email) {
				loggedin = true;
			} else loggedin = false;
			testObj = {
				originalUrl: req.originalUrl,
				loggedin,
				username: req.session.username,
				obras: response.data
			}
			res.render('adminObras', testObj)
		}).catch(erro => {
			if (erro.response) {
				if (erro.response.status == 401) return res.redirect('/login')
				console.log('Erro get /admin por: ' + erro.response.data.info)
			}
			res.render('error', { error: erro, message: "Erro na listagem dos utilizadores por role!" })
		})
})

router.get('/eventos', (req, res) => {
	req.session.redirectTo = "/admin/utilizadores";
	axios.get('http://localhost:3000/api/eventos/', { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(response => {
			if (req.session.email) {
				loggedin = true;
			} else loggedin = false;
			testObj = {
				originalUrl: req.originalUrl,
				loggedin,
				username: req.session.username,
				eventos: response.data
			}
			res.render('adminEventos', testObj)
		}).catch(erro => {
			if (erro.response) {
				if (erro.response.status == 401) return res.redirect('/login')
				console.log('Erro get /admin por: ' + erro.response.data.info)
			}
			res.render('error', { error: erro, message: "Erro na listagem dos utilizadores por role!" })
		})
})


router.get('/', (req, res) => {
	req.session.redirectTo = "/admin/";
	
	console.log(req.session)
	axios.get('http://localhost:3000/api/admin/stats', { headers: { "Authorization": 'Bearer ' + req.session.token } })
		.then(response => {
			if (req.session.email) {
				loggedin = true;
			} else loggedin = false;
			console.log(response.data)
			testObj = {				
				originalUrl: req.originalUrl,
				loggedin,
				page_views_num: page_views,
				new_productors_num: response.data.new_produtores,								
				new_users_num: response.data.new_users,
				username: req.session.username,
				chart_data: JSON.stringify({ get_info: response.data.get_info, post_info: response.data.post_info })
			}
			res.render('adminDashboard', testObj)
		}).catch(erro => {
			if (erro.response) {
				if (erro.response.status == 401) return res.redirect('/login')
				console.log('Erro get /admin por: ' + erro.response.data.info)
			}
			res.render('error', { error: erro, message: "Erro na listagem dos utilizadores por role!" })
		})
})

module.exports = router;