'use strict';

var DynamoBackup = require('dynamo-backup-to-s3');
var moment = require('moment');

exports.handler = function (event, context, callback) {
	var archiveDate = moment.utc();

	var backup = new DynamoBackup({
		readPercentage: 0.5,
		bucket: process.env.MY_S3_BUCKET,
		stopOnFailure: true,
		base64Binary: true,
		backupPath: archiveDate.format('YYYY/MM/DD/') + 'DynamoDB-backup-' + archiveDate.format('YYYY-MM-DD-HH-mm-ss'),
		awsRegion: process.env.AWS_REGION
	});

	backup.on('error', function(data) {
		console.log('Error backing up ' + data.table);
		console.log(data.err);
		callback(data.err);
	});

	backup.on('start-backup', function(tableName, startTime) {
		console.log('Starting to copy table ' + tableName);
	});

	backup.on('end-backup', function(tableName, backupDuration) {
		console.log('Done copying table ' + tableName);
	});

	backup.backupAllTables(function() {
		console.log('Finished backing up DynamoDB');
		callback();
	});
};
