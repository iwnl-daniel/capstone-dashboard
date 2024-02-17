const axios = require('axios');
const { updateUserData, userGetdata, userFetchAllData } = require('./user_functions.js');
const { searchJira } = require('../jira/jira_api.js');
const { gitUserFetchData } = require('../gitlab/gitlab_api.js');
const { sonarInterface } = require('../sonar/sonar_api.js');
const { sonarGetdata } = require('../sonar/sonar_functions.js');

require('dotenv').config();

/**
 * This function will return the userEmai data - all the projects that user have 
 * @param {string} userEmail 
 * @returns {dictionary} userInfo
 */
const userData = async (userEmail) => {
  try {
    const user = await userGetdata(userEmail);
    return user;
  } catch (err) {
    console.error(`Error at userData: ${err}`);
  }
};

/**
 * During the project creation, this is the main function that handle all the users configuration
 * @param {string} userEmail 
 * @param {string} userEmailList 
 * @param {string} userProjectName 
 * @param {string} userJiraLink 
 * @param {string} userGitlabLink 
 * @param {string} userSonarLink 
 * @returns {object} InnerResponse
 */
const userConfig = async(userEmail, userEmailList, userProjectName, userJiraLink, userGitlabLink, userSonarLink) => {
    try{
        let updated = await updateUserData(userEmail, userEmailList, userProjectName, userJiraLink, userGitlabLink, userSonarLink);
        return updated;
    }catch(err){
        console.error(`User Config: Can't config this user: ${updated}`);
    }
};

/**
 * Function for user fetch data, First we will get this user - project information
 * Then create a dictionary with all the key that we need, and pass them to the instances fetch data
 * and return all the response
 * @param {string} userEmail 
 * @param {string} projectName 
 * @returns {dictionary} user project info
 */
const userFetchData = async(userEmail, projectName) => {
    try{
        let userData = await userFetchAllData(userEmail, projectName);
        let userJiraLink = userData["projectList"][0]["jiraLink"];
        let userGitlabLink = userData["projectList"][0]["gitlabLink"];
        let userSonarLink = userData["projectList"][0]["sonarLink"];
        let jiraInfo = await searchJira(userJiraLink);
        let gitlabInfo = await gitUserFetchData(userGitlabLink);
        let sonarInfo = await sonarGetdata(userSonarLink);
        let res = {
            "projectName": projectName,
            "jiraInfo" : jiraInfo,
            "gitlabInfo" : gitlabInfo,
            "sonarInfo" : sonarInfo[0]
        }

        return res;
    }catch(err){
        console.error(`Error at userFetchData: ${err}`);
  }
};

const userDeleteProject = async(projectName) => {
    try{
        if(projectName === undefined || projectName.length <= 0){
            return false;
        }
        //get the project -< get all the user list -> delete the project from there account
        let userDelete = await deleteProjectFromUser(projectName);
        //check if it is completed deleted
        if(userDelete){
            
        }else{
            return false;
        }

    }catch(err){

    }
}

module.exports = { userConfig, userData, userFetchData, userDeleteProject };
