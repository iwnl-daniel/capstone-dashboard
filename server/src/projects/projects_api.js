const axios = require('axios');
const { createProject, getProject, updateNotification, addUserToProject } = require('./projects_functions.js');
const {InnerResponse } = require('../response/response_function.js');
const { searchJira } = require('../jira/jira_api.js');
const { gitUserFetchData } = require('../gitlab/gitlab_api.js');
const { sonarGetdata } = require('../sonar/sonar_functions.js');
const { addProjectToUser  } = require('../users/user_functions.js')

require('dotenv').config();
/**
 * Function for project config, this is the sequence that come with user config
 * Now the system will create the project object for database 
 * @param {string} userProjectName 
 * @param {string} userEmail 
 * @param {string} userEmailList 
 * @param {string} userJiraLink 
 * @param {string} userGitLabLink 
 * @param {string} userSonarLink 
 * @return {InnerResponse} - Customized response for frontend - if successs or not
 */
const projectConfig = async(userProjectName, userEmail, userEmailList, userJiraLink, userGitLabLink, userSonarLink) => {
    try{

        let res = await createProject(userProjectName, userEmail, userEmailList, userJiraLink, userGitLabLink, userSonarLink);
        console.log(res);

    }catch(err){
        console.error(`Error at projectConfig: ${err}`);

    }
}
/**
 * Function for fetch the project data in this function.
 * First, we will get the project information from the project database. 
 * After we have the project information [jiraLink, gitlabLink, sonarLink]. 
 * We will call the fetch data for each instance. 
 * Then return project Information as a response for all info
 * @param {string} projectName 
 * @returns {dictionary} projectInfomation
 */

const projectFetchData = async(projectName) => {
    try{
        let projectData = await getProject(projectName);
        let jiraInfo = await searchJira(projectData["jiraLink"]);
        let gitlabInfo = await gitUserFetchData(projectData["gitlabLink"]);
        let sonarInfo = await sonarGetdata(projectData["sonarLink"]);
        const res = {
            "projectName": projectName,
            "emailList" : projectData["emailList"],
            "jiraInfo" : jiraInfo,
            "gitlabInfo" : gitlabInfo,
            "sonarInfo" : sonarInfo[0],
            "todoList" : projectData["todoList"],
            "notification": projectData["notification"]
        }
        return res;
    }catch(err){
        console.error(`Error at projectFetchData: ${err}`);
    }
}

/**
 * This function is for user to toggle their email notification.
 * By default, when project object is created, the default value is True -> notification is on.
 * @param {string} projectName 
 * @param {string} userEmail 
 * @returns {boolean} True:False
 */
const projectUpdateNotification = async(projectName, userEmail) => {
    try{
        let resUpdate = await updateNotification(projectName, userEmail);
        return resUpdate;
    }catch(err){
        console.error(`Error at projectUpdateNotification: ${err}`);
    }
}

/**
 * This function will perform add a userEmail to the project's emailList
 * @param {*} projectName 
 * @param {*} addUser 
 * @returns {boolean} True:False
 */
const projectUpdateEmailList = async(projectName, addUser) => {
    try{
        let resUpdate = await addUserToProject(projectName, addUser);
        if(resUpdate != false){
            let resAdd = await addProjectToUser(addUser, resUpdate.projectName, resUpdate.jiraLink, resUpdate.gitlabLink, resUpdate.sonarLink);
            if(resAdd){
                return true;
            }else{
                return false;
            };
        };
    }catch(err){
        console.error(`Error at projectUpdateEmailList: ${err}`);
    };
};

module.exports = { projectConfig, projectFetchData, projectUpdateNotification, projectUpdateEmailList };
