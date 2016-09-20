var express = require('express');
var router = express.Router();
var reader = require('../lib/reader.js');
var Admin = require('../models/admin_model');
var crypt = require('../auth/crypt.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

router.post('/import_students', function(req, res) {
	newAdmin = new Admin({
		name: 'school name',
		type: 'school-coordinator',
		lastname: 'Last',
		firstname: 'First',
		password: crypt.generateHash('15151515'),
		email: 'test@school.com'
	});
	newAdmin.save(function(err, admin) {
		if (err) {
			console.log(err);
			res.sendStatus(404).end();
		} else {
			reader.readFileAndCreateStudents('datas/' + req.body.path, 'utf8', admin._id, function(err, volunteers) {
				if (err) {
					console.log(err);
					res.sendStatus(404).end();
				} else {
					console.log('Students creation finished OK with path ' + req.body.path);
					console.log('admin._id : ' + admin._id);
					console.log('volunteers : ' + volunteers);
					Admin.findOneAndUpdate({
						'_id': admin._id
					}, {
						'$set': {
							'students': volunteers
						}
					}, {
						new: true
					}, function(err, adminWithStudents) {
						if (err) {
							console.log(err);
							res.sendStatus(404).end();
						} else {
							console.log('The New adminWithStudents is : ' + adminWithStudents);
							res.sendStatus(200).end();
						}
					});
				}
			});
		}
	})
});

router.post('/import_admins', function(req, res) {
	reader.readFileAndCreateAdmins('datas/' + req.body.path, 'utf8', function(err, nbAdmins) {
		if (err) {
			console.log(err);
			res.sendStatus(404).end();
		} else {
			console.log('Admins creations is finished with ' + nbAdmins + ' created !');
			res.sendStatus(200).end();
		}
	});
});

module.exports = router;