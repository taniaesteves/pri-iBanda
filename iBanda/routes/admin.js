var express = require('express');
var router = express.Router();
var axios = require('axios')  
var fs = require('fs')  

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
	req.session.redirectTo = '/admin/users/role/'+req.params.role;
	console.log("/role/:role redirectTo" + JSON.stringify(req.session.redirectTo))		
	axios.get('http://localhost:3000/api/admin/users/role/' + req.params.role, { headers: { "Authorization": 'Bearer ' + req.session.token } })
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

router.get('/', (req, res) => {
	var dataFromFile = JSON.parse(fs.readFileSync('Logs/stats_total_requests.json', 'utf8'));
	
	var data = {		
		labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octover", "November", "December"],
		datasets: [
			{
				label: "Pedidos GET",
				fillColor : "rgba(220,220,220,0.2)",
				strokeColor : "rgba(220,220,220,1)",
				pointColor : "rgba(220,220,220,1)",
				pointStrokeColor : "#fff",
				pointHighlightFill : "#fff",
				pointHighlightStroke : "rgba(220,220,220,1)",
				data: dataFromFile['GET']['2019']
			},
			{
				label: "Pedidos POST",
				fillColor : "rgba(48, 164, 255, 0.2)",
				strokeColor : "rgba(48, 164, 255, 1)",
				pointColor : "rgba(48, 164, 255, 1)",
				pointStrokeColor : "#fff",
				pointHighlightFill : "#fff",
				pointHighlightStroke : "rgba(48, 164, 255, 1)",
				data: dataFromFile['POST']['2019']
			}
		]
	};
	var pdata = [
	{
		value: 300,
		color:"#F7464A",
		highlight: "#FF5A5E",
		label: "Red"
	},
	{
		value: 50,
		color: "#46BFBD",
		highlight: "#5AD3D1",
		label: "Green"
	},
	{
		value: 100,
		color: "#FDB45C",
		highlight: "#FFC870",
		label: "Yellow"
	}
	]

	res.render('layout_admin', { testObj: JSON.stringify({data: data, pdata: pdata}) })
	
	
});
  
  
module.exports = router;