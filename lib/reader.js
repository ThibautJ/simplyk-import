fs = require('fs');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var crypt = require('../auth/crypt.js');


var Volunteer = require('../models/volunteer_model.js');
var Admin = require('../models/admin_model.js');


function readFileAndCreateStudents(path, encoding, admin_id, callback) {
	fs.readFile(path, encoding, function(err, file) {
		if (err) {
			console.log(err);
			return callback(err, null);
		} else {
			const allText = file;
			processStudentsData(allText, admin_id, function(err, volunteers) {
				return callback(null, volunteers);
			});
		}
	});
};

function readFileAndCreateAdmins(path, encoding, callback) {
	fs.readFile(path, encoding, function(err, file) {
		if (err) {
			console.log(err);
			return callback(err, null);
		} else {
			const allText = file;
			processAdminsData(allText, function(err, nbAdmins) {
				return callback(null, nbAdmins);
			});
		}
	});
};


function processStudentsData(allText, admin_id, callback) {
	// \n veut dire que on sépare par saut de ligne
	var allTextLines = allText.split("\n");
	// \t veut dire que on sépare par tabulation
	var headers = allTextLines[0].split(',');
	var lines = [];
	console.log(headers);
	var volunteersList = [];
	var filledRows = allTextLines.length;

	// console.log(lines);
	for (var i = 1; i < allTextLines.length; i++) {
		var data = allTextLines[i].split(',');

		// sert à éliminer les lignes vides
		if (data[0].length > 3) {
			if (data.length == headers.length) {
				console.log('Entry n°' + i);
				console.log('firstname : ' + data[2] + ' & email : ' + data[3]);
				console.log('Date.parse(data[6])' + Date.parse(data[6].trim()));
				if (Date.parse(data[6]) === 'NaN') {
					console.log('Date format incorrect:' + data[6]);
				} else {
					newVolunteer = new Volunteer({
						email: data[3],
						email_verified: true,
						lastname: data[1],
						firstname: data[2],
						birthdate: Date.parse(data[6].trim()),
						password: crypt.generateHash(data[4]),
						admin: {
							admin_id: admin_id,
							class: data[5]
						},
						student: true
					});
					newVolunteer.save(function(err, volunteer) {
						if (err) {
							console.log(err);
							return callback(err, null);
						} else {
							volunteersList.push({
								_id: volunteer._id,
								status: 'init'
							});
							console.log(volunteer);
							console.log('volunteersList.length : ' + volunteersList.length);
							console.log('(allTextLines.length - 1) : ' + (filledRows - 1));
							console.log('(volunteersList.length === (filledRows - 1)) : ' + (volunteersList.length === (filledRows - 1)));
							if (volunteersList.length === (filledRows - 1)) {
								console.log('We call callback with volunteersList.length : ' + volunteersList.length);
								return callback(null, volunteersList);
							}
						}
					});
				}
			}
		} else {
			filledRows--;
		}
	}
};


function processAdminsData(allText, callback) {
	// \n veut dire que on sépare par saut de ligne
	var allTextLines = allText.split("\n");
	// \t veut dire que on sépare par tabulation
	var headers = allTextLines[0].split(',');
	var lines = [];
	console.log(headers);
	var filledRows = allTextLines.length;
	var nbAdmins = 0;

	// console.log(lines);
	for (var i = 1; i < allTextLines.length; i++) {
		console.log('start for');
		var data = allTextLines[i].split(',');
		console.log('datas : ' + data);
		console.log('data[0] : ' + data[0]);

		// sert à éliminer les lignes vides
		if (data[0].length > 2) {
			if (data.length == headers.length) {
				console.log('Entry n°' + i);
				newAdmin = new Admin({
					email: data[3],
					email_verified: true,
					name: 'School Name',
					lastname: data[2],
					firstname: data[1],
					class: data[0],
					type: 'school-teacher',
					password: crypt.generateHash('15151515')
				});
				//New admin created
				newAdmin.save(function(err, adminFirst) {
					Admin.findOne({
						'name': adminFirst.name,
						'type': 'school-coordinator'
					}, function(err, adminCoordinator) {
						if (err) {
							console.log(err);
							return callback(err, null);
						} else {
							adminFirst.admin_id = adminCoordinator._id;
							//Give volunteers list to each admin
							Volunteer.find({
								'admin.class': adminFirst.class,
								'admin.admin_id': adminFirst.admin_id
							}, function(err, volunteers) {
								if (err) {
									console.log(err);
									return callback(err, null);
								} else {
									var volunteersArray = volunteers.map(function(obj) {
										var nObj = {};
										nObj.status = 'init';
										nObj._id = obj._id;
										return nObj;
									});
									Admin.findOneAndUpdate({
										'_id': adminFirst._id
									}, {
										'$set': {
											'students': volunteersArray
										}
									}, function(err, adminLast) {
										if (err) {
											console.log(err);
											return callback(err, null);
										} else {
											console.log(adminLast);
											nbAdmins++;
											console.log('nbAdmins : ' + nbAdmins);
											console.log('(allTextLines.length - 1) : ' + (filledRows - 1));
											console.log('(nbAdmins === (filledRows - 1)) : ' + (nbAdmins === (filledRows - 1)));
											if (nbAdmins === (filledRows - 1)) {
												console.log('We call callback with nbAdmins : ' + nbAdmins);
												return callback(null, nbAdmins);
											}
										}
									});
								};
							});

						};
					});
				});

			};
		} else {
			filledRows--;
		}
	}
};

module.exports = {
	readFileAndCreateStudents: readFileAndCreateStudents,
	readFileAndCreateAdmins: readFileAndCreateAdmins
}