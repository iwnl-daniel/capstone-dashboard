//This is for development
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3001;
var fs = require('fs');
const { sendEmail } = require('./email/email.js');

//Gitlab
const { gitGetProjectInfo, gitGetPipelineStatus } = require('./gitlab/gitlab_api.js');
//sonar
const { sonarGetProjectInfo,sonarGetQualityGates, sonarInterface, sonarGetCodeSmell } = require('./sonar/sonar_api.js');
//user
    const { userConfig, userData, userFetchData, userDeleteProject} = require('./users/user_api.js');
//jira
const { searchJira } = require('./jira/jira_api.js');
//project
const { getProjects, addTodoProject, updateTodoProject, getTodoHistory } = require('./projects/projects_functions.js');
const { projectFetchData, projectUpdateNotification, projectUpdateEmailList } = require('./projects/projects_api.js');
const { deleteProjectFromUser } = require('./users/user_functions.js');

//Overload log
require('./utils/errorLog.js');

const app = express();
app.use(cors());
app.use(express.json({ limit: '30mb', extended: true }));

/* =========================================== */
//Jira APIs Section
//Get Data from JQL
app.get('/jira', async (req, res) => {
  try {
    let jql = req.query.projectLink;
    let ticketInfo = await searchJira(jql);
    res.send(ticketInfo);
  } catch (err) {
    res.status(400);
  }
});

/* =========================================== */

//Gitlab APIs Section
//Get project information
//Only for fetch testing
app.get('/gitlab/:projectId', async (req, res) => {
  const projectId = req.params.projectId;
  try {
    const projectInfo = await gitGetProjectInfo(projectId);
    res.send(projectInfo);
  } catch (err) {
    res.status(500).json({ error: `${err}` });
  }
});

//get the project pipeline information
//Only for fetch testing
app.get('/gitlab/pipeline/:projectId', async (req, res) => {
  const projectId = req.params.projectId;
  try {
    const pipelineStatus = await gitGetPipelineStatus(
      projectId
    );
    console.log(JSON.stringify(pipelineStatus));
    res.send(pipelineStatus);
  } catch (err) {
    res.status(500).json({ error: `${err}` });
  }
});

/* =========================================== */
//SonarQube Section

//Get project analyse information
//Only for fetch testing
app.get('/sonar', async (req, res) => {
  try {
    let projectLink = req.query.projectLink;
    let projectId = req.query.projectId;
    const summary = await sonarGetProjectInfo(
      projectLink,
      projectId
    );
    res.send(summary);
  } catch (err) {
    res.status(500).json({ error: `${err}` });
  }
});

//Get project quality gate info
//Only for fetch testing
app.post('/sonar/create', async (req, res) => {
  try {
    let projectLink = req.query.projectLink;
    let projectKey = req.query.projectKey;
    const summary = await sonarGetQualityGates(
      projectLink,
      projectKey
    );
    res.send(summary);
  } catch (err) {
    res.status(500).json({ error: `${err}` });
  }
});

//Sonar Interface for frontend
//Only for fetch testing
app.get('/sonar/interface/', async (req, res) => {
  try {
    let projectLink = req.query.projectLink;
    const projectDetails = await sonarInterface( projectLink );
    res.send(projectDetails);
  } catch (err) {
    res.status(500).json({ error: `${err}` });
  }
});
//Get code Smell
app.get('/sonar/codesmell', async(req,res) => {
    try{
        let projectLink = req.query.projectLink;
        const projectSmell = await sonarGetCodeSmell(projectLink);
        res.send(projectSmell);
    } catch (err) {
      res.status(500).json({ error: `${err}` });
    }
});

/* =========================================== */
//User Section

//Post user Config information + Project Configuration
app.post('/user/config', async (req, res) => {
  try {
    let userEmail = req.query.email;
    let userProjectName = req.query.projectName;
    let userJiraLink = req.query.jiraLink;
    let userGitlabLink = req.query.gitlabLink;
    let userSonarLink = req.query.sonarLink;
    let userEmailList = req.query.emailList;
    try {
      let temp = await userConfig(
        userEmail,
        userEmailList,
        userProjectName,
        userJiraLink,
        userGitlabLink,
        userSonarLink
      );
      res.status(200).send(temp);
    } catch (err) {
      res.status(404).json({ error: `${err}` });
    }
  } catch (err) {
    res.status(400).json({ error: `${err}` });
  }
});
app.get('/user', async (req, res) => {
  try {
    let userInfo = await userData(req.query.userEmail);
    res.send(userInfo);
  } catch (err) {
    res.status(500).json({ error: `${err}` });
  }
});

app.get('/user/interface/project', async (req, res) => {
  try {
    let userProjectInfo = await userFetchData(
      req.query.userEmail,
      req.query.projectName
    );
    res.send(userProjectInfo);
  } catch (err) {
    res.status(404).json({ error: `${err}` });
  }
});

/* EMAIL NOTIFICATION */
app.post('/email', async (req, res) => {
  try {
    const { emailList, projectName, message } = req.body;
    const response = await sendEmail(
      emailList,
      projectName,
      message
    );

    res.status(200).json({ resonse: response });
  } catch (err) {
    res.status(404).json({ error: `${err}` });
  }
});

app.post('/user/delete/project', async(req,res) => {
    try{
        const deleteStatus = await deleteProjectFromUser(req.query.projectName);
        if(deleteStatus){
            res.status(202).send("OK");
        }else{
            res.status(400).send("FAIL");
        }

    }catch(err){
        res.status(404).json({error: `${err}`});
    }

})

/* =========================================== */

//Projects Section
//Get all projects in the database
app.get('/projects', async (req, res) => {
  try {
    let allProject = await getProjects();
    res.send(allProject);
  } catch (err) {
    res.status(404).json({ error: `${err}` });
  }
});

//Get project information
app.get('/project', async (req, res) => {
  try {
    const projectInfo = await projectFetchData(
      req.query.projectName
    );
    res.send(projectInfo);
  } catch (err) {
    res.status(404).json({ error: `${err}` });
  }
});

//Toggle Project Notification
app.put('/project/notification', async(req,res) => {

    try{
        const update = await projectUpdateNotification(req.query.projectName, req.query.userEmail);
        if(update){
            res.status(202).send({response:"OK"});
        }else{
            res.status(404).json({status : `Project not found`});
        };
    }catch(err){
        res.status(404).json({error : `${err}`});
    }

});

app.post('/project/toggle/user', async(req,res) => {
 
    try{
        const update = await projectUpdateEmailList(req.query.projectName, req.query.userEmail);
        if(update){
            res.status(202).send({response: "OK"});
        }else{
            res.status(400).send({response: "User already exist"});
        }
    }catch(err){
        res.status(404).json({error : `${err}`});
    }
})

//Create the todo item that link to the project
app.post('/project/todo/add', async (req, res) => {
  try {
    let resTodo = await addTodoProject( req.query.projectName, req.query.userEmail, req.query.todoTeam, req.query.todoName);
    if (resTodo) {
      res.status(200).send('OK');
    } else {
      res.status(404).send('FAIL');
    }
  } catch (err) {
    res.status(404).json({ error: `${err}` });
  }
});

//Update todo status
app.post('/project/todo/update', async(req,res) => {
    try{
        let resTodo = await updateTodoProject( req.query.projectName, req.query.userEmail, req.query.todoTeam, req.query.todoName);
        if (resTodo) {
          res.status(200).send('OK');
        } else {
          res.status(404).send('FAIL');
        };
    }catch(err){
        res.status(404).json({ error: `${err}` });
    }
});

//Get Todo History
app.get('/project/todo/history', async(req,res) => {
    try{
        let resTodo = await getTodoHistory(req.query.projectName);
        if(resTodo.length >= 0){
            return res.send(resTodo);
        }else{
          res.status(404).send('FAIL');
        }
    }catch(err){
        res.status(404).json({ error: `${err}` });
    }
});


app.listen(3001, () => {
  console.log(`Server started on port ${port}`);
});
