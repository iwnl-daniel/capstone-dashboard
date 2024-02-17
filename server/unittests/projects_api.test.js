const axios = require('axios');
const { createProject, getProject, updateNotification, addUserToProject } = require('../src/projects/projects_functions.js');
const {InnerResponse } = require('../src/response/response_function.js');
const { searchJira } = require('../src/jira/jira_api.js');
const { gitUserFetchData } = require('../src/gitlab/gitlab_api.js');
const { sonarGetdata } = require('../src/sonar/sonar_functions.js');
const { addProjectToUser  } = require('../src/users/user_functions.js');
const { projectFetchData, projectUpdateNotification } = require('../src/projects/projects_api.js');


require('dotenv').config();

describe('project fetch data', () => {
    test('Should return project information detail', async() => {
        const projectName = "unittest";
        const expected = expect.objectContaining({
                projectName: projectName,
                jiraInfo : expect.anything(),
                gitlabInfo : expect.anything(),
                sonarInfo: expect.anything(),
                todoList: expect.anything(),
                notification : expect.any(Boolean),
        });
        const res = await projectFetchData(projectName);
        expect(res).toEqual(expected);
    })
    test('If the project name doesnt exist', async() => {
        const projectName = "ProjectNone";
        const res = await projectFetchData(projectName);
        expect(res == undefined).toBe(true);
    })
});

