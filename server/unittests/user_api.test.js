const { userGetData, userFetchAllData} = require('../src/users/user_functions.js');
const { userData } = require('../src/users/user_api.js');
const { searchJira } = require('../src/jira/jira_api.js');
const { gitUserFetchData } = require('../src/gitlab/gitlab_api.js');
const { sonarInterface } = require('../src/sonar/sonar_api.js');
const { sonarGetdata } = require('../src/sonar/sonar_functions.js');


describe('userData', () => {
    test('Should return sonar data', async() => {
        const userEmail = "unittest@mail.com";
        const expected = [
            expect.objectContaining({
                userEmail: userEmail,
                projectList: expect.any(Array),
            })
        ]
        const res = await userData(userEmail);
        expect(res).toEqual(expected);
    })
})

describe('userFetchData', () => {
    test('Should return the project info', async() => {
        const userEmail = 'unittest@mail.com';
        const projectName = 'unittest';
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
        const expected = expect.objectContaining({
                projectName: projectName, 
                jiraInfo: expect.any(Object),
                gitlabInfo: expect.any(Object),
                sonarInfo : expect.any(Object),
        });
        expect(res).toEqual(expected);
    })
})

