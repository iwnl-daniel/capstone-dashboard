const axios = require('axios');
const { gitGetData, filterGitlabUrl, constructReturnData} = require('./gitlab_functions.js');

require('dotenv').config();

/**
 * Secret Token Declaration
 */
const key = {
    headers: {'PRIVATE-TOKEN' : process.env.GITLAB_PRIVATE_TOKEN}
};

/**
 * This is an extra function incase we need to have just an overview of the 
 * Gitlab project information 
 * @param {string} projectId 
 * @returns {dictionary} Gitlab whole project overview detial
 */
const gitGetProjectInfo = async(projectId) => {
    const id = encodeURIComponent(projectId);
    const url = `https://gitlab.com/api/v4/projects/${id}`;
    try{
        const res = await axios.get(url,key);
        return res.data;
    }catch(err){
        console.error('GITLAB_LOG: Project not found');
    };
};

/**
 * This is an extra function incase we need to have indepth information about
 * the pipeline status 
 * @param {string} projectId - Gitlab project ID
 * @returns {dictionary} this gitlab project's pipeline status
 */
const gitGetPipelineStatus = async(projectId) => {
    const id = encodeURIComponent(projectId);
    const url = `https://gitlab.com/api/v4/projects/${id}/pipelines`;
    try{
        const res = await axios.get(url,key);
        return res.data;
    }catch(err){
        console.error('GITLAB_LOG: Project not found');
    };
};

/** 
    * This function is a helper funciton for get git branch infomation
    * Once we filter the given gitlab link from user we will get project ID and branch name.
    * The response from this api endpoint is gitlab branch information 
    * @param {int} id - Gitlab ID
    * @param {string} name - Gitlab Branch name
    * @return {dictionary} {branchInfo}, {branchPipelineInfo}
    */
const gitGetBranchInfo = async(id, name) => {
    try{
        const url1 = `https://gitlab.com/api/v4/projects/${id}/repository/branches/${name}`;
        const url2 = `https://gitlab.com/api/v4/projects/${id}/pipelines?ref=${name}`;
        try{
            const res1 = await axios.get(url1, key);
            const res2 = await axios.get(url2, key);
            const res = {
                branchInfo : res1.data,
                branchPipelineInfo: res2.data
            };
            return res
        }catch(err){
            console.error(`GITLAB_LOG: Cant find the branch name from this project: ${err}`);
            return false;
        };
    }catch(err){
    }
};


/** 
    * This is the function for project/user object to fetch data
    * This function is using when create a project, and fetch project information
    * @param {string} projectLink - the gitlab link that provided by user
    * @return {dictionary} - return data that is constructed for frontend 
    */
const gitUserFetchData = async(projectLink) => {
    try{
        let gitInfo = await getProjectId(projectLink);
        if(!gitGetBranchInfo(gitInfo["projectId"], gitInfo["branchName"])){
            throw new Error(`Can't fetch data from this link: ${projectLink}`);
        }
        let res = await gitGetBranchInfo(gitInfo["projectId"], gitInfo["branchName"]);
        res = await constructReturnData(res);
        return res;
    }catch(err){
    }

};

/**
 * This is a helper function to get a project ID from the gitlab project link.
 * @param {string} projectLink - The gitlab link that provided by user
 * @returns {string} gitlab project ID
 */
async function getProjectId(projectLink){
        //Filter the url to get OrgName, projectName, branchName
        const [orgName, projectName, branchName]  = await filterGitlabUrl(projectLink);

        //Get projectId
        const getIdUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(orgName)}%2F${encodeURIComponent(projectName)}`;
        const resGetId = await axios.get(getIdUrl,key);
        const res = {
            "projectId" : resGetId.data["id"],
            "orgName" : orgName,
            "projectName" : projectName,
            "branchName" : branchName
        }
        return res;
}

module.exports = {gitGetProjectInfo, gitGetBranchInfo, gitGetPipelineStatus, gitUserFetchData}
