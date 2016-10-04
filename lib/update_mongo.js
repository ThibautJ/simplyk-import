var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Volunteer = require('../models/volunteer_model.js');
var Admin = require('../models/admin_model.js');
var Organism = require('../models/organism_model.js');
var Activity = require('../models/activity_model.js');

var update = function(callback) {
	var i = 0;
	Admin.findOne({
		'type': 'school-coordinator'
	}, function(err, superAdmin) {
		Admin.update({
			"type": "school-teacher"
		}, {
			'$set': {
				'school_id': superAdmin._id
			}
		}, {
			'multi': true
		}, function(err) {
			if (err) {
				return callback(err);
			} else {
				i++;
				console.log(i);
				return callback();
			}
		});
	});
};

module.exports = {
	update: update
};