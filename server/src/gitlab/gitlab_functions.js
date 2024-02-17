const mongoose = require('mongoose');
require('dotenv').config()

/**
 * In this function, I am using the regex to get, organization name, project name
 * and brnach name from gitlab link 
 * @param {string} projectUrl - This is the gitlab project link user provided
 * @returns {Array} [organization name, project name, branch name]
 */
async function filterGitlabUrl(projectUrl){
    try{
        const regex = /https?:\/\/gitlab\.com\/([^\/]+)\/([^\/]+)\/-\/tree\/([^\/]+)/;
        const match = projectUrl.match(regex);
        if(!match){
            console.error("Invalid Gitlab URL");
            return;
        }
        const [, orgName, projectName, branchName] = match;
        return [orgName, projectName, branchName]
    }catch(err){
    }
};

/**
 * Function for constrict the return data to frontend. I selected the importand detail from
 * the response, and construct it into a dictionary 
 * @param {dictionary} branchSummary - This is the response from branch information and 
 * pipeline status
 * @returns {dictionary} - Information of selected data
 */
async function constructReturnData(branchSummary){
    try{
        let data = {
            branchLink: branchSummary["branchInfo"]["web_url"],
            branchName: branchSummary["branchInfo"]["name"],
            commit: {
                id: branchSummary["branchInfo"]["commit"]["id"],
                message: branchSummary["branchInfo"]["commit"]["message"],
                authorName: branchSummary["branchInfo"]["commit"]["author_name"],
                authorEmail: branchSummary["branchInfo"]["commit"]["author_email"],
                committedDate: branchSummary["branchInfo"]["commit"]["committed_date"],
                commitLink: branchSummary["branchInfo"]["commit"]["web_url"]
            },
        };
        data["pipelines"] = [];
        for(let i =0; i< branchSummary["branchPipelineInfo"].length; ++i){
            data["pipelines"].push({
                id: branchSummary["branchPipelineInfo"][i]["id"],
                ref: branchSummary["branchPipelineInfo"][i]["ref"],
                pipelineStatus: branchSummary["branchPipelineInfo"][i]["status"],
                pipelineLink: branchSummary["branchPipelineInfo"][i]["web_url"],
            })
        }
        return data;
    }catch(err){
        console.error(`Error at constructReturnData: ${err}`);
    }
};

module.exports = {filterGitlabUrl, constructReturnData};
