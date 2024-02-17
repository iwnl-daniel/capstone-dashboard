const fs = require('fs');
const path = require('path');
const util = require('util');
const moment = require('moment');

const errorLogPath = path.resolve(path.join(__dirname, '../../logs/errors.log'));
const errorLogStream = fs.createWriteStream(errorLogPath, { flags : 'a'});
/**
 * This is a utilities script for error logs.
 * The purpose for this is to keep an application log file on the server for 
 * prod troubleshooting
 * All the log will be under logs directory from parent directory
 * @param  {...any} args 
 */
console.error = (...args) => {
    const errorBuff = util.format(...args);
    const dateTime = moment().format('YYYY-MM-DD | HH:mm:ss');
    const errorRes = `| Error Log | ${dateTime} | ${errorBuff}`;
    console.log(errorRes);
    errorLogStream.write(errorRes+ '\n');
};

process.on('exit', () => {
    errorLogStream.end();
})
