var express = require('express');
var router = express.Router();
var reader = require('../tests/test-francois.js');
var Admin = require('../models/admin_model');
var crypt = require('../auth/crypt.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

router.get('/import_students', function(req, res) {
	newAdmin = new Admin({
		name: 'Ecole test',
		type: 'school',
		lastName: 'last',
		firstName: 'first',
		password: crypt.generateHash('15151515'),
		email: 'test@school.com'
	});
	newAdmin.save(function(err, admin) {
		if (err) {
			console.log(err);
		} else {
			reader.readFileAndCreateStudents('datas/' + req.query.path, 'utf8', admin._id, function(err, file) {
				if (err) {
					console.log(err);
				} else {
					console.log('Finished OK with path ' + req.query.path);
				}
			});
		}

	})

})

module.exports = router;