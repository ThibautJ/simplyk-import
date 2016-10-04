var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Admin = require('../models/admin_model.js');
var Organism = require('../models/organism_model.js');

function createOrgFromAdmin(school_name, callback) {
	var i = 0;
	Admin.find({
		'name': school_name,
		'type': 'school-teacher'
	}, function(err, teachers) {
		for (var teach_i = teachers.length - 1; teach_i >= 0; teach_i--) {
			var teacher = teachers[teach_i];
			newOrganism = new Organism({
				email: teacher.email,
				org_name: teacher.firstname + ' ' + teacher.lastname + ' (' + teacher.name + ')',
				lastname: teacher.lastname,
				firstname: teacher.firstname,
				admin_id: teacher._id,
				school_id: teacher.school_id,
				cause: 'Solidarité',
				description: 'Bénévolat organisé par ' + teacher.firstname + ' ' + teacher.lastname + ' (' + teacher.name + ')',
				validation: true
			});
			newOrganism.save(function(err, organism) {
				if (err) {
					console.log(err);
					return callback(err, null);
				} else {
					i++;
					console.log(i);
				};
				if (i == teachers.length) {
					return callback(null, i);
				}
			});
		};
	});
};



module.exports = {
	createOrgFromAdmin: createOrgFromAdmin
};