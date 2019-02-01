var express = require('express');
var router = express.Router();
var axios = require('axios')
var fs = require('fs')
const jwt = require('jsonwebtoken')

// router.get('/', function (req, res) {	
// 	res.render('layout_admin');
// });


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

// router.get('/', (req, res) => {
// 	var dataFromFile = JSON.parse(fs.readFileSync('Logs/stats_by_url.json', 'utf8'));

// 	var data = {		
// 		labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octover", "November", "December"],
// 		datasets: [
// 			{
// 				label: "Pedidos GET",
// 				fillColor : "rgba(220,220,220,0.2)",
// 				strokeColor : "rgba(220,220,220,1)",
// 				pointColor : "rgba(220,220,220,1)",
// 				pointStrokeColor : "#fff",
// 				pointHighlightFill : "#fff",
// 				pointHighlightStroke : "rgba(220,220,220,1)",
// 				data: dataFromFile["/users"]['GET']['2019']
// 			},
// 			{
// 				label: "Pedidos POST",
// 				fillColor : "rgba(48, 164, 255, 0.2)",
// 				strokeColor : "rgba(48, 164, 255, 1)",
// 				pointColor : "rgba(48, 164, 255, 1)",
// 				pointStrokeColor : "#fff",
// 				pointHighlightFill : "#fff",
// 				pointHighlightStroke : "rgba(48, 164, 255, 1)",
// 				data: dataFromFile["/users"]['POST']['2019']
// 			}
// 		]
// 	};
// 	var pdata = [
// 	{
// 		value: 300,
// 		color:"#F7464A",
// 		highlight: "#FF5A5E",
// 		label: "Red"
// 	},
// 	{
// 		value: 50,
// 		color: "#46BFBD",
// 		highlight: "#5AD3D1",
// 		label: "Green"
// 	},
// 	{
// 		value: 100,
// 		color: "#FDB45C",
// 		highlight: "#FFC870",
// 		label: "Yellow"
// 	}
// 	]

// 	res.render('layout_admin', { testObj: JSON.stringify({data: data, pdata: pdata}) })


// });

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
				// calendar_events: JSON.stringify(
				// 	[
				// 		{
				// 			title: 'All Day Event',
				// 			start: '2019-02-01'
				// 		},
				// 		{
				// 			title: 'Long Event',
				// 			start: '2019-02-07',
				// 			end: '2019-02-10'
				// 		},
				// 		{
				// 			id: 999,
				// 			title: 'Repeating Event',
				// 			start: '2019-02-09T16:00:00'
				// 		},
				// 		{
				// 			id: 999,
				// 			title: 'Repeating Event',
				// 			start: '2019-02-16T16:00:00'
				// 		},
				// 		{
				// 			title: 'Conference',
				// 			start: '2019-02-11',
				// 			end: '2019-02-13'
				// 		},
				// 		{
				// 			title: 'Meeting',
				// 			start: '2019-02-12T10:30:00',
				// 			end: '2019-02-12T12:30:00'
				// 		},
				// 		{
				// 			title: 'Lunch',
				// 			start: '2019-02-12T12:00:00'
				// 		},
				// 		{
				// 			title: 'Meeting',
				// 			start: '2019-02-12T14:30:00'
				// 		},
				// 		{
				// 			title: 'Happy Hour',
				// 			start: '2019-02-12T17:30:00'
				// 		},
				// 		{
				// 			title: 'Dinner',
				// 			start: '2019-02-12T20:00:00'
				// 		},
				// 		{
				// 			title: 'Birthday Party',
				// 			start: '2019-02-13T07:00:00'
				// 		},
				// 		{
				// 			title: 'Click for Google',
				// 			url: 'https://google.com/',
				// 			start: '2019-02-28'
				// 		}
				// 	]
				// )
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
	
	// if (req.session.token) {
	// 	jwt.verify(req.session.token, 'iBandaSecret2', function(err, decoded) {      
	// 	  if (err) {			  
	// 		return res.json({ success: false, message: 'Failed to authenticate token.' });    
	// 	  } else {
	// 		  user_id = decoded.user.id
	// 		console.log("user id= " + JSON.stringify(decoded.user.id));			
	// 	  }
	// 	})
	// }	
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