const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const { InnerResponse } = require('../response/response_function.js');
const { createTodo, todoSchema } = require('../todoList/todo_functions.js');

const innerLog = require('../utils/innerLog.js');
require('dotenv').config();

try {
  mongoose.connect(
    `mongodb+srv://capstone:${process.env.MONGO_PASSWORD}@cluster0.9lkorgn.mongodb.net/?retryWrites=true&w=majority`
  );
} catch (err) {
  console.error("Can't connect to DB");
}

//Open the connection
const db = mongoose.connection;
db.once('open', () => {
  console.log('Projects DB Connection is on');
});

const projectDataSchema = new mongoose.Schema({
  projectName: String,
  projectCreator: String,
  emailList: Array,
  jiraLink: String,
  gitlabLink: String,
  sonarLink: String,
  todoList: {
    pm: Array,
    dev: Array,
    qa: Array,
  },
  notification: { type: Boolean, default: true },
});

const projectSchema = mongoose.model(
  'projects',
  projectDataSchema
);


/**
 * Function for create the project object and add to database
 * @param {string} userProjectName 
 * @param {string} userEmail 
 * @param {string} userEmailList 
 * @param {string} userJiraLink 
 * @param {string} userGitLabLink 
 * @param {string} userSonarLink 
 * @returns {InnerResponse} 
 */
const createProject = async ( userProjectName, userEmail, userEmailList, userJiraLink, userGitLabLink, userSonarLink) => {
  try {
    //check if this project name alreaedy exist
    if ((await isProjectExist(userProjectName)) == true) {
      return new InnerResponse( 'CreateProject', 'Fail', 'Project is already exist').info;
    };
    let projectObj = {
      projectName: userProjectName,
      projectCreator: userEmail,
      emailList: userEmailList,
      jiraLink: userJiraLink,
      gitlabLink: userGitLabLink,
      sonarLink: userSonarLink,
      todoList: {
        pm: [],
        dev: [],
        qa: [],
      },
      notification: true,
    };
    //New project
    const newProject = new projectSchema(projectObj);
    try {
      await newProject.save();
      console.info('New project added');
      return new InnerResponse( 'CreateProject','OK', 'New Project added').info;
    } catch (err) {
      console.error(`Can't add new project to DB: ${err}`);
    }
  } catch (err) {
    console.error(
      `Error at projects.createProject: ${err}`
    );
  }
};


/**
 * This function will search through the database.
 * Find the projectname, then update the notification field, based on the current value.
 * If current value is true, update to false, and vice versa
 * This function act as a toggle
 * @param {string} projectName 
 * @param {string} userEmail 
 * @returns {boolean} True:False
 */
const updateNotification = async(projectName, userEmail) => {
    try{
        let project = await projectSchema.findOne({projectName});
        if (project.notification){
            project.notification = false;
        }else{
            project.notification = true;
        };
        project.save();
        return true;
    }catch(err){
        console.error(`Error at updateNotification: ${err}`);
        return false;
    }
};

/**
 * Function to get all the project list 
 * @returns {dictionary} projectList
 */

const getProjects = async() => {
    try{
        return projectSchema.find();
    }catch(err){
        console.error(`Error at getProject: ${err}`);
}};

/**
 * Function to handle add new user to the project's emailList
 * Using the findOneAndUpdate moethod, with pull keyword to push new userEmail into the emailList
 * @param {string} projectName 
 * @param {string} addUser 
 * @returns {projectObject} on success return projectObject, else return false
 */

const addUserToProject = async(projectName, addUser) => {
    try{
        let updateProject;
        if(await isUserExist(projectName, addUser)){
            const pullData = {
                $pull : {
                    [`emailList`] : addUser,
                },
            };
            updateProject = await projectSchema.findOneAndUpdate(
                { projectName },
                pullData,
                { new: true }
            );
        }else{
            const addData = {
              $push: {
                [`emailList`]: addUser,
              },
            };
            updateProject = await projectSchema.findOneAndUpdate(
                { projectName },
                addData,
                { new: true }
            );
        }
        if(updateProject != null){
            return updateProject;
        }else{
            return false;
        };
    }catch(err){
        console.error(`Error at addUserToProject: ${err}`);
    }
};

/**
 * Function to add todo to project, by default when project is created, we will have todoList key, with pm,dev.qa subkey.
 * This function will grab the project todo, and add todo item to the list based on given parameters
 * @param {string} projectName 
 * @param {string} userEmail 
 * @param {string} todoTeam 
 * @param {string} todoName 
 * @returns {boolean} on success return true, else return false
 */

const addTodoProject = async ( projectName, userEmail, todoTeam, todoName) => {
  try {
    const addTodo = await createTodo( projectName, userEmail, todoName, todoTeam);
    const addData = {
      $push: {
        [`todoList.${todoTeam}`]: addTodo,
      },
    };
    const updateProject = await projectSchema.findOneAndUpdate(
        { projectName },
        addData,
        { new: true }
      );
    if(updateProject){
        let changed = `Added: ${todoName} to ${todoTeam} Team`
        innerLog.update("Todo", projectName, userEmail, changed)
        return true;
    }else{
        return false;
    };
  }catch (err) {
    console.error(`Error at addTodoProject: ${err}`);
    return false;
  }
};

/**
 * This function will update the status of given todo item.
 * The new value is based on the current value, if the todoStatus is true, the function will toggle update to false, and vice versa. 
 * This funciton act like a toggle feature
 * @param {string} projectName 
 * @param {string} userEmail 
 * @param {string} todoTeam 
 * @param {string} todoName 
 * @returns {boolean} on success return true, else return false
 */
const updateTodoProject = async( projectName, userEmail, todoTeam, todoName) => {
    try{
        let buff = "";
        const targetProject = await projectSchema.findOne({ projectName });
        if(!targetProject) return false;
        const todoList = targetProject.todoList[todoTeam];
        for(const todo in todoList){
            if(todoList[todo].todoName === todoName){
                todoList[todo].todoStatus = !todoList[todo].todoStatus;
                buff = `Update todo: ${todoName} - Status: ${todoList[todo].todoStatus} - Team: ${todoTeam}`
                innerLog.update("Todo", projectName, userEmail, buff);
            }
        }
        targetProject.markModified('todoList');
        await targetProject.save();
        return true;

    }catch(err){
        console.error(`Error at updateTodoProject: ${err}`);
        return false;
    }
};

/**
 * This fucntion will get the todoLogs from the todo log on the server.
 * The information about this infrastructure is provided in utils directory
 * @param {string} projectName 
 * @returns {JSON} todoLogs
 */

const getTodoHistory = async(projectName) => {
    try{
        const filePath = path.join(__dirname, `../../logs/${projectName}/todos.json`);
        if(fs.existsSync(filePath)){
            let temp = [];
            const fileData = fs.readFileSync(filePath);
            temp = JSON.parse(fileData);
            return temp;
        }else{
            return [];
        }
    }catch(err){
        console.error(`Error at getTodoHistory: ${err}`);
    }

};


/**
 * Function for get projectInfo
 * @param {string} projectName 
 * @returns {dictionary} projectInfo
 */
const getProject = async (projectName) => {
  try {
    return projectSchema.findOne({
      projectName: projectName,
    });
  } catch (err) {
    console.error(`Error at getProject: ${err}`);
  }
};

/**
 * Helper function to check if this project exist
 * @param {string} projectName
 * @return {boolean} if project exist, return true, else return false
 */
const deleteProject = async(projectName) => {
    try{
        const res = await projectSchema.deleteOne({projectName});
        if(res.deletedCount == 1){
            console.log("delete project completed");
            return true;
        }else{
            console.log("Project not found ");
            return false;
        }
    }catch(err){
        console.error(`Error at deleteProject: ${err}`);
    }

};

async function isProjectExist(aProjectName) {
  try {
    const found = await projectSchema.findOne({
      projectName: aProjectName,
    });
    if (found) return true;
    else return false;
  } catch (err) {
    console.error(
      `Error at projects.isProjectExist: ${err}`
    );
  }
}

/**
 * Helper function to check if this user is already in the project
 * @param {string} aProjectName 
 * @param {string} aUser 
 * @returns {boolean} if user exist return true, else return false
 */
async function isUserExist(aProjectName, aUser) {
    try{
        const found = await projectSchema.findOne({
            projectName: aProjectName,
            emailList: aUser
        });
        if(found) return true;
        else return false;
    }catch(err){
        console.error(`Error at isUserExist: ${err}`);
    }
}


module.exports = { createProject, getProjects, addTodoProject, getProject, updateNotification, updateTodoProject, addUserToProject, getTodoHistory, deleteProject };
