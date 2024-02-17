const fs = require('fs');
const path = require('path');
const moment = require('moment');

/**
 * This log files is related to the project's logs infomation.
 * All the project will have its own - individual project directory. 
 * inside of its directory - will have todos.json as a log files
 * That shared bettween the application and server itself. 
 * @param {string} serviceType 
 * @param {string} projectName 
 * @param {string} updatedBy 
 * @param {string} changed 
 */
function update(serviceType, projectName, updatedBy, changed){
    try{
        const filePath = path.resolve(path.join(__dirname, `../../logs/${projectName}`));
        if(!fs.existsSync(filePath)){
            fs.mkdirSync(filePath);
        }
        const todoJsonPath = filePath + '/todos.json';
        const dateTime = moment().format('YYYY-MM-DD | HH:mm:ss');
        const todoJson = {
            "dateTime" : `${dateTime}`, 
            "projectName": `${projectName}`, 
            "updatedBy": `${updatedBy}`, 
            "changed": `${changed}` 
        };
        if(fs.existsSync(todoJsonPath)){
            let temp = [];
            try{
                const fileData = fs.readFileSync(todoJsonPath);
                temp = JSON.parse(fileData);
            }catch(err){
                console.error(`Error at JsonLog: ${err}`);
            }
            temp.push(todoJson);
            fs.writeFileSync(todoJsonPath, JSON.stringify(temp));
        }else{
            const data = [todoJson];
            fs.writeFileSync(todoJsonPath, JSON.stringify(data));
        };
        /* If need .log file as well
        const todoLogPath = filePath + '/todos.log';
        const todoLogStream = fs.createWriteStream(todoLogPath, { flags : 'a'});
        const todoLog = `| ${serviceType} Log | ${dateTime} | ${projectName} | ${updatedBy} | ${changed}`;
        console.log(todoLog);
        todoLogStream.write(todoLog + '\n');
        */

    }catch(err){
        console.error(`Error at innerLog - update: ${err}`);
    }
};

process.on('exit', () => {
    errorLogStream.end();
})

module.exports = { update };
