const mongoose = require('mongoose');
const { searchJira } = require('../jira/jira_api.js');
const {gitUserFetchData} = require('../gitlab/gitlab_api.js');
const {sonarGetdata} = require('../sonar/sonar_functions.js');
const {InnerResponse, userCreateResponse} = require('../response/response_function.js');
const { createProject, getProject, deleteProject } = require('../projects/projects_functions.js');
require('dotenv').config();

//connect to mongo
try{
    mongoose.connect(`mongodb+srv://capstone:${process.env.MONGO_PASSWORD}@cluster0.9lkorgn.mongodb.net/?retryWrites=true&w=majority`,
    );
}catch(err){
    console.error("Can't connect to DB");
}

//Open the connection
const db = mongoose.connection;
db.once("open", () => {
    console.log("User DB Connection is on");
});

const userDataSchema = new mongoose.Schema(
    {
        userEmail: String,
        projectList: Array
    }
);

const userSchema = mongoose.model('users', userDataSchema);

/**
 * This function will handle all the update data for user
 * During the project creation, we will check the given link, before push it to our database
 * If one or more link are invalid, your will get return response with the specific info.
 * For which service link is invalid. 
 * Then we will pass all the link to create the project. 
 * Then in each user in emailList, and the creator. we will loop through and append this new
 * project to their projectList.
 * Finally, if everything is success, we will return the project object info. 
 * 
 * @param {string} userEmail 
 * @param {string} userEmailList 
 * @param {string} userProjectName 
 * @param {string} userJiraLink 
 * @param {string} userGitlabLink 
 * @param {string} userSonarLink 
 * @returns {userCreateResponse} customized response to capture failed part
 */
const updateUserData = async(userEmail, userEmailList, userProjectName, userJiraLink, userGitlabLink, userSonarLink) => {
    try{

        let check = 3;
        const resStatus = [];

        //Check Jira Link
        const jiraInfo = await searchJira(userJiraLink);
        if(jiraInfo === undefined || jiraInfo.length <= 0){
            let jiraErr = new InnerResponse('Jira', 'FAIL', 'query invalid');
            resStatus.push(jiraErr.info);
            --check;
        }
        
        //check git lab link
        const gitlabInfo = await gitUserFetchData(userGitlabLink);
        if(gitlabInfo === undefined || gitlabInfo.length <= 0){
            let gitErr = new InnerResponse('Gitlab', 'FAIL', 'link invalid');
            resStatus.push(gitErr.info);
            --check;
        };

        //check sonar link
        const sonarInfo = await sonarGetdata(userSonarLink);
        if(sonarInfo === undefined || sonarInfo.length <= 0){
            let sonarErr = new InnerResponse('Sonar', 'FAIL', 'link invalid');
            resStatus.push(sonarErr.info);
            --check;
        };
        

        //check if all link is valid if not return error
        if(check < 3){
            return new userCreateResponse(resStatus, []).info;
        }

        //Create the userEmail list from the string
        let userList = []
        //check if the userList is undefined or string is empty
        console.log(userEmailList);
        if(userEmailList === undefined || userEmailList.length <= 0){
            userList.push(userEmail);
        }else{
            console.log("HOT");
            userList = userEmailList.split(',');
            userList.push(userEmail);
        }

        const resProject = await createProject(userProjectName, userEmail, userList, userJiraLink, userGitlabLink, userSonarLink);
        //if the project is not able to created -> error out 
        if(resProject.status != "OK"){
            return resProject;
        }
        for(i in userList){
            const checkUserExist = await isUserExist(userList[i]);
            //create the new project
            if(checkUserExist){
                console.log("User Exist");
                //update data for existing user
                await appendProject(userList[i], userProjectName, userJiraLink, userGitlabLink, userSonarLink);
                if(userList[i] == userEmail){
                    let completed = new InnerResponse("UserConfig", "OK", "User exist - Updated to DB");
                    resStatus.push(completed.info);
                    return new userCreateResponse(resStatus, await userGetdata(userList[i])).info;
                }
            }else{
                let updateData = {
                    userEmail: userList[i],
                    projectList: [
                        {
                            projectName: userProjectName,
                            jiraLink: userJiraLink,
                            gitlabLink: userGitlabLink,
                            sonarLink: userSonarLink,
                        }
                    ]
                };
                
                const newUser = new userSchema(updateData);
                try{
                    await newUser.save();
                    console.info("UPDATE TO DB");
                    if(userList[i] == userEmail){
                        let completed = new InnerResponse("UserConfig", "OK", "New User - Updated to DB");
                        resStatus.push(completed.info);
                        return new userCreateResponse(resStatus, await userGetdata(userList[i])).info;
                    }
                }catch(err){
                    console.error("Can't save new user to database");
                };
            };
        };
    }catch(err){
        console.error(`Can't update user data: ${err}`);
    };
};

/**
 * This function handles add the new project to user object
 * @param {string} userEmail 
 * @param {string} userProjectName 
 * @param {string} userJiraLink 
 * @param {string} userGitlabLink 
 * @param {string} userSonarLink 
 * @returns {boolean} if update is success return true, else return false
 */
const addProjectToUser = async(userEmail, userProjectName, userJiraLink, userGitlabLink, userSonarLink) => {
    try{
        const checkUserExist = await isUserExist(userEmail);

        if(checkUserExist){
            console.log("User Exist");
            //if user already have this project
            if(await isProjectNameExist(userEmail, userProjectName)){
                console.log('ProjectName is exist - remove')
                const user = await userSchema.findOne({userEmail});
                if(user){
                    user.projectList = user.projectList.filter(project => project.projectName !== userProjectName);
                    await user.save();
                }
            }else{
                console.log("ProjectName not exist - append")
                await appendProject(userEmail, userProjectName, userJiraLink, userGitlabLink, userSonarLink);
            }
            return true;
        }

        let updateData = {
            userEmail: userEmail,
            projectList: [
                {
                    projectName: userProjectName,
                    jiraLink: userJiraLink,
                    gitlabLink: userGitlabLink,
                    sonarLink: userSonarLink,
                }
            ]
        };
        const newUser = new userSchema(updateData);
        try{
            await newUser.save();
            console.info("UPDATE TO DB");
            return true;

        }catch(err){
            console.error("Can't save new user to database");
            return false;
        }
    }catch(err){
        console.error(`Can't update user data: ${err}`);
    }
};

/**
 * This function will return the user infomation - included all project
 * @param {string} userEmail 
 * @returns {dictionary} userInfo
 */
const userGetdata = async(userEmail) => {
    try{
        const found = await userSchema.find({userEmail: userEmail});
        return found;
    }catch(err){
        console.error(`Error at userGetdata: ${err}`);
    }
}

/**
 * This function will get the project information, within this user projectList
 * @param {string} aUserEmail 
 * @param {string} projectName 
 * @returns {dictionary} user - projectInfo
 */
const userFetchAllData = async(aUserEmail, projectName) => {
    try{
        const found = await userSchema.findOne({ userEmail: aUserEmail, "projectList.projectName": projectName,},{"projectList.$" : 1});
        if(!found) {
            console.error("Project not found");
            return;
        }
        return found;
    }catch(err){
        console.error(`Error at userFetchAllData: ${err}`);
    }
}

/**
 * This is helper function to check if the user is exist 
 * @param {string} aUserEmail 
 * @returns {boolean} if user exist return true, else return false
 */
const deleteProjectFromUser = async(aProjectName) => {
    try{
        const project = await getProject(aProjectName);
        const userList = project.emailList;
        for(x in userList){
            await userSchema.findOneAndUpdate(
                {userEmail : userList[x]},
                {$pull: {projectList: {projectName : aProjectName}}},
                {new : true}
            );
            console.log(`Remove Project: ${aProjectName} from User: ${userList[x]} `);
        }
        const projectDel = await deleteProject(aProjectName);
        if(projectDel){
            return true;
        }
        return false;
    }catch(err){
        console.error(`Error at deleteProjectFromUser: ${err}`);
    }
}


async function isUserExist(aUserEmail){
    try{
        const count = await userSchema.countDocuments({userEmail:aUserEmail});
        return count > 0;
    }catch(err){
        console.error(`Error at isUserExist: ${err}`);
    }
}

/**
 * This function will handle when user add more project to their project list
 * @param {string} userEmail 
 * @param {string} userProjectName 
 * @param {string} userJiraLink 
 * @param {string} userGitlabLink 
 * @param {string} userSonarLink 
 */
async function appendProject(userEmail, userProjectName, userJiraLink, userGitlabLink, userSonarLink){
    try{
        let newProject = {
            projectName : userProjectName,
            jiraLink: userJiraLink,
            gitlabLink: userGitlabLink, 
            sonarLink: userSonarLink,
        }
        await userSchema.findOneAndUpdate(
            {userEmail},
            { $push: {projectList: newProject}},
            { new : true}
        );
        console.log("Update User Data");
        return;
    }catch(err){
        console.error(`Can't create project dict: ${err}`);
    }
}

/**
 * This is a helper function - check inside user projectList, if this project name is already exist
 * @param {string} userEmail 
 * @param {string} userProjectName 
 * @returns {boolean} if project name exist return true, else return false
 */
async function isProjectNameExist(userEmail, userProjectName){
    try{
        const found = await userSchema.findOne({userEmail: userEmail, 'projectList.projectName': userProjectName});
        if(found) return true;
        else return false;
    }catch(err){
        console.error(`Error at isProjectNameExist: ${err}`);
    }
}



module.exports = {updateUserData, userGetdata, userFetchAllData, addProjectToUser, deleteProjectFromUser};
