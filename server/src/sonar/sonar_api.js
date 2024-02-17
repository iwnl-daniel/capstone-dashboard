const axios = require('axios');
require('dotenv').config()

const {updateSonarData, sonarGetdata, filterSonarUrl} = require('./sonar_functions.js');

const key = {
    headers : {"Authorization" : process.env.SONAR_PRIVATE_TOKEN}
}

//Depends how user will give us a link, if full like has projectID - will use this filter
const {filterUrl} = require('./sonar_functions.js');


//This will get the current project analyzes summary
/**
 * This function is for get sonar project information - this is aligned with sonar project info api
 * @param {string} projectLink 
 * @param {string} projectId 
 * @returns {dictionary} sonar response
 */
const sonarGetProjectInfo = async(projectLink, projectId) => {
    const url = `${projectLink}/api/project_analyses/search?project=${projectId}`;
    try{
        const res = await axios.get(url, {
            params: {
                project: projectId
                },
            headers: {
                'Authorization': 'Basic ' + Buffer.from(process.env.SONAR_PRIVATE_TOKEN).toString('base64')
                }
            });
        return res.data;
    }catch(err){
        //If it hit 404/401 ... for the first time - Recall the api again. (Free version problem)
        console.error(`Error hit SonarGetProjectInfo: ${err}`);
    }
};

/**
 * This function is to get the project quality gate information.
 * This aligned with sonar api - quality gates
 * @param {string} projectLink 
 * @returns {dictionary} sonar response
 */
const sonarGetQualityGates = async(projectLink) => {
    let pLink = await filterSonarUrl(projectLink);
    const url = `${pLink["projectLink"]}/api/qualitygates/project_status`;
    try{
        const res = await axios.get(url, {
            params: {
                projectKey: pLink["projectKey"],
            },
            auth: {
                username: process.env.SONAR_USERNAME,
                password: process.env.SONAR_PASSWORD
            }

        });
        updateSonarData(projectLink, res.data);
        return res.data;
    }catch(err){
        //If it hit 404/401 ... for the first time - Recall the api again. (Free version problem)
        console.error(`Error hit sonarGetQualityGates: ${err}`);
    }
};

/**
 * This is for get sonar project code smell
 * @param {string} projectLink 
 * @returns {dictionary} sonar reponse
 */
const sonarGetCodeSmell = async(projectLink) => {
    let pLink = await filterSonarUrl(projectLink);
    const url = `${pLink["projectLink"]}/api/issues/search`;
    try{
        const res = await axios.get(url, {
            params: {
                componentKeys: pLink["projectKey"],
                resolved: false,
                type: 'CODE_SMELL',
                languages: 'java',
                ps: 50,
            },
            auth: {
                username: process.env.SONAR_USERNAME,
                password: process.env.SONAR_PASSWORD
            }
        });
        return res.data;
    }catch(err){
        console.error(`Error hit sonarGetCodeSmell: ${err}`);
    }
};

/**
 * This is for frontend - the get sonar info from our project buffer
 * @param {string} projectLink 
 * @returns {dictionary} sonar info in our buffer database
 */
const sonarInterface = async(projectLink) => {
    try{
        const res = sonarGetdata(projectLink);
        return res;
    }catch(err){
        return err;
    }
}


module.exports = {sonarGetProjectInfo, sonarGetQualityGates, sonarInterface, sonarGetCodeSmell};
