
var version_manager;
var versionData;

function validateVersionData(test, data, debug) {
	if(debug) {
		console.log('Validating Data', JSON.stringify(Object.keys(data), null, 2));
	}
}

var executionTimes = [];
function addExecutionTime(name, startTime, endTime) {
	var duration = endTime - startTime;

	var unit = 'ms';
	var divisor = 1;
	if(duration >= 1000) {
		unit = 's';
		divisor = 1000;
	}
	var durationStr = (duration/divisor).toFixed(4) + ' ' + unit;
	executionTimes.push({
		'name': name,
		'startTime': startTime,
		'endTime': endTime,
		'duration': duration,
		'durationStr': durationStr,
	});
}
exports.tests = {
	'require version_manager': function(test) {
		version_manager = require('../lib/version_manager');
		test.done();
	},
	'initialize version_manager': function(test) {
		var startTime = new Date();
		version_manager.initialize()
		.then(function(data) {
			var endTime = new Date();
			addExecutionTime('Initialization', startTime, endTime);
			test.ok(true);
			versionData = data;
			validateVersionData(test, data, false);
			test.done();
		}, function(err) {
			test.ok(false, 'Error initializing version_manager');
			test.done();
		});
	},
	'perform cached query': function(test) {
		var startTime = new Date();
		version_manager.getAllVersions()
		.then(function(data) {
			var endTime = new Date();
			addExecutionTime('Get Cached Versions', startTime, endTime);
			test.ok(true);
			validateVersionData(test, data);
			test.done();
		}, function(err) {
			test.ok(false, 'Error getting version numbers');
			test.done();
		});
	},
	'clear versions cache': function(test) {
		version_manager.lvm.clearPageCache();
		test.done();
	},
	'secondary query': function(test) {
		var startTime = new Date();
		version_manager.getAllVersions()
		.then(function(data) {
			var endTime = new Date();
			addExecutionTime('Secondary query', startTime, endTime);
			test.ok(true);
			validateVersionData(test, data);
			test.done();
		}, function(err) {
			test.ok(false, 'Error getting version numbers');
			test.done();
		});
	},
	'check T7 versions': function(test) {
		version_manager.lvm.getT7FirmwareVersions()
		.then(function(data) {
			// console.log('T7 FW Versions', data);
			test.done();
		}, function(err) {
			test.ok(false,'Failed to get T7 firmware versions');
			test.done();
		});
	},
	'Check load times': function(test) {
		var output = [];
		console.log('Execution Times:');
		executionTimes.forEach(function(executionTime) {
			var str = executionTime.name + ': ' + executionTime.durationStr;
			output.push(str);
			console.log(str);
		});
		test.done();
	},
};