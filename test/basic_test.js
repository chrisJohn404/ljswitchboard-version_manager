
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

function printVersions(versionData) {
	var keys = Object.keys(versionData);
	keys.forEach(function(key) {
		var firmwares = versionData[key];
		if(firmwares.forEach) {
			firmwares.forEach(function(firmware) {
				var linkPartials = firmware.upgradeLink.split('/');
				var finalPartial = linkPartials[linkPartials.length-1];
				var str = '  - ';
				str += 'V:' + firmware.version.toString();
				str += 'T:'+ firmware.type;
				str += 'K:'+ firmware.key;
				str += 'F:'+ finalPartial;
				// console.log(str);
				console.log(
					'  - ',
					'V:', firmware.version,
					'T:', firmware.type,
					'K:', firmware.key,
					'F:', finalPartial
				);
			});
		}
	});
}
exports.tests = {
	'require version_manager': function(test) {
		version_manager = require('../lib/version_manager');
		test.done();
	},
	'get initial T7 Versions': function(test) {
		var data = version_manager.lvm.getCachedT7Versions();
		test.ok(!data.isValid, 'T7 Firmware data should not be valid yet');
		test.done();
	},
	'initialize version_manager': function(test) {
		var startTime = new Date();
		version_manager.getAllVersions()
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
	'get T7 Versions': function(test) {
		var data = version_manager.lvm.getCachedT7Versions();
		test.ok(data.isValid, 'T7 Firmware data should be valid');
		var requiredKeys = [
			'current',
			'old',
			'beta'
		];
		
		// Print out data
		// console.log(' - Test Output:', JSON.stringify(data, null, 2));
		// printVersions(data);
		var givenKeys = Object.keys(data);
		requiredKeys.forEach(function(reqKey) {
			var isOk = false;
			if(givenKeys.indexOf(reqKey) >= 0) {
				isOk = true;
			}
			test.ok(isOk, '(T7 Firmware) Missing a required key: ' + reqKey);
		});
		// console.log('T7 FW Versions', data);
		test.done();
	},
	'get T4 Versions': function(test) {
		var data = version_manager.lvm.getCachedT4Versions();
		test.ok(data.isValid, 'T4 Firmware data should be valid');
		var requiredKeys = [
			'current',
			// 'old',
			// 'beta'
		];
		
		// Print out data
		// console.log(' - T4 Test Output:', JSON.stringify(data, null, 2));
		// printVersions(data);
		var givenKeys = Object.keys(data);
		requiredKeys.forEach(function(reqKey) {
			var isOk = false;
			if(givenKeys.indexOf(reqKey) >= 0) {
				isOk = true;
			}
			test.ok(isOk, '(T4 Firmware) Missing a required key: ' + reqKey);
		});
		// console.log('T4 FW Versions', data);
		test.done();
	},
	'get Digit Versions': function(test) {
		var data = version_manager.lvm.getCachedDigitVersions();
		test.ok(data.isValid, 'Digit Firmware data should be valid');
		var requiredKeys = [
			'current',
			'old',
		];
		
		// Print out data
		// console.log(' - Digit Test Output:', JSON.stringify(data, null, 2));
		// printVersions(data);
		var givenKeys = Object.keys(data);
		requiredKeys.forEach(function(reqKey) {
			var isOk = false;
			if(givenKeys.indexOf(reqKey) >= 0) {
				isOk = true;
			}
			test.ok(isOk, '(Digit Firmware) Missing a required key: ' + reqKey);
		});
		// console.log('Digit FW Versions', data);
		test.done();
	},
	'get LJM Versions': function(test) {
		var data = version_manager.lvm.getCachedLJMVersions();
		
		// Print out data
		// console.log(' - Test Output:', JSON.stringify(data, null, 2));
		// printVersions(data);
		test.ok(data.isValid, 'LJM Versions data should be valid');
		var requiredKeys = ['current_win', 'current_mac', 'current_linux32', 'current_linux64'];
		var givenKeys = Object.keys(data);
		requiredKeys.forEach(function(reqKey, i) {
			var isOk = false;
			if(givenKeys.indexOf(reqKey) >= 0) {
				isOk = true;
			}
			test.ok(isOk, '(LJM Check) Missing a required key: ' + reqKey);
		});
		test.done();
	},
	'get Kipling Versions': function(test) {
		var data = version_manager.lvm.getCachedKiplingVersions();

		// Print out data
		// console.log(' - Test Output:', JSON.stringify(data, null, 2));
		// printVersions(data);
		test.ok(data.isValid, 'Kipling Versions data should be valid');
		var requiredKeys = ['current_win', 'current_mac', 'current_linux32', 'current_linux64'];
		var givenKeys = Object.keys(data);
		requiredKeys.forEach(function(reqKey, i) {
			var isOk = false;
			if(givenKeys.indexOf(reqKey) >= 0) {
				isOk = true;
			}
			test.ok(isOk, '(Kipling Check) Missing a required key: ' + reqKey);
		});
		test.done();
	},
	'clear versions cache': function(test) {
		// console.log('T7 FW Versions', version_manager.lvm.getCachedT7Versions());
		version_manager.lvm.clearPageCache();
		// console.log('T7 FW Versions', version_manager.lvm.getCachedT7Versions());
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