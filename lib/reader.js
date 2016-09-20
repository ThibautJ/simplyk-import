fs = require('fs');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var crypt = require('../auth/crypt.js');


var Volunteer = require('../models/volunteer_model.js');

/*
fs.readFile('tests/data-sub.txt', 'utf8', function(err, file) {
	if (err) {
		console.log(err);
	} else {
		// console.log(file);
		const allText = file;
		processStudentsData(allText);
	}
});*/

function readFileAndCreateStudents(path, encoding, admin_id, callback) {
	fs.readFile(path, encoding, function(err, file) {
		if (err) {
			console.log(err);
			return callback(err, null);
		} else {
			// console.log(file);
			const allText = file;
			processStudentsData(allText, admin_id, function(err, volunteers) {
				return callback(null, volunteers);
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


function processAdminsData(allText, admin_id) {
	// \n veut dire que on sépare par saut de ligne
	var allTextLines = allText.split("\n");
	// \t veut dire que on sépare par tabulation
	var headers = allTextLines[0].split(',');
	var lines = [];
	console.log(headers);

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
						} else {
							console.log(volunteer);
						}
					});
				}
			}
		}
	}
};

module.exports = {
	readFileAndCreateStudents: readFileAndCreateStudents
}