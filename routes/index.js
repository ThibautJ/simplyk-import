var express = require('express');
var router = express.Router();
var reader = require('../tests/test-francois.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

router.get('/import_students', function(req, res) {
	reader.readFile('datas/' + req.query.path, 'utf8', function(err, file) {
		if (err) {
			console.log(err);
		} else {
			console.log('Finished OK with path ' + req.query.path);
		}
	})
})

module.exports = router;