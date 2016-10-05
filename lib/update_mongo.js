var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Volunteer = require('../models/volunteer_model.js');
var Admin = require('../models/admin_model.js');
var Organism = require('../models/organism_model.js');
var Activity = require('../models/activity_model.js');

var update = function(callback) {
	return callback(null, 'OK');
};

module.exports = {
	update: update
};